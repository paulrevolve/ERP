import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { backendUrl } from ".././config";
import { FormInput, FormSection } from "../../helper/formSection";
import { ActionButton, MainContainer } from "../../helper/container";
import { Save, X } from "lucide-react";
import { toast } from "react-toastify";

const ConfigurePurchaseOrderVoucherSettings = () => {
  const [data, setData] = useState(initialState);
  const [allData, setAllData] = useState(initialState);
  const [activeTab, setActiveTab] = useState("defaults");
  const [loading, setLoading] = useState(false);

  // 1. Fetch Data on Mount (Added to match your AP screen)
  const getVoucherSetting = async () => {
    try {
      const res = await api.get(`${backendUrl}/api/voucher-settings/1`);
      // Spread initialState first so any missing fields from API are still present
      setData({ ...initialState, ...res.data, isDirty: false });
      setAllData({ ...initialState, ...res.data, isDirty: false });
    } catch (error) {
      console.error("Fetch Error:", error);
      setData(initialState);
    }
  };

  useEffect(() => {
    getVoucherSetting();
  }, []);

  // 2. Updated Input Change with 1-char Validation
  const handleInputChange = (field, value) => {
    let finalValue = value;

    if (field === "discountOrgIdCode" && value.length > 1) {
      alert("Warning: Charge Organization Code cannot exceed 1 character.");
      finalValue = value.slice(0, 1);
    }

    setData((prev) => ({
      ...prev,
      [field]: finalValue,
      isDirty: true,
    }));
  };

  // 3. Save Logic
  //   const handleSave = async () => {
  //     if (!data.isDirty) return alert("No changes found to save.");

  //     try {
  //       const { isDirty, ...payload } = data;
  //       const res = await api.post(`${backendUrl}/api/voucher-settings`, {
  //         ...payload,
  //         companyId: "1"
  //       });

  //       if (res.status === 200 || res.status === 201) {
  //         alert("Settings saved successfully!");
  //         setData((prev) => ({ ...prev, isDirty: false }));
  //       }
  //     } catch (error) {
  //       alert("Save failed. Please check network/console.");
  //     }
  //   };

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
  };

  const handleSave = async () => {
    // 1. Validation for Required (*) Fields
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
    ];

    for (const field of requiredFields) {
      if (!data[field] || data[field] === "") {
        // Use the field key to get the friendly name from fieldLabels
        const friendlyName = fieldLabels[field] || field;
        toast.error(`${friendlyName} is required!`);
        return; // Stop the function here so it doesn't try to save
      }
    }

    // 2. Check if dirty
    if (!data.isDirty) return toast.info("No changes found to save.");

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

      const { isDirty, ...payload } = data;
      const res = await api.post(`${backendUrl}/api/voucher-settings`, {
        ...payload,
        companyId: "1",
        modifiedBy: user.name,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Settings saved successfully!");
        setData((prev) => ({ ...prev, isDirty: false }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    try {
      // Check if any record actually needs resetting
      const isModified = data.isDirty;
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
        }
      }

      if (isModified) {
        // Reverting to the original master state
        setData(allData);
      }
    } catch (error) {
      // Technical logging for debugging
      console.error("Discard operation failed:", error);
    }
  };

  const MatchingRow = ({ label, matchField, optionField }) => (
    <div className="flex items-center space-x-2">
      <label className="f-head font-[400] text-[10px] text-black min-w-[60px]">
        {label} *
      </label>
      <select
        value={data[matchField] || ""}
        onChange={(e) => handleInputChange(matchField, e.target.value)}
        className="border  border-gray-300 outline-none p-0.5 rounded text-[10px] w-14 bg-white"
      >
        <option value="">-Select-</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <select
        value={data[optionField] || ""}
        disabled={data[matchField] !== "3"}
        onChange={(e) => handleInputChange(optionField, e.target.value)}
        className={`border border-gray-300 outline-none p-0.5 rounded text-[10px] w-20 ${
          data[matchField] !== "3" ? "bg-gray-100 text-gray-400" : "bg-white"
        }`}
      >
        <option value="">-Select-</option>
        <option value="TOTAL">TOTAL</option>
        <option value="INDIV">INDIV</option>
      </select>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <MainContainer title="Purchase Order Voucher Settings">
        <div className="w-full flex items-center justify-between px-2 ">
          <div className="flex gap-4 px-2 text-[11px] font-bold text-gray-500 ">
            <button
              onClick={() => setActiveTab("defaults")}
              className={`pb-2 text-[10px] font-semibold cursor-pointer ${activeTab === "defaults" ? "text-[#17414d] border-b-2 border-[#17414d]" : "hover:text-[#17414d]"}`}
            >
              PO Voucher Defaults
            </button>
            <button
              onClick={() => setActiveTab("receipt")}
              className={`pb-2 text-xs font-medium cursor-pointer ${activeTab === "receipt" ? "text-[#17414d] border-b-2 border-[#17414d]" : "hover:text-[#17414d]"}`}
            >
              Receipt Handling
            </button>
          </div>
          <div className="flex items-center gap-1">
            <ActionButton icon={X} onClick={handleDiscard} loading={loading} />
            <ActionButton icon={Save} onClick={handleSave} loading={loading} />
          </div>
        </div>

        <div className="p-2">
          {activeTab === "defaults" ? (
            <div className="space-y-4 mt-2">
              <FormSection title="2- or 3-Way Matching">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <MatchingRow
                    label="Goods"
                    matchField="matchGoodsCode"
                    optionField="goodsMatchOptionCode"
                  />
                  <MatchingRow
                    label="Services"
                    matchField="matchServicesCode"
                    optionField="servicesMatchOptionCode"
                  />
                  <MatchingRow
                    label="Misc"
                    matchField="matchMiscCode"
                    optionField="miscMatchOptionCode"
                  />
                  <MatchingRow
                    label="Parts"
                    matchField="matchPartsCode"
                    optionField="partialMatchOptionCode"
                  />
                </div>
              </FormSection>

              <FormSection title="Approval Required">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <label className="text-[10px] min-w-[60px]">Option *</label>
                    <select
                      value={data.autoApprovePoFlag || ""}
                      onChange={(e) =>
                        handleInputChange("autoApprovePoFlag", e.target.value)
                      }
                      className="flex-1 border border-gray-300 p-0.5 rounded text-[10px] bg-white"
                    >
                      <option value="">-Select-</option>
                      <option value="A">Automatic</option>
                      <option value="M">Manual</option>
                      <option value="L">Limited</option>
                    </select>
                  </div>
                  <FormInput
                    label="Above"
                    type="number"
                    disabled={data.autoApprovePoFlag !== "Limited"}
                    value={data.poApprovalRequiredAmount}
                    onChange={(e) =>
                      handleInputChange(
                        "poApprovalRequiredAmount",
                        e.target.value,
                      )
                    }
                  />
                  <FormInput
                    label="Voucher Approvals Upon Receipt"
                    type="checkbox"
                    checked={data.voucherPoReceiptFlag === "Y"}
                    onChange={(e) =>
                      handleInputChange(
                        "voucherPoReceiptFlag",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                </div>
              </FormSection>

              <FormSection title="Auto-Voucher Creation">
                <div className="flex items-center space-x-6">
                  {["None", "2- and 3-Way Match", "3-Way Match Only"].map(
                    (opt, idx) => (
                      <label
                        key={opt}
                        className="flex items-center space-x-1 text-[10px]"
                      >
                        <input
                          type="radio"
                          name="autoVoucher"
                          checked={data.autoVoucherCode === String(idx)}
                          onChange={() =>
                            handleInputChange("autoVoucherCode", String(idx))
                          }
                        />
                        <span>{opt}</span>
                      </label>
                    ),
                  )}
                  <FormInput
                    label="Recalculate Detail Rows"
                    type="checkbox"
                    checked={data.recalcDetailFlag === "Y"}
                    onChange={(e) =>
                      handleInputChange(
                        "recalcDetailFlag",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                </div>
              </FormSection>

              <FormSection title="Allow">
                <div className="grid grid-cols-2 gap-8">
                  <FormSection
                    title={"Receiving/Acceptance"}
                    className="border p-2 mt-3 rounded relative flex items-center space-x-4"
                  >
                    <FormInput
                      label="Goods"
                      type="checkbox"
                      checked={data.goodsReceiptFlag === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "goodsReceiptFlag",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                    <FormInput
                      label="Services"
                      type="checkbox"
                      checked={data.serviceReceiptFlag === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "serviceReceiptFlag",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                    <FormInput
                      label="Miscellaneous"
                      type="checkbox"
                      checked={data.miscReceiptFlag === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "miscReceiptFlag",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                    <FormInput
                      label="Parts"
                      type="checkbox"
                      checked={data.partsReceiptFlag === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "partsReceiptFlag",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                  </FormSection>
                  <FormInput
                    label="Charge Code Change"
                    type="checkbox"
                    checked={data.poVoucherChangeFlag === "Y"}
                    onChange={(e) =>
                      handleInputChange(
                        "poVoucherChangeFlag",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                </div>
              </FormSection>

              <FormSection title="Defaults">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-[10px] min-w-[60px]">
                      Taxable Status *
                    </label>
                    <select
                      value={data.defaultPoTaxSourceCode || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "defaultPoTaxSourceCode",
                          e.target.value,
                        )
                      }
                      className="flex-1 border border-gray-300 p-0.5 rounded text-[10px] bg-white"
                    >
                      <option value="">-Select-</option>
                      <option value="F">From PO</option>
                      <option value="I">Item Type</option>
                      <option value="N">Non-Taxable</option>
                      <option value="T">Taxable</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-[10px] min-w-[60px]">
                      Receipt Quantity Autoload *
                    </label>
                    <select
                      value={data.receiptLoadCode || ""}
                      onChange={(e) =>
                        handleInputChange("receiptLoadCode", e.target.value)
                      }
                      className="flex-1 border border-gray-300 p-0.5 rounded text-[10px] bg-white"
                    >
                      <option value="">-Select-</option>
                      <option value="A">Accepted</option>
                      <option value="R">Reveived</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-[10px] min-w-[60px]">
                      Exchange Rate Source *
                    </label>
                    <select
                      value={data.exchangeRateCode || ""}
                      onChange={(e) =>
                        handleInputChange("exchangeRateCode", e.target.value)
                      }
                      className="flex-1 border border-gray-300 p-0.5 rounded text-[10px] bg-white"
                    >
                      <option value="">-Select-</option>
                      <option value="P">Purchase Order</option>
                      <option value="I">Invoice Date</option>
                      <option value="C">Current Date</option>
                    </select>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Discrepancies Allowed">
                <div className="grid grid-cols-2 gap-4">
                  <FormSection
                    title={"Amount"}
                    className="border p-2 rounded relative grid grid-cols-2 gap-2 mt-2"
                  >
                    <FormInput
                      label="Unit Cost"
                      type="number"
                      value={data.discrepancyUnitPriceAmount}
                      onChange={(e) =>
                        handleInputChange(
                          "discrepancyUnitPriceAmount",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="PO"
                      type="number"
                      value={data.discrepancyPoTotalAmount}
                      onChange={(e) =>
                        handleInputChange(
                          "discrepancyPoTotalAmount",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="PO Line"
                      type="number"
                      value={data.discrepancyTotalAmount}
                      onChange={(e) =>
                        handleInputChange(
                          "discrepancyTotalAmount",
                          e.target.value,
                        )
                      }
                    />
                  </FormSection>
                  <FormSection
                    title={"Percentange"}
                    className="border  p-2 rounded relative flex flex-col space-y-2 mt-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput
                        label="Unit Cost"
                        type="number"
                        value={data.discrepancyUnitPriceRate}
                        onChange={(e) =>
                          handleInputChange(
                            "discrepancyUnitPriceRate",
                            e.target.value,
                          )
                        }
                      />
                      <FormInput
                        label="Quantity"
                        type="number"
                        value={data.discrepancyQuantityRate}
                        onChange={(e) =>
                          handleInputChange(
                            "discrepancyQuantityRate",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <FormInput
                      label="Include Sales/VAT Tax"
                      type="checkbox"
                      checked={data.discrepancyTaxFlag === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "discrepancyTaxFlag",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                  </FormSection>
                </div>
              </FormSection>
            </div>
          ) : (
            <div className="space-y-4">
              <FormSection title="Receipt Validations">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <FormSection>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <label className="text-[10px] min-w-[60px]">
                            3-Way Individual *
                          </label>
                          <select
                            value={data.individualVoucherMsgCode || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "individualVoucherMsgCode",
                                e.target.value,
                              )
                            }
                            className="flex-1 bg-white border border-gray-300 p-0.5 rounded text-[10px]"
                          >
                            <option value="">-Select-</option>
                            <option value="W">Warning</option>
                            <option value="H">Hard Error</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-[10px] min-w-[60px]">
                            3-Way Total *
                          </label>
                          <select
                            value={data.totalVoucherMsgCode || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "totalVoucherMsgCode",
                                e.target.value,
                              )
                            }
                            className="flex-1 bg-white border border-gray-300 p-0.5 rounded text-[10px]"
                          >
                            <option value="">-Select-</option>
                            <option value="W">Warning</option>
                            <option value="H">Hard Error</option>
                          </select>
                        </div>
                      </div>
                    </FormSection>
                  </div>

                  <div className="">
                    <FormSection>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <label className="text-[10px] min-w-[60px]">
                            3-Way Individual *
                          </label>
                          <select
                            value={data.individualPostedVoucherMsgCode || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "individualPostedVoucherMsgCode",
                                e.target.value,
                              )
                            }
                            className="flex-1 bg-white border border-gray-300 p-0.5 rounded text-[10px]"
                          >
                            <option value="">-Select-</option>
                            <option value="W">Warning</option>
                            <option value="H">Hard Error</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-[10px] min-w-[60px]">
                            3-Way Total *
                          </label>
                          <select
                            value={data.totalPostedVoucherMsgCode || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "totalPostedVoucherMsgCode",
                                e.target.value,
                              )
                            }
                            className="flex-1 bg-white border border-gray-300 p-0.5 rounded text-[10px]"
                          >
                            <option value="">-Select-</option>
                            <option value="W">Warning</option>
                            <option value="H">Hard Error</option>
                          </select>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Notification">
                <div className="flex items-center space-x-4">
                  <FormInput
                    label="Receipt Email Notification"
                    type="checkbox"
                    checked={data.receiptEmailFlag === "Y"}
                    onChange={(e) =>
                      handleInputChange(
                        "receiptEmailFlag",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />

                  <FormInput
                    label="Email"
                    type="text"
                    value={data.receiptEmailId}
                    onChange={(e) =>
                      handleInputChange("receiptEmailId", e.target.value)
                    }
                    disabled={data.receiptEmailFlag !== "Y"}
                  />
                </div>
              </FormSection>
            </div>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

const initialState = {
  companyId: "1",
  matchGoodsCode: "",
  goodsMatchOptionCode: "",
  matchServicesCode: "",
  servicesMatchOptionCode: "",
  matchMiscCode: "",
  miscMatchOptionCode: "",
  matchPartsCode: "",
  partialMatchOptionCode: "",
  autoApprovePoFlag: "",
  poApprovalRequiredAmount: 0,
  voucherPoReceiptFlag: "N",
  autoVoucherCode: "",
  recalcDetailFlag: "N",
  goodsReceiptFlag: "N",
  serviceReceiptFlag: "N",
  miscReceiptFlag: "N",
  //   partsReceiptFlag: "N", // Missing: Receiving Parts
  poVoucherChangeFlag: "N", // Missing: Charge Code Change
  defaultPoTaxSourceCode: "", // Missing: Taxable Status
  receiptLoadCode: "", // Missing: Receipt Quantity Autoload
  exchangeRateCode: "", // Missing: Exchange Rate Source
  discrepancyUnitPriceAmount: 0,
  discrepancyPoTotalAmount: 0,
  discrepancyTotalAmount: 0, // Missing: PO Line Amount discrepancy
  discrepancyUnitPriceRate: 0,
  discrepancyQuantityRate: 0,
  discrepancyTaxFlag: "N", // Missing: Include Sales/VAT Tax
  individualVoucherMsgCode: "",
  totalVoucherMsgCode: "",
  individualPostedVoucherMsgCode: "",
  totalPostedVoucherMsgCode: "",
  receiptEmailFlag: "N",
  receiptEmailId: "",
  isDirty: false,
};

// const data = {
//   "companyId": "string",
//   "approvalRequiredFlag": "string",
//   "approvalRequiredAmount": 0,
//   "voucherNumberMethodCode": "string",
//   "lastVoucherNumber": 0,
//   "discountMethodCode": "string",
//   "discountAccountId": "string",
//   "discountOrgIdCode": "string",
//   "poVoucherChangeFlag": "string",
//   "matchGoodsCode": "string",
//   "matchServicesCode": "string",
//   "matchMiscCode": "string",
//   "partialReceiptFlag": "string",
//   "serviceReceiptFlag": "string",
//   "goodsReceiptFlag": "string",
//   "miscReceiptFlag": "string",
//   "discrepancyUnitPriceAmount": 0,
//   "discrepancyUnitPriceRate": 0,
//   "discrepancyQuantityRate": 0,
//   "defaultPoTaxSourceCode": "string",
//   "defaultApTaxSourceCode": "string",
//   "postDiscountGlCode": "string",
//   "partialMatchOptionCode": "string",
//   "goodsMatchOptionCode": "string",
//   "servicesMatchOptionCode": "string",
//   "miscMatchOptionCode": "string",
//   "defaultUseTaxFlag": "string",
//   "discrepancyTotalAmount": 0,
//   "autoApprovePoFlag": "string",
//   "poApprovalRequiredAmount": 0,
//   "matchPartsCode": "string",
//   "autoVoucherCode": "string",
//   "modifiedBy": "string",
//   "modifiedAt": "2026-04-28T19:18:05.360Z",
//   "discrepancyPoTotalAmount": 0,
//   "receiptLoadCode": "string",
//   "discrepancyTaxFlag": "string",
//   "rowVersion": 0,
//   "allowDuplicateInvoiceFlag": "string",
//   "voucherPoReceiptFlag": "string",
//   "exchangeRateCode": "string",
//   "allowIwoVoucherFlag": "string",
//   "iwoEntryUser": "string",
//   "iwoUnapprovedVoucherFlag": "string",
//   "recalcDetailFlag": "string",
//   "invoiceEmailFlag": "string",
//   "invoiceEmailId": "string",
//   "individualVoucherMsgCode": "string",
//   "individualPostedVoucherMsgCode": "string",
//   "totalVoucherMsgCode": "string",
//   "totalPostedVoucherMsgCode": "string",
//   "receiptEmailFlag": "string",
//   "receiptEmailId": "string",
//   "multiLevelApprovalFlag": "string",
//   "multiLevelApprovalTolerance": 0
// }

export default ConfigurePurchaseOrderVoucherSettings;
