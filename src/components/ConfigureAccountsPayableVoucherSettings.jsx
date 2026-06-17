// import React, { useEffect, useState } from "react";

// import {
//   FormInput,
//   FormSearchSelect,
//   FormSection,
// } from "../helper/formSection";
// import { ActionButton, MainContainer } from "../helper/container";
// import { Save, X } from "lucide-react";
// import { toast } from "react-toastify";
// import api from "../utils/api";
// import { backendUrl } from "./config";

// const ConfigureAccountsPayableVoucherSettings = () => {
//   const [data, setData] = useState({});
//   const [isDirty, setIsDirty] = useState(false);
//   const [loading, setLoading] = useState(false)
//   const [acct, setAcct] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [allData, setAllData] = useState("");

//   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

//   const getAcct = async () => {
//     try {
//       const res = await api.get(`${backendUrl}/api/Account/GetAllAccounts`);

//       if (res.data) {
//         setAcct(res.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fieldLabels = {
//     matchGoodsCode: "Goods Matching",
//     matchServicesCode: "Services Matching",
//     matchMiscCode: "Misc Matching",
//     matchPartsCode: "Parts Matching",
//     autoApprovePoFlag: "Approval Option",
//     defaultPoTaxSourceCode: "Taxable Status",
//     receiptLoadCode: "Receipt Quantity Autoload",
//     exchangeRateCode: "Exchange Rate Source",
//     individualVoucherMsgCode: "3-Way Individual (Voucher)",
//     totalVoucherMsgCode: "3-Way Total (Voucher)",
//     individualPostedVoucherMsgCode: "3-Way Individual (Posted)",
//     totalPostedVoucherMsgCode: "3-Way Total (Posted)",
//     defaultApTaxSourceCode: "A/P Vouchers Tax Source",
//   };

//   const handleInputChange = (field, value) => {
//     let finalValue = value;

//     // Validation for discountOrgIdCode character limit
//     if (field === "discountOrgIdCode" && value.length > 1) {
//       alert("Warning: Charge Organization Code cannot exceed 1 character.");
//       finalValue = value.slice(0, 1); // Truncate to keep the first character
//     }

//     setData((prev) => ({
//       ...prev,
//       [field]: finalValue,
//       isDirty: true,
//     }));
//   };

//   const getVoucherSetting = async () => {
//     try {
//       const res = await api.get(`${backendUrl}/api/voucher-settings/1`);
//       setData(res.data || initialState);
//       setAllData(res.data || initialState);
//     } catch (error) {
//       setData(initialState);
//     }
//   };

//   const handleSave = async () => {
//     // 1. Define which keys are mandatory (*)
//     const requiredFields = [
//       "matchGoodsCode",
//       "matchServicesCode",
//       "matchMiscCode",
//       "matchPartsCode",
//       "autoApprovePoFlag",
//       "defaultPoTaxSourceCode",
//       "receiptLoadCode",
//       "exchangeRateCode",
//       "individualVoucherMsgCode",
//       "totalVoucherMsgCode",
//       "individualPostedVoucherMsgCode",
//       "totalPostedVoucherMsgCode",
//       "defaultApTaxSourceCode",
//     ];

//     // 2. Loop through and check for empty/null values
//     for (const field of requiredFields) {
//       if (!data[field] || data[field] === "") {
//         const label = fieldLabels[field] || field;
//         // Using alert since your current code uses it,
//         // but toast.error(label + " is required") is recommended.
//         toast.error(`${label} is required!`);
//         return; // Exit early so API is not called
//       }
//     }

//     // 3. Check for "Dirty" status (Existing logic)
//     if (!data.isDirty) {
//       toast.info("No changes found to save.");
//       return;
//     }

//     // 4. API Call (Existing logic)
//     setLoading(true)
//     try {
//       const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

//       const { isDirty, ...payload } = data;
//       const finalPayload = {
//         ...payload,
//         companyId: "1",
//         modifiedBy: user.name,
//       };

//       const res = await api.post(
//         `${backendUrl}/api/voucher-settings`,
//         finalPayload,
//       );

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Settings saved successfully!");
//         setData((prev) => ({ ...prev, isDirty: false }));
//       }
//     } catch (error) {
//       console.error("Save Error:", error);
//       //   alert("Failed to save settings.");
//     } finally {
//       setLoading(false)
//     }
//   };

//   const handleDiscard = async () => {
//     const isModified = data?.isDirty;
//     if (!isModified) return;
//     const confirmDiscard = window.confirm(
//       "Are you sure you want to discard all unsaved changes?",
//     );

//     if (confirmDiscard) {
//       try {
//         setData({ ...allData });
//         toast.success("Changes discarded");
//       } catch (error) {
//         console.error("Discard operation failed:", error);
//         toast.error("Failed to reset data", { style: { fontSize: "11px" } });
//       }
//     }
//   };

//   useEffect(() => {
//     getVoucherSetting();
//     getAcct();
//   }, []);

//   return (
//     <div className="p-4 space-y-4 duration-500">
//       <MainContainer title="Accounts Payable Voucher Settings">
//         <div className="w-full flex items-center justify-end px-2 gap-1">
//           <ActionButton icon={X} onClick={handleDiscard} loading={loading} title={"Discard"} />
//           <ActionButton
//             icon={Save}
//             onClick={handleSave}
//             loading={loading}
//             title={"Save Record"}
//           />
//         </div>
//         <div className="space-y-3 p-1 py-2">
//           {/* SECTION 1: VOUCHER NUMBERING */}
//           <FormSection title="Voucher Numbering Method">
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
//               <div className="lg:col-span-3">
//                 <FormInput
//                   type="radio"
//                   label="Manual"
//                   checked={data.voucherNumberMethodCode === "M"}
//                   onChange={() =>
//                     handleInputChange("voucherNumberMethodCode", "M")
//                   }
//                 />
//               </div>
//               <div className="lg:col-span-3">
//                 <FormInput
//                   type="radio"
//                   label="System"
//                   checked={data.voucherNumberMethodCode === "S"}
//                   onChange={() =>
//                     handleInputChange("voucherNumberMethodCode", "S")
//                   }
//                 />
//               </div>
//               <div className="lg:col-span-6">
//                 <FormInput
//                   label="Last System Voucher Number"
//                   type="number"
//                   value={data.lastVoucherNumber || 0}
//                   // Disable if Manual is selected as per Image 2
//                   readOnly={data.voucherNumberMethodCode === "M"}
//                   className={
//                     data.voucherNumberMethodCode === "M" ? "bg-gray-200" : ""
//                   }
//                   onChange={(e) =>
//                     handleInputChange("lastVoucherNumber", e.target.value)
//                   }
//                 />
//               </div>
//             </div>
//           </FormSection>

//           {/* SECTION 2: APPROVALS */}
//           <FormSection title="Approval of A/P Vouchers">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               <FormInput
//                 type="checkbox"
//                 label="Require Approvals"
//                 checked={data.approvalRequiredFlag === "Y"}
//                 onChange={(e) =>
//                   handleInputChange(
//                     "approvalRequiredFlag",
//                     e.target.checked ? "Y" : "N",
//                   )
//                 }
//               />
//               <FormInput
//                 label="Approval Required Above"
//                 type="number"
//                 value={data.approvalRequiredAmount || 0}
//                 // Only allow input if Require Approvals is checked
//                 readOnly={data.approvalRequiredFlag !== "Y"}
//                 className={
//                   data.approvalRequiredFlag !== "Y"
//                     ? "bg-gray-200 text-gray-500"
//                     : ""
//                 }
//                 onChange={(e) =>
//                   handleInputChange("approvalRequiredAmount", e.target.value)
//                 }
//               />
//             </div>
//           </FormSection>

//           {/* SECTION 3: DUPLICATE INVOICES */}
//           <FormSection title="Duplicate Invoice Numbers in A/P">
//             <FormInput
//               type="checkbox"
//               label="Allow Duplicate Invoice Numbers"
//               checked={data.allowDuplicateInvoiceFlag === "Y"}
//               onChange={(e) =>
//                 handleInputChange(
//                   "allowDuplicateInvoiceFlag",
//                   e.target.checked ? "Y" : "N",
//                 )
//               }
//             />
//           </FormSection>

//           {/* SECTION 4: TAX DEFAULTS */}
//           <FormSection title="Tax Code Defaults">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
//               <div className="space-x-2 flex items-center m-1">
//                 <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
//                   A/P Vouchers *
//                 </label>
//                 <select
//                   value={data.defaultApTaxSourceCode || ""}
//                   onChange={(e) =>
//                     handleInputChange("defaultApTaxSourceCode", e.target.value)
//                   }
//                   className="flex-1 border border-gray-300 outline-none p-0.5 rounded font-light text-[10px] transition-all bg-white focus:border-[#17414d]"
//                 >
//                   <option value="">-Select-</option>
//                   <option value="N">Non-Taxable</option>
//                   <option value="S">Sales Taxable</option>
//                   <option value="U">Use Taxable</option>
//                 </select>
//               </div>
//               <FormInput
//                 type="checkbox"
//                 label="Post Use Tax Accrual"
//                 checked={data.defaultUseTaxFlag === "Y"}
//                 onChange={(e) =>
//                   handleInputChange(
//                     "defaultUseTaxFlag",
//                     e.target.checked ? "Y" : "N",
//                   )
//                 }
//               />
//             </div>
//           </FormSection>

//           {/* SECTION 5: DISCOUNTS (Mutually Exclusive Logic) */}
//           <FormSection title="Charge Discounts to">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Option A: Individual Line Items */}
//               <div className="space-y-3">
//                 <FormInput
//                   type="radio"
//                   label="Individual Line Items"
//                   checked={data.discountMethodCode === "L"}
//                   onChange={() => handleInputChange("discountMethodCode", "L")}
//                 />
//                 <FormInput
//                   type="select"
//                   label="Charge Organization of *"
//                   value={data.discountOrgIdCode || ""}
//                   // Disable dropdown if Individual Line Items is NOT selected
//                   disabled={data.discountMethodCode !== "L"}
//                   onChange={(e) =>
//                     handleInputChange("discountOrgIdCode", e.target.value)
//                   }
//                 />
//               </div>

//               {/* Option B: Discount Accounts */}
//               <div className="space-y-3">
//                 <FormInput
//                   type="radio"
//                   label="Discount Accounts"
//                   checked={data.discountMethodCode === "A"}
//                   onChange={() => handleInputChange("discountMethodCode", "A")}
//                 />
//                 <div className="flex gap-2 items-end">
//                   <div className="flex-1">
//                     <FormSearchSelect
//                       label="Account"
//                       value={data?.discountAccountId || ""}
//                       setSearchTerm={setSearchTerm}
//                       searchTerm={searchTerm}
//                       displayKey="acctId"
//                       secondaryKey="acctName"
//                       options={acct}
//                       disabled={data.discountMethodCode !== "A"}
//                       onSelect={(opt) =>
//                         handleInputChange("discountAccountId", opt.acctId)
//                       }
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <div className="space-x-2 flex items-center m-1">
//                       <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
//                         Post to G/L Discount Method *
//                       </label>
//                       <select
//                         value={data.postDiscountGlCode || ""}
//                         disabled={data.discountMethodCode !== "A"}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "postDiscountGlCode",
//                             e.target.value,
//                           )
//                         }
//                         className={`flex-1 border outline-none p-0.5 rounded font-light text-[10px] transition-all 
//       ${
//         data.discountMethodCode !== "A"
//           ? "bg-gray-100 border-gray-300 cursor-not-allowed text-gray-400"
//           : "bg-white border-gray-300 focus:border-[#17414d]"
//       }`}
//                       >
//                         <option value="">-Select-</option>
//                         <option value="G">Gross-Without Discounts</option>
//                         <option value="N">Net-Including Discounts</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </FormSection>

//           {/* SECTION 6: INTERCOMPANY */}
//           <FormSection title="Intercompany Work Orders">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <FormInput
//                   type="checkbox"
//                   label="Allow Automatic Creation of A/P Vouchers from Intercompany Work Orders"
//                   checked={data.allowIwoVoucherFlag === "Y"}
//                   onChange={(e) =>
//                     handleInputChange(
//                       "allowIwoVoucherFlag",
//                       e.target.checked ? "Y" : "N",
//                     )
//                   }
//                 />
//                 <FormInput
//                   type="checkbox"
//                   label="Create A/P Vouchers from Intercompany Work Orders with a status of Unapproved"
//                   checked={data.iwoUnapprovedVoucherFlag === "Y"}
//                   onChange={(e) =>
//                     handleInputChange(
//                       "iwoUnapprovedVoucherFlag",
//                       e.target.checked ? "Y" : "N",
//                     )
//                   }
//                 />
//               </div>
//               <FormInput
//                 label="Entry User ID for Vouchers Created"
//                 value={data.iwoEntryUser || ""}
//                 readOnly={data.allowIwoVoucherFlag !== "Y"}
//                 onChange={(e) =>
//                   handleInputChange("iwoEntryUser", e.target.value)
//                 }
//               />
//             </div>
//           </FormSection>
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

// const initialState = {
//   companyId: "",
//   approvalRequiredFlag: "",
//   approvalRequiredAmount: 0,
//   voucherNumberMethodCode: "",
//   lastVoucherNumber: 0,
//   discountMethodCode: "",
//   discountAccountId: "",
//   discountOrgIdCode: "",
//   poVoucherChangeFlag: "",
//   matchGoodsCode: "",
//   matchServicesCode: "",
//   matchMiscCode: "",
//   partialReceiptFlag: "",
//   serviceReceiptFlag: "",
//   goodsReceiptFlag: "",
//   miscReceiptFlag: "",
//   discrepancyUnitPriceAmount: 0,
//   discrepancyUnitPriceRate: 0,
//   discrepancyQuantityRate: 0,
//   defaultPoTaxSourceCode: "",
//   defaultApTaxSourceCode: "",
//   postDiscountGlCode: "",
//   partialMatchOptionCode: "",
//   goodsMatchOptionCode: "",
//   servicesMatchOptionCode: "",
//   miscMatchOptionCode: "",
//   defaultUseTaxFlag: "",
//   discrepancyTotalAmount: 0,
//   autoApprovePoFlag: "",
//   poApprovalRequiredAmount: 0,
//   matchPartsCode: "",
//   autoVoucherCode: "",
//   modifiedBy: user.name,
//   discrepancyPoTotalAmount: 0,
//   receiptLoadCode: "",
//   discrepancyTaxFlag: "",
//   rowVersion: 0,
//   allowDuplicateInvoiceFlag: "",
//   voucherPoReceiptFlag: "",
//   exchangeRateCode: "",
//   allowIwoVoucherFlag: "",
//   iwoEntryUser: "",
//   iwoUnapprovedVoucherFlag: "",
//   recalcDetailFlag: "",
//   invoiceEmailFlag: "",
//   invoiceEmailId: "",
//   individualVoucherMsgCode: "",
//   individualPostedVoucherMsgCode: "",
//   totalVoucherMsgCode: "",
//   totalPostedVoucherMsgCode: "",
//   receiptEmailFlag: "",
//   receiptEmailId: "",
//   multiLevelApprovalFlag: "",
//   multiLevelApprovalTolerance: 0,
// };

// export default ConfigureAccountsPayableVoucherSettings;

import React, { useEffect, useState } from "react";

import {
  FormInput,
  FormSearchSelect,
  FormSection,
} from "../helper/formSection";
import { ActionButton, MainContainer } from "../helper/container";
import { Save, X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { backendUrl } from "./config";

const ConfigureAccountsPayableVoucherSettings = () => {
  const [data, setData] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false)
  const [acct, setAcct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [allData, setAllData] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const renderRequiredLabel = (label) => (
    <>
      {label} <span className="text-red-600">*</span>
    </>
  );

  const getAcct = async () => {
    try {
      const res = await api.get(`${backendUrl}/api/Account/GetAllAccounts`);

      if (res.data) {
        setAcct(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fieldLabels = {
    matchGoodsCode: "Goods Matching",
    matchServicesCode: "Services Matching",
    matchMiscCode: "Misc Matching",
    matchPartsCode: "Parts Matching",
    autoApprovePoFlag: "Approval Option",
    defaultPoTaxSourceCode: "Taxable Status",
    receiptLoadCode: "Receipt Quantity Autoload",
    exchangeRateCode: "Exchange Rate Source",
    individualVoucherMsgCode: "3-Way Individual (Voucher)",
    totalVoucherMsgCode: "3-Way Total (Voucher)",
    individualPostedVoucherMsgCode: "3-Way Individual (Posted)",
    totalPostedVoucherMsgCode: "3-Way Total (Posted)",
    defaultApTaxSourceCode: "A/P Vouchers Tax Source",
  };

  const handleInputChange = (field, value) => {
    let finalValue = value;

    // Validation for discountOrgIdCode character limit
    if (field === "discountOrgIdCode" && value.length > 1) {
      alert("Warning: Charge Organization Code cannot exceed 1 character.");
      finalValue = value.slice(0, 1); // Truncate to keep the first character
    }

    setData((prev) => ({
      ...prev,
      [field]: finalValue,
      isDirty: true,
    }));
  };

  const getVoucherSetting = async () => {
    try {
      const res = await api.get(`${backendUrl}/api/voucher-settings/1`);
      setData(res.data || initialState);
      setAllData(res.data || initialState);
    } catch (error) {
      setData(initialState);
    }
  };

  const handleSave = async () => {
    // 1. Define which keys are mandatory (*)
    const requiredFields = [
      "matchGoodsCode",
      "matchServicesCode",
      "matchMiscCode",
      "matchPartsCode",
      "autoApprovePoFlag",
      "defaultPoTaxSourceCode",
      "receiptLoadCode",
      "exchangeRateCode",
      "individualVoucherMsgCode",
      "totalVoucherMsgCode",
      "individualPostedVoucherMsgCode",
      "totalPostedVoucherMsgCode",
      "defaultApTaxSourceCode",
    ];

    // 2. Loop through and check for empty/null values
    for (const field of requiredFields) {
      if (!data[field] || data[field] === "") {
        const label = fieldLabels[field] || field;
        // Using alert since your current code uses it,
        // but toast.error(label + " is required") is recommended.
        toast.error(`${label} is required!`);
        return; // Exit early so API is not called
      }
    }

    // 3. Check for "Dirty" status (Existing logic)
    if (!data.isDirty) {
      toast.info("No changes found to save.");
      return;
    }

    // 4. API Call (Existing logic)
    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

      const { isDirty, ...payload } = data;
      const finalPayload = {
        ...payload,
        companyId: "1",
        modifiedBy: user.name,
      };

      const res = await api.post(
        `${backendUrl}/api/voucher-settings`,
        finalPayload,
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Settings saved successfully!");
        setData((prev) => ({ ...prev, isDirty: false }));
      }
    } catch (error) {
      console.error("Save Error:", error);
      //   alert("Failed to save settings.");
    } finally {
      setLoading(false)
    }
  };

  const handleDiscard = async () => {
    const isModified = data?.isDirty;
    if (!isModified) return;
    const confirmDiscard = window.confirm(
      "Are you sure you want to discard all unsaved changes?",
    );

    if (confirmDiscard) {
      try {
        setData({ ...allData });
        toast.success("Changes discarded");
      } catch (error) {
        console.error("Discard operation failed:", error);
        toast.error("Failed to reset data", { style: { fontSize: "11px" } });
      }
    }
  };

  useEffect(() => {
    getVoucherSetting();
    getAcct();
  }, []);

  return (
    <div className="p-4 space-y-4 duration-500">
      <MainContainer title="Accounts Payable Voucher Settings">
        <div className="w-full flex items-center justify-end px-2 gap-1">
          <ActionButton icon={X} onClick={handleDiscard} loading={loading} title={"Discard"} />
          <ActionButton
            icon={Save}
            onClick={handleSave}
            loading={loading}
            title={"Save Record"}
          />
        </div>
        <div className="space-y-3 p-1 py-2">
          {/* SECTION 1: VOUCHER NUMBERING */}
          <FormSection title="Voucher Numbering Method">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-3">
                <FormInput
                  type="radio"
                  label="Manual"
                  checked={data.voucherNumberMethodCode === "M"}
                  onChange={() =>
                    handleInputChange("voucherNumberMethodCode", "M")
                  }
                />
              </div>
              <div className="lg:col-span-3">
                <FormInput
                  type="radio"
                  label="System"
                  checked={data.voucherNumberMethodCode === "S"}
                  onChange={() =>
                    handleInputChange("voucherNumberMethodCode", "S")
                  }
                />
              </div>
              <div className="lg:col-span-6">
                <FormInput
                  label="Last System Voucher Number"
                  type="number"
                  value={data.lastVoucherNumber || 0}
                  // Disable if Manual is selected as per Image 2
                  readOnly={data.voucherNumberMethodCode === "M"}
                  className={
                    data.voucherNumberMethodCode === "M" ? "bg-gray-200" : ""
                  }
                  onChange={(e) =>
                    handleInputChange("lastVoucherNumber", e.target.value)
                  }
                />
              </div>
            </div>
          </FormSection>

          {/* SECTION 2: APPROVALS */}
          <FormSection title="Approval of A/P Vouchers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormInput
                type="checkbox"
                label="Require Approvals"
                checked={data.approvalRequiredFlag === "Y"}
                onChange={(e) =>
                  handleInputChange(
                    "approvalRequiredFlag",
                    e.target.checked ? "Y" : "N",
                  )
                }
              />
              <FormInput
                label="Approval Required Above"
                type="number"
                value={data.approvalRequiredAmount || 0}
                // Only allow input if Require Approvals is checked
                readOnly={data.approvalRequiredFlag !== "Y"}
                className={
                  data.approvalRequiredFlag !== "Y"
                    ? "bg-gray-200 text-gray-500"
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("approvalRequiredAmount", e.target.value)
                }
              />
            </div>
          </FormSection>

          {/* SECTION 3: DUPLICATE INVOICES */}
          <FormSection title="Duplicate Invoice Numbers in A/P">
            <FormInput
              type="checkbox"
              label="Allow Duplicate Invoice Numbers"
              checked={data.allowDuplicateInvoiceFlag === "Y"}
              onChange={(e) =>
                handleInputChange(
                  "allowDuplicateInvoiceFlag",
                  e.target.checked ? "Y" : "N",
                )
              }
            />
          </FormSection>

          {/* SECTION 4: TAX DEFAULTS */}
          <FormSection title="Tax Code Defaults">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
              <div className="space-x-2 flex items-center m-1">
                <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
                  {renderRequiredLabel("A/P Vouchers")}
                </label>
                <select
                  value={data.defaultApTaxSourceCode || ""}
                  onChange={(e) =>
                    handleInputChange("defaultApTaxSourceCode", e.target.value)
                  }
                  className="flex-1 border border-gray-300 outline-none p-0.5 rounded font-light text-[10px] transition-all bg-white focus:border-[#17414d]"
                >
                  <option value="">-Select-</option>
                  <option value="N">Non-Taxable</option>
                  <option value="S">Sales Taxable</option>
                  <option value="U">Use Taxable</option>
                </select>
              </div>
              <FormInput
                type="checkbox"
                label="Post Use Tax Accrual"
                checked={data.defaultUseTaxFlag === "Y"}
                onChange={(e) =>
                  handleInputChange(
                    "defaultUseTaxFlag",
                    e.target.checked ? "Y" : "N",
                  )
                }
              />
            </div>
          </FormSection>

          {/* SECTION 5: DISCOUNTS (Mutually Exclusive Logic) */}
          <FormSection title="Charge Discounts to">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Option A: Individual Line Items */}
              <div className="space-y-3">
                <FormInput
                  type="radio"
                  label="Individual Line Items"
                  checked={data.discountMethodCode === "L"}
                  onChange={() => handleInputChange("discountMethodCode", "L")}
                />
                <FormInput
                  type="select"
                  label={renderRequiredLabel("Charge Organization of")}
                  value={data.discountOrgIdCode || ""}
                  // Disable dropdown if Individual Line Items is NOT selected
                  disabled={data.discountMethodCode !== "L"}
                  onChange={(e) =>
                    handleInputChange("discountOrgIdCode", e.target.value)
                  }
                />
              </div>

              {/* Option B: Discount Accounts */}
              <div className="space-y-3">
                <FormInput
                  type="radio"
                  label="Discount Accounts"
                  checked={data.discountMethodCode === "A"}
                  onChange={() => handleInputChange("discountMethodCode", "A")}
                />
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <FormSearchSelect
                      label="Account"
                      value={data?.discountAccountId || ""}
                      setSearchTerm={setSearchTerm}
                      searchTerm={searchTerm}
                      displayKey="acctId"
                      secondaryKey="acctName"
                      options={acct}
                      disabled={data.discountMethodCode !== "A"}
                      onSelect={(opt) =>
                        handleInputChange("discountAccountId", opt.acctId)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div className="space-x-2 flex items-center m-1">
                      <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
                        {renderRequiredLabel("Post to G/L Discount Method")}
                      </label>
                      <select
                        value={data.postDiscountGlCode || ""}
                        disabled={data.discountMethodCode !== "A"}
                        onChange={(e) =>
                          handleInputChange(
                            "postDiscountGlCode",
                            e.target.value,
                          )
                        }
                        className={`flex-1 border outline-none p-0.5 rounded font-light text-[10px] transition-all 
      ${
        data.discountMethodCode !== "A"
          ? "bg-gray-100 border-gray-300 cursor-not-allowed text-gray-400"
          : "bg-white border-gray-300 focus:border-[#17414d]"
      }`}
                      >
                        <option value="">-Select-</option>
                        <option value="G">Gross-Without Discounts</option>
                        <option value="N">Net-Including Discounts</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* SECTION 6: INTERCOMPANY */}
          <FormSection title="Intercompany Work Orders">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormInput
                  type="checkbox"
                  label="Allow Automatic Creation of A/P Vouchers from Intercompany Work Orders"
                  checked={data.allowIwoVoucherFlag === "Y"}
                  onChange={(e) =>
                    handleInputChange(
                      "allowIwoVoucherFlag",
                      e.target.checked ? "Y" : "N",
                    )
                  }
                />
                <FormInput
                  type="checkbox"
                  label="Create A/P Vouchers from Intercompany Work Orders with a status of Unapproved"
                  checked={data.iwoUnapprovedVoucherFlag === "Y"}
                  onChange={(e) =>
                    handleInputChange(
                      "iwoUnapprovedVoucherFlag",
                      e.target.checked ? "Y" : "N",
                    )
                  }
                />
              </div>
              <FormInput
                label="Entry User ID for Vouchers Created"
                value={data.iwoEntryUser || ""}
                readOnly={data.allowIwoVoucherFlag !== "Y"}
                onChange={(e) =>
                  handleInputChange("iwoEntryUser", e.target.value)
                }
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

const initialState = {
  companyId: "",
  approvalRequiredFlag: "",
  approvalRequiredAmount: 0,
  voucherNumberMethodCode: "",
  lastVoucherNumber: 0,
  discountMethodCode: "",
  discountAccountId: "",
  discountOrgIdCode: "",
  poVoucherChangeFlag: "",
  matchGoodsCode: "",
  matchServicesCode: "",
  matchMiscCode: "",
  partialReceiptFlag: "",
  serviceReceiptFlag: "",
  goodsReceiptFlag: "",
  miscReceiptFlag: "",
  discrepancyUnitPriceAmount: 0,
  discrepancyUnitPriceRate: 0,
  discrepancyQuantityRate: 0,
  defaultPoTaxSourceCode: "",
  defaultApTaxSourceCode: "",
  postDiscountGlCode: "",
  partialMatchOptionCode: "",
  goodsMatchOptionCode: "",
  servicesMatchOptionCode: "",
  miscMatchOptionCode: "",
  defaultUseTaxFlag: "",
  discrepancyTotalAmount: 0,
  autoApprovePoFlag: "",
  poApprovalRequiredAmount: 0,
  matchPartsCode: "",
  autoVoucherCode: "",
  modifiedBy: user.name,
  discrepancyPoTotalAmount: 0,
  receiptLoadCode: "",
  discrepancyTaxFlag: "",
  rowVersion: 0,
  allowDuplicateInvoiceFlag: "",
  voucherPoReceiptFlag: "",
  exchangeRateCode: "",
  allowIwoVoucherFlag: "",
  iwoEntryUser: "",
  iwoUnapprovedVoucherFlag: "",
  recalcDetailFlag: "",
  invoiceEmailFlag: "",
  invoiceEmailId: "",
  individualVoucherMsgCode: "",
  individualPostedVoucherMsgCode: "",
  totalVoucherMsgCode: "",
  totalPostedVoucherMsgCode: "",
  receiptEmailFlag: "",
  receiptEmailId: "",
  multiLevelApprovalFlag: "",
  multiLevelApprovalTolerance: 0,
};

export default ConfigureAccountsPayableVoucherSettings;
