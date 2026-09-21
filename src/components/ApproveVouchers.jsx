import React, { useEffect, useState, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Replace,
  X,
  Save,
  Search,
  Copy,
  ClipboardPaste,
} from "lucide-react";
import { SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import api from "../utils/api";
import { backendUrl } from "./config";
import { useDraftStore } from "../store/useDraftStore";

let isCurrentVoucherApprovedLocked = false;

const FormSection = ({ title, children, className = "" }) => {
  return (
    <div
      className={`relative rounded border border-slate-200 bg-white py-3 px-3 shadow-none ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 pb-1.5 mb-2.5 border-b border-slate-200 select-none">
          <span className="text-xs font-bold text-gray-700">{title}</span>
        </div>
      )}
      <div className="space-y-1.5">{children}</div>
    </div>
  );
};

const FormInput = ({
  label,
  required,
  type = "text",
  value,
  checked,
  onChange,
  onBlur,
  onKeyDown,
  readOnly,
  disabled,
  className = "",
  placeholder,
  horizontal,
  inputClassName = "",
}) => {
  const isApproveCheckbox =
    label === "Approved" || label === "Approve" || label === "appr";
  const actualReadOnly =
    readOnly || (isCurrentVoucherApprovedLocked && !isApproveCheckbox);
  const actualDisabled =
    disabled ||
    (isCurrentVoucherApprovedLocked &&
      !isApproveCheckbox &&
      type === "checkbox");

  const isClickable = type === "checkbox" || type === "radio";

  if (isClickable) {
    return (
      <div className={`flex flex-col gap-1 w-full ${className}`}>
        <span className="text-xs font-semibold text-slate-700 select-none invisible">
          &nbsp;
        </span>
        <label className="flex items-center gap-2 px-2.5 h-[32px] rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-all duration-150 select-none w-full">
          <input
            type={type}
            checked={checked}
            onChange={onChange}
            disabled={actualDisabled}
            className="w-3.5 h-3.5 rounded border-slate-300 text-[#1677e8] focus:ring-[#1677e8] cursor-pointer disabled:opacity-50 accent-[#1677e8]"
          />
          <span className="text-[11px] font-semibold text-slate-700">
            {label}
          </span>
        </label>
      </div>
    );
  }

  if (horizontal) {
    return (
      <div
        className={`flex items-center justify-between gap-4 w-full ${className}`}
      >
        {label && (
          <span className="text-[11px] font-semibold text-slate-700 select-none w-2/5 text-left">
            {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
          </span>
        )}
        <div className="w-3/5">
          <input
            type={type}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            readOnly={actualReadOnly}
            disabled={actualDisabled}
            placeholder={placeholder}
            className={`w-full h-[32px] px-2.5 py-1 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
              ${
                actualReadOnly || actualDisabled
                  ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <span className="text-xs font-semibold text-slate-700 select-none">
          {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
        </span>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        readOnly={actualReadOnly}
        disabled={actualDisabled}
        placeholder={placeholder}
        className={`w-full h-[32px] px-2.5 py-1 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
          ${
            actualReadOnly || actualDisabled
              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          }`}
      />
    </div>
  );
};

const getRowKey = (row) => row?.id || row?.voucherKey || row?.voucher || "";

const apiBaseUrl = `${backendUrl}/api/accounts-payable-vouchers`;
const defaultCompanyId = "1";
const defaultFiscalYear = "2027";
const defaultPeriod = "1";
const defaultSubperiod = "1";
const defaultTerms = "AABBCC";
const validTerms = [defaultTerms];
const defaultUserId = "156.K.S";

const toNumber = (val, fallback = 0) => {
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
};

const toDateTime = (value) => {
  if (!value) return new Date().toISOString();
  if (String(value).includes("T")) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return `${value}T00:00:00`;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed)
    ? new Date().toISOString()
    : new Date(parsed).toISOString();
};

const firstCode = (value, fallback = "") => {
  if (!value) return fallback;
  return String(value).split(" - ")[0].trim() || fallback;
};

const toNullableDateTime = (value) => {
  if (!value) return null;
  return toDateTime(value);
};

const compactDbObject = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    ),
  );

const normalizeTerms = (value) =>
  validTerms.includes(value) ? value : defaultTerms;

const mapHeaderToRecord = (header, lines = []) => {
  const voucherKey = header.voucher_key;
  const invoiceAmount = header.invc_amt ?? header.cst_amt ?? 0;
  const salesTaxAmount = header.sales_tax_amt ?? 0;
  const discountAmount = header.disc_amt ?? 0;

  return {
    id: String(voucherKey),
    voucherKey,
    voucher: String(voucherKey ?? ""),
    fiscalYear: header.fy_cd ?? "",
    period: String(header.period_no ?? ""),
    subperiod: String(header.sub_period_no ?? ""),
    companyId: header.company_id ?? defaultCompanyId,
    vendor: header.vendor_id ?? "",
    vendorName: "",
    terms: header.terms_dc ?? "",
    approved: header.approved_fl ?? "N",
    template: header.recur_tmplt_fl ?? "N",
    invoiceNumber: header.invc_id ?? "",
    invoiceDate: header.invc_dt ? String(header.invc_dt).slice(0, 10) : "",
    invoiceAmount: String(invoiceAmount),
    dueDate: header.due_dt ? String(header.due_dt).slice(0, 10) : "",
    dueAmount: String(header.due_amt ?? invoiceAmount),
    discountPercent: String(header.disc_pct_rt ?? 0),
    discountDate: header.disc_dt ? String(header.disc_dt).slice(0, 10) : "",
    discountAmount: String(discountAmount),
    voucherType:
      header.s_voucher_type === "AP"
        ? "AP Voucher"
        : header.s_voucher_type ?? "AP Voucher",
    originalVoucher: String(header.orig_voucher_no ?? ""),
    accountDescriptionAp: [header.ap_account_id, header.ap_org_id]
      .filter(Boolean)
      .join(" - "),
    accountDescriptionCash: [header.cash_account_id, header.cash_org_id]
      .filter(Boolean)
      .join(" - "),
    voucherLineRecalcMethod: "Recalculate Cost",
    whenSalesTaxChanged: "Recalculate Tot Before Disc",
    totalTax: String(salesTaxAmount),
    remainingBalance: String(header.due_amt ?? invoiceAmount),
    taxId: header.vat_tax_id ?? "",
    taxingDate: header.vat_tax_dt
      ? String(header.vat_tax_dt).slice(0, 10)
      : "",
    taxLocation: header.sales_tax_cd ?? "",
    retainageRate: String(header.rtn_rt ?? 0),
    retainageAmount: "0.00",
    referencePo: header.po_id ?? header.ext_po_id ?? "",
    referencePoRelease: String(
      header.po_rlse_no ?? header.ext_po_rlse_no ?? 0,
    ),
    recurredVoucher: header.recur_fl ?? "N",
    holdVoucher: header.hold_voucher_fl ?? "N",
    payWhenPaid: header.pay_when_paid_fl ?? "N",
    separateCheck: header.sep_chk_fl ?? "N",
    overBudget: header.ovr_bud_fl ?? "N",
    anticipatedPayDate: header.antic_pay_dt
      ? String(header.antic_pay_dt).slice(0, 10)
      : "",
    expenseReportId: header.exp_rpt_id ?? "",
    cisCode: header.cis_cd ?? "",
    approver: header.apprvr_user_id ?? "",
    entryUser: header.entr_user_id ?? defaultUserId,
    entryDate: header.entr_dtt ? String(header.entr_dtt).slice(0, 10) : "",
    payVendor: header.pay_vendor_id ?? header.vendor_id ?? "",
    payVendorName: "",
    jointPayee: header.jnt_pay_vendor_name ?? "",
    addressCode: header.pay_addr_dc ?? "",
    checkCashAcctDesc: header.cash_account_id ?? "",
    checkNumber: String(header.chk_no ?? ""),
    checkDate: header.chk_dt ? String(header.chk_dt).slice(0, 10) : "",
    checkDiscountTaken: String(header.disc_taken_amt ?? ""),
    checkAmount: String(header.chk_amt ?? ""),
    checkPayTransType: header.pay_trans_type ?? "None",
    checkPayRefCode: header.pay_ref_code ?? "",
    checkPostFiscalYear: header.chk_fy_cd ?? "",
    checkPostPeriod: String(header.chk_pd_no ?? ""),
    checkPostSubperiod: String(header.chk_sub_pd_no ?? ""),
    useTaxAmount: header.use_tax_amt ? String(header.use_tax_amt) : "0.00",
    recurCode: header.recur_voucher_dc ?? "",
    recurStartFiscalYear: header.start_fy_cd ?? "",
    recurStartPeriod: String(header.start_pd_no ?? ""),
    recurStartSubperiod: String(header.start_sub_pd_no ?? ""),
    recurEndFiscalYear: header.end_fy_cd ?? "",
    recurEndPeriod: String(header.end_pd_no ?? ""),
    recurEndSubperiod: String(header.end_sub_pd_no ?? ""),
    recurLastVchrFiscalYear: header.lst_voucher_fy_cd ?? "",
    recurLastVchrPeriod: String(header.lst_voucher_pd_no ?? ""),
    recurLastVchrSubperiod: String(header.lst_voucher_sub_pd_no ?? ""),
    subcontractorInvoicePopDate: header.invc_pop_dt
      ? String(header.invc_pop_dt).slice(0, 10)
      : "",
    subcontractorDeliveryValue: String(header.paywpd_amt ?? ""),
    subcontractorInvoiceType: "None",
    notesPrintOnCheck: header.print_note_fl ?? "N",
    notesText: header.notes ?? "",
    notesDocLocation: header.doc_location ?? "",
    notesDocLocationId: header.doc_location_id ?? "",
    notesDocFileName: header.doc_file_name ?? "",
    detailLines: lines.map(mapLineToDetailLine),
    isDirty: false,
  };
};

const mapLineToDetailLine = (lineAggregate, index) => {
  const line = lineAggregate.line || lineAggregate;
  const account = (lineAggregate.accounts || [])[0] || {};
  const labVendor = (lineAggregate.labVendors || [])[0] || {};
  const costAmount = account.cst_amt ?? line.ext_cst_amt ?? line.net_amt ?? 0;
  const salesTaxAmount = account.sales_tax_amt ?? line.sales_tax_amt ?? 0;
  const totalBeforeDiscount =
    account.tot_bef_disc_amt ??
    line.tot_bef_disc_amt ??
    line.ext_cst_amt ??
    0;
  const discountAmount = account.disc_amt ?? line.disc_amt ?? 0;
  const netAmount = account.net_amt ?? line.net_amt ?? 0;

  return {
    id: String(line.voucher_ln_key ?? `line-${index + 1}`),
    voucherLnKey: line.voucher_ln_key,
    voucherLnVendorKey: labVendor.voucher_ln_vendor_key,
    lineNo: String(line.voucher_ln_no ?? index + 1),
    account: account.account_id ?? "",
    accountName: "",
    organization: account.org_id ?? "",
    organizationName: "",
    project: account.project_id ?? "",
    projectName: "",
    projAcctAbbrev: account.project_account_abbrv_cd ?? "",
    costAmount: String(costAmount),
    percent: String(account.cst_amt_pct_rt ?? "100.00"),
    taxability: line.taxable_fl === "Y" ? "Taxable" : "Non-Taxable",
    taxVatCode: line.sales_tax_cd ?? "",
    taxRate: "0.00",
    salesVatTaxAmt: String(salesTaxAmount),
    totBeforeDisc: String(totalBeforeDiscount),
    discount: String(discountAmount),
    totalAmt: String(netAmount),
    useReverseTaxAmt: String(line.use_tax_amt ?? 0),
    recoveryRate: String(line.recovery_rt ?? 0),
    recoveryAmt: String(line.recovery_amt ?? 0),
    vendor1099: account.ap_1099_fl ?? "N",
    type1099: account.s_ap_1099_type_cd ?? "",
    state1099: account.ap_1099_state_cd ?? "",
    description: line.voucher_ln_desc ?? "",
    notes: line.notes ?? "",
    orgAbbrev: account.org_abbrv_cd ?? "",
    projAbbrev: account.project_abbrv_cd ?? "",
    refNo1: account.ref1_id ?? "",
    refNo1Name: "",
    refNo2: account.ref2_id ?? "",
    refNo2Name: "",
    cisWh: line.cis_wh_fl ?? "N",
    cisRpt: line.cis_rpt_fl ?? "N",
    supplyCode: line.vat_supply_dc ?? "",
    dateOfSupply: line.vat_supply_dt
      ? String(line.vat_supply_dt).slice(0, 10)
      : "",
    unitOfMeasure: line.um_cd ?? "",
    subLine: labVendor.sub_ln_no ? String(labVendor.sub_ln_no) : "",
    vendorEmployee: labVendor.vend_empl_id ?? "",
    glc: labVendor.genl_lab_cat_cd ?? "",
    plc: labVendor.bill_lab_cat_cd ?? "",
    hours: labVendor.vendor_hrs ? String(labVendor.vendor_hrs) : "",
    laborAmount: labVendor.vendor_amt ? String(labVendor.vendor_amt) : "",
    vatRecoveryAmt: labVendor.recovery_amt
      ? String(labVendor.recovery_amt)
      : "",
    effectiveBillingDate: labVendor.effect_bill_dt
      ? String(labVendor.effect_bill_dt).slice(0, 10)
      : "",
    vendorLaborNotes: labVendor.notes ?? "",
    isDirty: false,
  };
};

const buildVoucherPayload = (record) => {
  const amount = toNumber(record.invoiceAmount || record.costAmount, 0);
  const taxAmount = toNumber(record.totalTax, 0);
  const discountAmount = toNumber(record.discountAmount, 0);
  const dueAmount = toNumber(record.dueAmount, amount);
  const apAccount = firstCode(record.accountDescriptionAp, "20100");
  const cashAccount = firstCode(record.accountDescriptionCash, "10100");
  const now = new Date().toISOString();

  return {
    header: compactDbObject({
      vendor_id: record.vendor || "VND-1001",
      s_voucher_type: "AP",
      terms_dc: normalizeTerms(record.terms),
      approved_fl: record.approved || "N",
      posted_ap_fl: "N",
      invc_id: record.invoiceNumber || `INV-${Date.now()}`.slice(0, 50),
      invc_dt: toDateTime(record.invoiceDate),
      entr_user_id: record.entryUser || defaultUserId,
      fy_cd: record.fiscalYear || defaultFiscalYear,
      period_no: toNumber(record.period, toNumber(defaultPeriod, 1)),
      sub_period_no: toNumber(record.subperiod, toNumber(defaultSubperiod, 1)),
      disc_pct_rt: toNumber(record.discountPercent, 0),
      cst_amt: amount,
      sales_tax_amt: taxAmount,
      sales_tax_cd: record.taxLocation || null,
      invc_amt: amount,
      disc_amt: discountAmount,
      due_amt: dueAmount,
      ap_account_id: apAccount,
      ap_org_id: "10-200",
      cash_account_id: cashAccount,
      cash_org_id: "10-200",
      taxable_fl: "N",
      chk_amt: toNumber(record.checkAmount, 0),
      chk_no: toNumber(record.checkNumber, 0),
      rtn_rt: toNumber(record.retainageRate, 0),
      rtn_nt: "",
      sep_chk_fl: record.separateCheck || "N",
      notes: record.notesText || "",
      s_sales_tax_src_cd: "N",
      pay_vendor_id: record.payVendor || record.vendor || "VND-1001",
      ext_po_id: record.referencePo || "",
      s_jnl_cd: "AP",
      voucher_no: toNumber(record.voucherNo, 0),
      orig_voucher_no: record.originalVoucher
        ? toNumber(record.originalVoucher, 0)
        : null,
      entr_dtt: toDateTime(record.entryDate) || now,
      hold_voucher_fl: record.holdVoucher || "N",
      recur_fl: record.recurredVoucher || "N",
      disc_taken_amt: toNumber(record.checkDiscountTaken, 0),
      apprvr_user_id: record.approver || null,
      antic_pay_dt: toNullableDateTime(record.anticipatedPayDate),
      exp_rpt_id: record.expenseReportId || null,
      dflt_ps_id: "",
      use_tax_amt: toNumber(record.useTaxAmount, 0),
      pay_when_paid_fl: record.payWhenPaid || "N",
      s_taxable_cd: "N",
      s_recpt_discr_cd: "N",
      s_po_discr_cd: "N",
      dm_fl: "N",
      dm_prntd_fl: "N",
      auto_create_fl: "N",
      modified_by: record.entryUser || defaultUserId,
      time_stamp: now,
      company_id: record.companyId || defaultCompanyId,
      cis_cd: record.cisCode || null,
      print_note_fl: record.notesPrintOnCheck || "N",
      recur_voucher_dc: record.recurCode || null,
      start_fy_cd: record.recurStartFiscalYear || null,
      start_pd_no: record.recurStartPeriod
        ? toNumber(record.recurStartPeriod, 0)
        : null,
      start_sub_pd_no: record.recurStartSubperiod
        ? toNumber(record.recurStartSubperiod, 0)
        : null,
      end_fy_cd: record.recurEndFiscalYear || null,
      end_pd_no: record.recurEndPeriod
        ? toNumber(record.recurEndPeriod, 0)
        : null,
      end_sub_pd_no: record.recurEndSubperiod
        ? toNumber(record.recurEndSubperiod, 0)
        : null,
      recur_tmplt_fl: record.template || "N",
      recur_par_voucher_no: 0,
      s_invc_type: "N",
      ship_amt: 0,
      ovr_bud_fl: record.overBudget || "N",
      s_subctr_pay_cd:
        record.subcontractorInvoiceType &&
        record.subcontractorInvoiceType !== "None"
          ? String(record.subcontractorInvoiceType).slice(0, 1)
          : "N",
      invc_pop_dt: toNullableDateTime(record.subcontractorInvoicePopDate),
      paywpd_amt: toNumber(record.subcontractorDeliveryValue, 0),
      trn_cst_amt: amount,
      trn_disc_amt: discountAmount,
      trn_due_amt: dueAmount,
      trn_invc_amt: amount,
      trn_sales_tax_amt: taxAmount,
      trn_ship_amt: 0,
      trn_use_tax_amt: toNumber(record.useTaxAmount, 0),
      trn_crncy_cd: record.transactionCurrencyCode || "USD",
      pay_crncy_cd: record.payCurrencyCode || "USD",
      trn_to_eur_rt: 1,
      eur_to_func_rt: 1,
      func_to_eur_rt: 1,
      eur_to_pay_rt: 1,
      trn_freeze_rt_fl: "N",
      pay_freeze_rt_fl: "N",
      vat_tax_id: record.taxId || null,
      vat_tax_dt: toNullableDateTime(record.taxingDate),
      doc_location: record.notesDocLocation || null,
      doc_location_id: record.notesDocLocationId || null,
      doc_file_name: record.notesDocFileName || null,
      pay_trans_type:
        record.checkPayTransType && record.checkPayTransType !== "None"
          ? record.checkPayTransType
          : null,
      pay_ref_code: record.checkPayRefCode || null,
      due_dt: toNullableDateTime(record.dueDate),
      disc_dt: toNullableDateTime(record.discountDate),
      pay_addr_dc: record.addressCode || null,
    }),
    lines: (record.detailLines || []).map((line, index) => {
      const lineAmount = toNumber(line.totalAmt || line.costAmount, amount);
      const lineTax = toNumber(line.salesVatTaxAmt, 0);
      const lineBeforeDiscount = toNumber(line.totBeforeDisc, lineAmount);
      const lineDiscount = toNumber(line.discount, 0);
      const costAmount = toNumber(line.costAmount, lineAmount);
      const hasVendorLabor = [
        line.subLine,
        line.vendorEmployee,
        line.glc,
        line.plc,
        line.hours,
        line.laborAmount,
        line.effectiveBillingDate,
      ].some(
        (value) =>
          value !== undefined && value !== null && String(value).trim() !== "",
      );

      return {
        line: compactDbObject({
          voucher_ln_no: toNumber(line.lineNo, index + 1),
          qty: 1,
          ext_cst_amt: costAmount,
          ln_chg_cst_amt: 0,
          sales_tax_amt: lineTax,
          ln_chg_tax_amt: 0,
          tot_bef_disc_amt: lineBeforeDiscount,
          net_amt: lineAmount,
          taxable_fl: line.taxability === "Taxable" ? "Y" : "N",
          sales_tax_cd: line.taxVatCode || "",
          vat_supply_dc: line.supplyCode || null,
          vat_supply_dt: toNullableDateTime(line.dateOfSupply),
          um_cd: (line.unitOfMeasure || "").slice(0, 3) || null,
          cis_wh_fl: line.cisWh || "N",
          cis_rpt_fl: line.cisRpt || "N",
          sales_tax_nt: "",
          notes: line.notes || "",
          voucher_ln_desc: (
            line.description ||
            line.notes ||
            `Line ${index + 1}`
          ).slice(0, 30),
          s_po_ln_type: "M",
          discr_unit_prc_amt: 0,
          discr_unit_prc_rt: 0,
          discr_qty_rt: 0,
          unit_cst_amt: costAmount,
          use_tax_amt: toNumber(line.useReverseTaxAmt, 0),
          ln_chg_use_tax_amt: 0,
          disc_amt: lineDiscount,
          s_taxable_cd: line.taxability === "Taxable" ? "Y" : "N",
          discr_tot_amt: 0,
          rma_no_id: "",
          modified_by: defaultUserId,
          time_stamp: now,
          trn_discr_tot_amt: 0,
          trn_discr_unit_amt: 0,
          trn_disc_amt: lineDiscount,
          trn_ext_cst_amt: costAmount,
          trn_ln_chg_cst_amt: 0,
          trn_ln_chg_tax_amt: 0,
          trn_ln_chg_use_amt: 0,
          trn_net_amt: lineAmount,
          trn_sales_tax_amt: lineTax,
          trn_tot_bef_dc_amt: lineBeforeDiscount,
          trn_unit_cst_amt: costAmount,
          trn_use_tax_amt: toNumber(line.useReverseTaxAmt, 0),
          trn_recovery_amt: toNumber(line.recoveryAmt, 0),
          recovery_amt: toNumber(line.recoveryAmt, 0),
          recovery_rt: toNumber(line.recoveryRate, 0),
        }),
        accounts: [
          compactDbObject({
            account_id: firstCode(line.account, apAccount),
            org_id: firstCode(line.organization, "10-200"),
            project_id: firstCode(line.project, ""),
            ref1_id: firstCode(line.refNo1, ""),
            ref2_id: firstCode(line.refNo2, ""),
            project_abbrv_cd: firstCode(line.projAbbrev, ""),
            org_abbrv_cd: firstCode(line.orgAbbrev, ""),
            project_account_abbrv_cd: firstCode(line.projAcctAbbrev, ""),
            cst_amt_pct_rt: toNumber(line.percent, 100),
            cst_amt: costAmount,
            sales_tax_amt: lineTax,
            tot_bef_disc_amt: lineBeforeDiscount,
            disc_amt: lineDiscount,
            net_amt: lineAmount,
            taxable_fl: line.taxability === "Taxable" ? "Y" : "N",
            use_tax_amt: toNumber(line.useReverseTaxAmt, 0),
            s_taxable_cd: line.taxability === "Taxable" ? "Y" : "N",
            modified_by: defaultUserId,
            time_stamp: now,
            ap_1099_fl: line.vendor1099 || "N",
            trn_cst_amt: costAmount,
            trn_disc_amt: lineDiscount,
            trn_ln_chg_cst_amt: 0,
            trn_net_amt: lineAmount,
            trn_sales_tax_amt: lineTax,
            trn_tot_bef_dc_amt: lineBeforeDiscount,
            trn_use_tax_amt: toNumber(line.useReverseTaxAmt, 0),
            trn_recovery_amt: toNumber(line.recoveryAmt, 0),
            recovery_amt: toNumber(line.recoveryAmt, 0),
            s_ap_1099_type_cd: line.type1099 || null,
            ap_1099_state_cd: line.state1099 || null,
          }),
        ],
        labVendors: hasVendorLabor
          ? [
              compactDbObject({
                sub_ln_no: toNumber(line.subLine || line.lineNo, index + 1),
                genl_lab_cat_cd: firstCode(line.glc, ""),
                bill_lab_cat_cd: firstCode(line.plc, ""),
                vendor_hrs: toNumber(line.hours, 0),
                vendor_amt: toNumber(line.laborAmount || line.totalAmt, 0),
                modified_by: defaultUserId,
                time_stamp: now,
                vend_empl_id: firstCode(line.vendorEmployee, ""),
                trn_vendor_amt: toNumber(line.laborAmount || line.totalAmt, 0),
                trn_recovery_amt: toNumber(
                  line.vatRecoveryAmt || line.recoveryAmt,
                  0,
                ),
                recovery_amt: toNumber(
                  line.vatRecoveryAmt || line.recoveryAmt,
                  0,
                ),
                effect_bill_dt: toNullableDateTime(line.effectiveBillingDate),
                notes: line.vendorLaborNotes || line.notes || "",
                sales_tax_fl: line.taxability === "Taxable" ? "Y" : "N",
              }),
            ]
          : [],
      };
    }),
  };
};

const buildApprovalQueueVoucher = (record) => ({
  id: record.id,
  voucherKey: record.voucherKey || record.voucher,
  vendor: record.vendor || "",
  vendorName: record.vendorName || "",
  voucher: record.voucher || "",
  invoiceAmt: record.invoiceAmount || record.dueAmount || "0.00",
  invoice: record.invoiceNumber || "",
  originalVoucher: record.originalVoucher || "",
  appr: record.approved === "Y" ? "Y" : "N",
  hold: record.holdVoucher || "N",
  overBudget: record.overBudget || "N",
  invoiceDate: record.invoiceDate || "",
  terms: record.terms || "",
  discountPercent: record.discountPercent || "",
  discountDate: record.discountDate || "",
  discountAmt: record.discountAmount || "0.00",
  dueDate: record.dueDate || "",
  transDueAmt: record.dueAmount || record.invoiceAmount || "0.00",
  manualCk: "N",
  entryUser: record.entryUser || "",
  vchrType: record.voucherType || "AP Voucher",
  discrCalcDate: record.invoiceDate || "",
  checkAmount: record.checkAmount || "0.00",
  discountTaken: record.checkDiscountTaken || "0.00",
  checkDate: record.checkDate || "",
  checkFiscalYear: record.checkFiscalYear || "",
  checkNumber: record.checkNumber || "",
  checkPeriod: record.checkPostPeriod || "",
  checkSubpd: record.checkPostSubperiod || "",
  cashAccountsDescription: record.checkCashAcctDesc || "",
  fiscalYear: record.fiscalYear || "",
  period: record.period || "",
  subperiod: record.subperiod || "",
  poDiscrepancy: "N",
  rcptDiscrepancy: "N",
  // Totals Subtab
  costAmount: record.invoiceAmount || "0.00",
  salesVatTaxAmt: record.totalTax || "0.00",
  recoveryAmt: "0.00",
  totBeforeDisc: record.invoiceAmount || "0.00",
  discount: record.discountAmount || "0.00",
  totalAmt: record.invoiceAmount || "0.00",
  useReverseTaxAmt: record.useTaxAmount || "0.00",
  checkDiscountTaken: record.checkDiscountTaken || "0.00",
  // original details
  detailLines: record.detailLines || [],
});

const mapDbHeaderToApproveVoucher = (header) => {
  const record = mapHeaderToRecord(header, []);
  return buildApprovalQueueVoucher(record);
};

const detailsColumns = [
  { id: "vendor", key: "vendor", label: "Vendor" },
  { id: "vendorName", key: "vendorName", label: "Vendor Name" },
  { id: "voucher", key: "voucher", label: "Voucher", readOnly: true },
  { id: "invoiceAmt", key: "invoiceAmt", label: "Invoice Amt" },
  { id: "invoice", key: "invoice", label: "Invoice" },
  { id: "originalVoucher", key: "originalVoucher", label: "Original Voucher" },
  { id: "appr", key: "appr", label: "Approve", type: "checkbox" },
  { id: "hold", key: "hold", label: "Hold", type: "checkbox" },
  { id: "overBudget", key: "overBudget", label: "Over Budget", type: "checkbox" },
  { id: "invoiceDate", key: "invoiceDate", label: "Invoice Date", type: "date" },
  { id: "terms", key: "terms", label: "Terms" },
  { id: "discountPercent", key: "discountPercent", label: "Discount %" },
  { id: "discountDate", key: "discountDate", label: "Discount Date", type: "date" },
  { id: "discountAmt", key: "discountAmt", label: "Discount Amt" },
  { id: "dueDate", key: "dueDate", label: "Due Date", type: "date" },
  { id: "transDueAmt", key: "transDueAmt", label: "Trans Due Amt" },
  { id: "manualCk", key: "manualCk", label: "Manual Ck", type: "checkbox" },
  { id: "entryUser", key: "entryUser", label: "Entry User" },
  { id: "vchrType", key: "vchrType", label: "Vchr Type" },
  { id: "discrCalcDate", key: "discrCalcDate", label: "Discr Calc Date", type: "date" },
  { id: "checkAmount", key: "checkAmount", label: "Check Amount" },
  { id: "discountTaken", key: "discountTaken", label: "Discount Taken" },
  { id: "checkDate", key: "checkDate", label: "Check Date", type: "date" },
  { id: "checkFiscalYear", key: "checkFiscalYear", label: "Check Fiscal Year" },
  { id: "checkNumber", key: "checkNumber", label: "Check Number" },
  { id: "checkPeriod", key: "checkPeriod", label: "Check Period" },
  { id: "checkSubpd", key: "checkSubpd", label: "Check Subpd" },
  {
    id: "cashAccountsDescription",
    key: "cashAccountsDescription",
    label: "Cash Accounts Description",
  },
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year", readOnly: true },
  { id: "period", key: "period", label: "Period" },
  { id: "subperiod", key: "subperiod", label: "Subperiod" },
  {
    id: "poDiscrepancy",
    key: "poDiscrepancy",
    label: "PO Discrepancy",
    type: "checkbox",
  },
  {
    id: "rcptDiscrepancy",
    key: "rcptDiscrepancy",
    label: "Rcpt Discrepancy",
    type: "checkbox",
  },
];

const ApproveVouchers = () => {
  // Bottom Voucher details state
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isFormView, setIsFormView] = useState(true);
  const [activeSubtab, setActiveSubtab] = useState("Voucher Detail");
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [clipboard, setClipboard] = useState([]);

  // Sorting & Find/Replace State
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchColumn, setSearchColumn] = useState("all");
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);

  const handleColumnSort = (columnKey) => {
    if (sortColumn === columnKey) {
      if (sortDirection === "asc") setSortDirection("desc");
      else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (columnKey, label) => {
    const isSorted = sortColumn === columnKey;
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          handleColumnSort(columnKey);
        }}
        className="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 select-none group ml-1"
        title={`Sort by ${label}`}
      >
        {isSorted ? (
          sortDirection === "asc" ? (
            <ArrowUp size={13} className="text-blue-600 font-bold" />
          ) : (
            <ArrowDown size={13} className="text-blue-600 font-bold" />
          )
        ) : (
          <ArrowUpDown
            size={13}
            className="text-gray-400 group-hover:text-blue-600 opacity-60 group-hover:opacity-100"
          />
        )}
      </span>
    );
  };

  const activeColumns = useMemo(() => {
    return detailsColumns.map((col) => {
      const colId = col.id || col.key;
      return {
        ...col,
        sortIcon: colId ? renderSortIcon(colId, col.label) : undefined,
      };
    });
  }, [sortColumn, sortDirection]);

  // Find and Replace Handlers
  const handleFind = () => {
    const term = findValue.toLowerCase().trim();
    if (!term) {
      setFilteredGroups([]);
      return;
    }
    const matched = vouchers.filter((record) => {
      if (searchColumn === "all") {
        return Object.values(record).some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(term),
        );
      }
      return String(record[searchColumn] || "")
        .toLowerCase()
        .includes(term);
    });
    setFilteredGroups(matched);
    if (matched.length > 0) {
      setSelectedVoucher(matched[0]);
    } else {
      toast.info("No matching records found");
    }
  };

  const handleClearFind = () => {
    setFindValue("");
    setReplaceValue("");
    setFilteredGroups([]);
  };

  const handleReplaceAll = () => {
    if (!findValue) {
      toast.warn("Please enter a value to find.");
      return;
    }
    if (searchColumn === "all") {
      toast.warn("Please select a specific column to replace.");
      return;
    }
    if (searchColumn === "voucher" || searchColumn === "fiscalYear") {
      toast.error("Voucher and Fiscal Year are read-only and cannot be replaced.");
      return;
    }

    let count = 0;
    const updated = vouchers.map((record) => {
      const currentVal = String(record[searchColumn] ?? "");
      if (currentVal.toLowerCase().includes(findValue.toLowerCase())) {
        count++;
        return {
          ...record,
          [searchColumn]: replaceValue,
          isDirty: true,
        };
      }
      return record;
    });

    if (count > 0) {
      setVouchers(updated);
      if (selectedVoucher) {
        const updatedSelected = updated.find(
          (r) => getRowKey(r) === getRowKey(selectedVoucher),
        );
        if (updatedSelected) setSelectedVoucher(updatedSelected);
      }
      toast.success(`Replaced in ${count} record(s).`);
      setFilteredGroups([]);
    } else {
      toast.info("No matches found to replace.");
    }
  };

  const handleCopy = async () => {
    const rowsToCopy = isFormView
      ? (selectedVoucher ? [selectedVoucher] : [])
      : (selectedIds.size > 0
          ? vouchers.filter((c) => selectedIds.has(getRowKey(c)))
          : (selectedVoucher ? [selectedVoucher] : []));

    if (rowsToCopy.length === 0) {
      return toast.warn("Select at least one record to copy.");
    }

    setClipboard([...rowsToCopy]);

    const header = detailsColumns.map((col) => col.label).join("\t");
    const tsvLines = rowsToCopy.map((r) => {
      return detailsColumns.map((col) => {
        const val = r[col.key || col.id];
        if (col.type === "checkbox") {
          return val === "Y" || val === true ? "Y" : "N";
        }
        return val ?? "";
      }).join("\t");
    });
    const tsvContent = [header, ...tsvLines].join("\n");

    try {
      await navigator.clipboard.writeText(tsvContent);
    } catch (clipErr) {
      console.warn("Clipboard writeText not permitted", clipErr);
    }

    toast.success(`${rowsToCopy.length} record(s) copied to clipboard`);
  };

  const processPastedText = (text) => {
    if (!text || !text.trim()) {
      return toast.warn("Clipboard is empty.");
    }

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");
    if (lines.length === 0) return toast.warn("No data to paste.");

    const firstLineCells = lines[0]
      .split("\t")
      .map((cell) => cell.replace(/^"|"$/g, "").trim().toLowerCase());

    const isHeaderRow = firstLineCells.some((cell) =>
      detailsColumns.some((col) =>
        cell === col.label.toLowerCase() ||
        cell === (col.key || col.id).toLowerCase()
      )
    );

    const dataLines = isHeaderRow ? lines.slice(1) : lines;
    if (dataLines.length === 0) {
      return toast.warn("No data rows found to paste.");
    }

    const colIndexMap = {};
    if (isHeaderRow) {
      detailsColumns.forEach((col) => {
        const idx = firstLineCells.findIndex((cell) =>
          cell === col.label.toLowerCase() ||
          cell === (col.key || col.id).toLowerCase() ||
          cell.includes(col.label.toLowerCase())
        );
        if (idx !== -1) {
          colIndexMap[col.key || col.id] = idx;
        }
      });
    } else {
      detailsColumns.forEach((col, idx) => {
        colIndexMap[col.key || col.id] = idx;
      });
    }

    const pastedRows = [];

    dataLines.forEach((line, i) => {
      const cells = line.split("\t").map((c) => c.replace(/^"|"$/g, "").trim());
      const tempId = `NEW_${Date.now()}_${i}`;

      const newRow = {
        id: tempId,
        voucherKey: tempId,
        isDirty: true,
      };

      detailsColumns.forEach((col) => {
        const key = col.key || col.id;
        const cellIdx = colIndexMap[key];
        const val = cellIdx !== undefined && cellIdx < cells.length ? cells[cellIdx] : "";
        if (col.type === "checkbox") {
          newRow[key] = ["y", "yes", "true", "1", "t"].includes(String(val).toLowerCase().trim()) ? "Y" : "N";
        } else {
          newRow[key] = val;
        }
      });

      if (newRow.voucher) {
        newRow.voucher = `${newRow.voucher}-COPY`;
      } else {
        newRow.voucher = `VCH-${Date.now().toString().slice(-4)}-${i}`;
      }

      if (!newRow.fiscalYear) newRow.fiscalYear = defaultFiscalYear;
      if (!newRow.period) newRow.period = defaultPeriod;
      if (!newRow.subperiod) newRow.subperiod = defaultSubperiod;

      pastedRows.push(newRow);
    });

    if (pastedRows.length === 0) {
      return toast.warn("No valid rows parsed from clipboard.");
    }

    setVouchers((prev) => [...pastedRows, ...prev]);
    setSelectedVoucher(pastedRows[0]);
    setSelectedIds(new Set([getRowKey(pastedRows[0])]));
    toast.success(`${pastedRows.length} record(s) pasted successfully.`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.includes("\t") || text.includes("\n") || text.trim())) {
        return processPastedText(text);
      }
    } catch (err) {
      console.warn("navigator.clipboard.readText fallback to internal clipboard", err);
    }

    if (!clipboard || clipboard.length === 0) {
      return toast.warn("Clipboard is empty. Copy a record first.");
    }

    const pasted = clipboard.map((item, idx) => {
      const tempId = `NEW_${Date.now()}_${idx}`;
      return {
        ...item,
        id: tempId,
        voucherKey: tempId,
        voucher: item.voucher ? `${item.voucher}-COPY` : `VCH-${Date.now().toString().slice(-4)}-${idx}`,
        isDirty: true,
      };
    });

    setVouchers((prev) => [...pasted, ...prev]);
    setSelectedVoucher(pasted[0]);
    setSelectedIds(new Set([getRowKey(pasted[0])]));
    toast.success(`${pasted.length} record(s) pasted successfully.`);
  };

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        try {
          const text = await navigator.clipboard.readText();
          if (!text || !text.trim()) return;

          const isInput =
            e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
          const hasStructure = text.includes("\t") || text.includes("\n");

          if (isInput && !hasStructure) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();
          processPastedText(text);
        } catch (err) {
          console.error("Ctrl+V readText error:", err);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [vouchers, clipboard]);

  const displayVouchers = useMemo(() => {
    const base = filteredGroups.length > 0 ? filteredGroups : (
      searchValue.trim() ? vouchers.filter((record) => {
        const term = searchValue.toLowerCase().trim();
        return Object.values(record).some((val) =>
          typeof val === "string" && val.toLowerCase().includes(term)
        );
      }) : vouchers
    );
    if (!sortColumn) return base;

    return [...base].sort((a, b) => {
      if (a.isDirty && !b.isDirty) return -1;
      if (!a.isDirty && b.isDirty) return 1;

      const valA = a[sortColumn] ?? "";
      const valB = b[sortColumn] ?? "";

      const numA = Number(valA);
      const numB = Number(valB);
      if (
        !isNaN(numA) &&
        !isNaN(numB) &&
        String(valA).trim() !== "" &&
        String(valB).trim() !== ""
      ) {
        return sortDirection === "asc" ? numA - numB : numB - numA;
      }

      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB), undefined, {
            numeric: true,
            sensitivity: "base",
          })
        : String(valB).localeCompare(String(valA), undefined, {
            numeric: true,
            sensitivity: "base",
          });
    });
  }, [vouchers, filteredGroups, searchValue, sortColumn, sortDirection]);

  // Global search sync with Form View
  useEffect(() => {
    if (searchValue && displayVouchers.length > 0) {
      const isCurrentInDisplay = displayVouchers.some(
        (r) => getRowKey(r) === getRowKey(selectedVoucher),
      );
      if (!isCurrentInDisplay) {
        selectVoucherRecord(displayVouchers[0], isFormView);
      }
    }
  }, [searchValue, displayVouchers]);

  // --- 4 PHASE DRAFT STATE PERSISTENCE ---
  // Phase 1: Hydrate Draft on Mount
  useEffect(() => {
    const draft = useDraftStore.getState().getDraft("approve-vouchers");
    if (
      draft &&
      Array.isArray(draft.vouchers) &&
      draft.vouchers.length > 0 &&
      (draft.isDirty ||
        draft.hasUnsaved ||
        draft.vouchers.some((v) => v.isDirty || v.isNew || v.tempId))
    ) {
      setVouchers(draft.vouchers);
      if (draft.selectedVoucher) setSelectedVoucher(draft.selectedVoucher);
      if (draft.selectedIds) setSelectedIds(new Set(draft.selectedIds));
      if (typeof draft.isFormView === "boolean") setIsFormView(draft.isFormView);
      if (draft.activeSubtab) setActiveSubtab(draft.activeSubtab);
    } else {
      loadVouchers();
    }
  }, []);

  // Phase 2: Auto-save Draft on Changes
  const vouchersRef = useRef(vouchers);
  const selectedVoucherRef = useRef(selectedVoucher);
  const selectedIdsRef = useRef(selectedIds);
  const isFormViewRef = useRef(isFormView);
  const activeSubtabRef = useRef(activeSubtab);

  useEffect(() => {
    vouchersRef.current = vouchers;
    selectedVoucherRef.current = selectedVoucher;
    selectedIdsRef.current = selectedIds;
    isFormViewRef.current = isFormView;
    activeSubtabRef.current = activeSubtab;

    const hasDirty = vouchers.some(
      (v) => v.isDirty || (v.detailLines || []).some((l) => l.isDirty),
    );
    if (hasDirty) {
      useDraftStore.getState().saveDraft("approve-vouchers", {
        vouchers,
        selectedVoucher,
        selectedIds: Array.from(selectedIds),
        isFormView,
        activeSubtab,
        isDirty: true,
        hasUnsaved: true,
      });
    }
  }, [vouchers, selectedVoucher, selectedIds, isFormView, activeSubtab]);

  // Phase 3: Cleanup / Unmount save
  useEffect(() => {
    return () => {
      const cur = vouchersRef.current;
      if (
        cur &&
        cur.some((v) => v.isDirty || (v.detailLines || []).some((l) => l.isDirty))
      ) {
        useDraftStore.getState().saveDraft("approve-vouchers", {
          vouchers: cur,
          selectedVoucher: selectedVoucherRef.current,
          selectedIds: Array.from(selectedIdsRef.current),
          isFormView: isFormViewRef.current,
          activeSubtab: activeSubtabRef.current,
          isDirty: true,
          hasUnsaved: true,
        });
      }
    };
  }, []);

  // Load vouchers from DB & handle session redirect queue
  const loadVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`${apiBaseUrl}?limit=100`);
      const dbVouchers = (response.data || []).map(
        mapDbHeaderToApproveVoucher,
      );
      setVouchers(dbVouchers);
      if (dbVouchers.length > 0) {
        await selectVoucherRecord(dbVouchers[0], false);
      } else {
        setSelectedVoucher(null);
      }
    } catch {
      toast.error("Unable to load vouchers from database.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectVoucherRecord = async (
    voucher,
    shouldSwitchToFormView = false,
  ) => {
    setSelectedVoucher(voucher);
    if (shouldSwitchToFormView) {
      setIsFormView(true);
    }
    if (
      !voucher.voucherKey ||
      String(voucher.voucherKey).startsWith("NEW") ||
      String(voucher.voucherKey).startsWith("v")
    )
      return;

    try {
      const response = await api.get(`${apiBaseUrl}/${voucher.voucherKey}`);
      const hydratedRecord = mapHeaderToRecord(
        response.data.header || {},
        response.data.lines || [],
      );
      const queueFormat = buildApprovalQueueVoucher(hydratedRecord);

      setVouchers((prev) =>
        prev.map((v) =>
          getRowKey(v) === getRowKey(voucher)
            ? {
                ...queueFormat,
                appr: v.appr,
                hold: v.hold,
                overBudget: v.overBudget,
                isDirty: v.isDirty,
              }
            : v,
        ),
      );
      setSelectedVoucher((prev) =>
        prev && getRowKey(prev) === getRowKey(voucher)
          ? {
              ...queueFormat,
              appr: prev.appr,
              hold: prev.hold,
              overBudget: prev.overBudget,
              isDirty: prev.isDirty,
            }
          : prev,
      );
    } catch {
      toast.error("Unable to load voucher lines.");
    }
  };

  useEffect(() => {
    const initData = async () => {
      const pendingVoucher = sessionStorage.getItem(
        "apVoucherPendingApproval",
      );
      if (pendingVoucher) {
        try {
          const parsed = JSON.parse(pendingVoucher);
          if (parsed?.id) {
            setVouchers((prev) => {
              const withoutDuplicate = prev.filter(
                (v) => getRowKey(v) !== getRowKey(parsed),
              );
              return [parsed, ...withoutDuplicate];
            });
            await selectVoucherRecord(parsed, true);
          }
        } catch {}
        sessionStorage.removeItem("apVoucherPendingApproval");
      }
    };
    initData();
  }, []);

  // Detail grid/form edits (local state update)
  const handleVoucherFieldChange = (id, key, val) => {
    const v = vouchers.find((item) => getRowKey(item) === id);
    if (key !== "appr" && v && v.appr === "Y" && !v.isDirty) {
      toast.warn("Approved vouchers cannot be edited.");
      return;
    }
    setVouchers((prev) =>
      prev.map((item) =>
        getRowKey(item) === id ? { ...item, [key]: val, isDirty: true } : item,
      ),
    );
    setSelectedVoucher((prev) =>
      prev && getRowKey(prev) === id
        ? { ...prev, [key]: val, isDirty: true }
        : prev,
    );
  };

  // Phase 4: API Call on Save Button Click & Clear Draft
  const handleSaveVoucher = async () => {
    const dirtyVouchers = vouchers.filter((v) => v.isDirty);
    if (dirtyVouchers.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    const hasApprovals = dirtyVouchers.some((v) => v.appr === "Y");
    const confirmMessage = hasApprovals
      ? "Are you sure you want to approve and save the selected voucher(s)?"
      : "Are you sure you want to save the changes?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await Promise.all(
        dirtyVouchers.map(async (voucher) => {
          const voucherKey = voucher.voucherKey || voucher.voucher;
          if (
            !voucherKey ||
            String(voucherKey).startsWith("NEW") ||
            String(voucherKey).startsWith("v")
          ) {
            return;
          }

          // Reconstruct the record expected by buildVoucherPayload
          const parentRecord = {
            id: voucher.id,
            voucherKey: voucher.voucherKey || voucher.voucher,
            vendor: voucher.vendor,
            terms: voucher.terms,
            approved: voucher.appr,
            invoiceNumber: voucher.invoice,
            invoiceDate: voucher.invoiceDate,
            invoiceAmount: voucher.invoiceAmt,
            dueDate: voucher.dueDate,
            dueAmount: voucher.transDueAmt,
            discountPercent: voucher.discountPercent,
            discountDate: voucher.discountDate,
            discountAmount: voucher.discountAmt,
            voucherType: voucher.vchrType,
            originalVoucher: voucher.originalVoucher,
            totalTax: voucher.salesVatTaxAmt,
            holdVoucher: voucher.hold,
            overBudget: voucher.overBudget,
            entryUser: voucher.entryUser,
            checkAmount: voucher.checkAmount,
            checkNumber: voucher.checkNumber,
            checkDate: voucher.checkDate,
            checkDiscountTaken: voucher.discountTaken,
            useTaxAmount: voucher.useReverseTaxAmt,
            fiscalYear: voucher.fiscalYear,
            period: voucher.period,
            subperiod: voucher.subperiod,
            cashAccountsDescription: voucher.cashAccountsDescription,
            checkFiscalYear: voucher.checkFiscalYear,
            checkPeriod: voucher.checkPeriod,
            checkSubpd: voucher.checkSubpd,
            detailLines: voucher.detailLines || [],
          };

          const payload = buildVoucherPayload(parentRecord);
          payload.header.approved_fl = voucher.appr === "Y" ? "Y" : "N";

          await api.put(`${apiBaseUrl}/${voucherKey}`, payload);
        }),
      );

      useDraftStore.getState().clearDraft("approve-vouchers");
      toast.success("Voucher changes saved successfully.");
      await loadVouchers();
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Unable to save voucher changes.",
      );
    }
  };

  const handleDiscardChanges = () => {
    useDraftStore.getState().clearDraft("approve-vouchers");
    loadVouchers();
    toast.info("Changes discarded.");
  };

  const handleVoucherNavigation = (direction) => {
    if (displayVouchers.length === 0) return;
    const currentIndex = selectedVoucher
      ? displayVouchers.findIndex(
          (v) => getRowKey(v) === getRowKey(selectedVoucher),
        )
      : -1;

    let targetIndex = 0;
    if (direction === "start") targetIndex = 0;
    else if (direction === "prev")
      targetIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    else if (direction === "next")
      targetIndex =
        currentIndex >= 0 && currentIndex < displayVouchers.length - 1
          ? currentIndex + 1
          : displayVouchers.length - 1;
    else if (direction === "end") targetIndex = displayVouchers.length - 1;

    const nextVoucher = displayVouchers[targetIndex];
    if (nextVoucher) {
      selectVoucherRecord(nextVoucher, isFormView);
    }
  };

  // Subtab: Voucher Totals component rendering
  const renderVoucherTotalsContainer = () => {
    if (!selectedVoucher) return null;
    const vId = selectedVoucher.id;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-1">
        <FormInput
          label="Cost Amount"
          value={selectedVoucher.costAmount || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "costAmount", e.target.value)
          }
        />
        <FormInput
          label="Sales/VAT Tax Amount"
          value={selectedVoucher.salesVatTaxAmt || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "salesVatTaxAmt", e.target.value)
          }
        />
        <FormInput
          label="Recovery Amount"
          value={selectedVoucher.recoveryAmt || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "recoveryAmt", e.target.value)
          }
        />
        <FormInput
          label="Total Before Discount"
          value={selectedVoucher.totBeforeDisc || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "totBeforeDisc", e.target.value)
          }
        />
        <FormInput
          label="Discount Amount"
          value={selectedVoucher.discount || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "discount", e.target.value)
          }
        />
        <FormInput
          label="Total Amount"
          value={selectedVoucher.totalAmt || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "totalAmt", e.target.value)
          }
        />
        <FormInput
          label="Amount Paid"
          value={selectedVoucher.checkAmount || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "checkAmount", e.target.value)
          }
        />
        <FormInput
          label="Discount Taken Amount"
          value={selectedVoucher.checkDiscountTaken || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "checkDiscountTaken", e.target.value)
          }
        />
        <FormInput
          label="Use/Reverse Tax Amount"
          value={selectedVoucher.useReverseTaxAmt || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "useReverseTaxAmt", e.target.value)
          }
        />
      </div>
    );
  };

  // Subtab: PO Voucher Totals component rendering
  const renderPOTotalsContainer = () => {
    if (!selectedVoucher) return null;
    const vId = selectedVoucher.id;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-1">
        <FormInput
          label="PO Cost Amount"
          value={selectedVoucher.poCostAmount || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "poCostAmount", e.target.value)
          }
        />
        <FormInput
          label="PO Sales/VAT Tax Amount"
          value={selectedVoucher.poSalesVatTaxAmt || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "poSalesVatTaxAmt", e.target.value)
          }
        />
        <FormInput
          label="PO Recovery Amount"
          value={selectedVoucher.poRecoveryAmt || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "poRecoveryAmt", e.target.value)
          }
        />
        <FormInput
          label="PO Total Before Discount"
          value={selectedVoucher.poTotBeforeDisc || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "poTotBeforeDisc", e.target.value)
          }
        />
        <FormInput
          label="PO Discount Amount"
          value={selectedVoucher.poDiscount || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "poDiscount", e.target.value)
          }
        />
        <FormInput
          label="PO Total Amount"
          value={selectedVoucher.poTotalAmtTotal || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "poTotalAmtTotal", e.target.value)
          }
        />
        <FormInput
          label="PO Amount Paid"
          value={selectedVoucher.poCheckAmount || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "poCheckAmount", e.target.value)
          }
        />
        <FormInput
          label="PO Discount Taken Amount"
          value={selectedVoucher.poCheckDiscountTaken || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(
              vId,
              "poCheckDiscountTaken",
              e.target.value,
            )
          }
        />
        <FormInput
          label="PO Use/Reverse Tax Amount"
          value={selectedVoucher.poUseReverseTaxAmt || "0.00"}
          onChange={(e) =>
            handleVoucherFieldChange(vId, "poUseReverseTaxAmt", e.target.value)
          }
        />
      </div>
    );
  };

  // Subtab: PO Voucher Lines rendering
  const renderPOLinesContainer = () => {
    if (!selectedVoucher) return null;
    const poLinesData = [
      {
        id: "line1",
        poNumber: selectedVoucher.poNumber || "N/A",
        lineNo: selectedVoucher.poLineNo || "1",
        itemDesc: "Material procurement line item",
        qty: selectedVoucher.poQty || "0",
        unitCost: (
          toNumber(selectedVoucher.poCost, 0) /
          toNumber(selectedVoucher.poQty, 1)
        ).toFixed(2),
        totalAmt: selectedVoucher.poTotalAmt || "0.00",
        taxAmt: selectedVoucher.poTaxAmt || "0.00",
      },
    ];

    const poColumns = [
      { id: "poNumber", key: "poNumber", label: "PO Number" },
      { id: "lineNo", key: "lineNo", label: "Line No" },
      { id: "itemDesc", key: "itemDesc", label: "Item Description" },
      { id: "qty", key: "qty", label: "Quantity" },
      { id: "unitCost", key: "unitCost", label: "Unit Cost" },
      { id: "totalAmt", key: "totalAmt", label: "Total Amount" },
      { id: "taxAmt", key: "taxAmt", label: "Tax Amount" },
    ];

    return (
      <div className="p-2 bg-white border border-gray-200">
        <ReusableTable
          data={poLinesData}
          columns={poColumns}
          selectedRows={[]}
          onRowSelect={() => {}}
          rowKey={getRowKey}
          maxHeight="max-h-48"
        />
      </div>
    );
  };

  // Subtab: Voucher Detail rendering
  const renderVoucherDetailContainer = () => {
    if (!selectedVoucher) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-1">
        <FormInput
          label="Vendor"
          value={selectedVoucher.vendor || ""}
          readOnly
        />
        <FormInput
          label="Vendor Name"
          value={selectedVoucher.vendorName || ""}
          readOnly
        />
        <FormInput
          label="Voucher"
          value={selectedVoucher.voucher || ""}
          readOnly
        />
        <FormInput
          label="Invoice Amt"
          value={selectedVoucher.invoiceAmt || ""}
          readOnly
        />
        <FormInput
          label="Invoice"
          value={selectedVoucher.invoice || ""}
          readOnly
        />
        <FormInput
          label="Invoice Date"
          value={selectedVoucher.invoiceDate || ""}
          readOnly
        />
        <FormInput
          label="Terms"
          value={selectedVoucher.terms || ""}
          readOnly
        />
        <FormInput
          label="Entry User"
          value={selectedVoucher.entryUser || ""}
          readOnly
        />
      </div>
    );
  };

  isCurrentVoucherApprovedLocked =
    selectedVoucher?.appr === "Y" && !selectedVoucher?.isDirty;

  return (
    <div className="payment-voucher-page min-h-full bg-white text-[#1f2937] font-inter">
      <style>
        {`
        .payment-voucher-page { font-size:12px; color:#1f2937; }
        .payment-voucher-page .voucher-head-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; padding:0 12px; border:1px solid #d5dfeb; border-radius:7px; background:#fff; color:#344a63; font-size:11px; font-weight:600; cursor:pointer; }
        .payment-voucher-page .voucher-head-btn:hover { background:#f5f8fb; border-color:#b9c8d8; }
        .payment-voucher-page .voucher-primary-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; padding:0 12px; border:1px solid #1677e8; border-radius:7px; background:#1677e8; color:#fff; font-size:11px; font-weight:600; cursor:pointer; }
        .payment-voucher-page .voucher-primary-btn:hover { background:#125bc3; border-color:#125bc3; }
        .payment-voucher-page .voucher-tabs { display:flex; align-items:flex-end; gap:0; border-bottom:1px solid #dbe3eb; min-height:40px; }
        .payment-voucher-page .voucher-tab { position:relative; padding:0 17px 11px; height:40px; border:0; background:transparent; color:#63758b; font-size:12px; font-weight:500; white-space:nowrap; cursor:pointer; }
        .payment-voucher-page .voucher-tab:hover { color:#1677e8; }
        .payment-voucher-page .voucher-tab.active { color:#1677e8; font-weight:700; }
        .payment-voucher-page .voucher-tab.active:after { content:""; position:absolute; left:12px; right:12px; bottom:-1px; height:2px; background:#1677e8; border-radius:2px 2px 0 0; }
        .payment-voucher-page .voucher-master-card { padding:14px; border:1px solid #e5e7eb; border-radius:6px; background:#fff; }
        .payment-voucher-page .voucher-panel-title { display:flex; align-items:center; min-height:28px; margin-bottom:12px; padding:0 0 9px; border-bottom:1px solid #e4eaf0; color:#1f2f44; font-size:12px; font-weight:700; }
        .payment-voucher-page .voucher-content-shell { border:0 !important; padding:0 !important; background:transparent !important; }
        .voucher-nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 30px;
          border: 0;
          border-right: 1px solid #d5dfeb;
          background: #f5f8fb;
          color: #718096;
          cursor: pointer;
        }
        .voucher-nav-btn:last-child {
          border-right: 0;
        }
        .voucher-nav-btn:hover {
          background: #eaf1f7;
          color: #17414d;
        }
        .voucher-nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .voucher-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          height: 30px;
          padding: 0 8px;
          background: #fff;
          color: #17414d;
          font-size: 11px;
          font-weight: 700;
        }
      `}
      </style>

      {/* TOP BREADCRUMB BAR */}
      <div className="h-[50px] border-b border-[#e5e7eb] bg-white px-5 ml-[15px]">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-[11px] text-[#7b8798]">
            <span className="font-medium text-[#4f5f76]">Accounting</span>
            <span>›</span>
            <span className="font-medium text-[#4f5f76]">Accounts Payable</span>
            <span>›</span>
            <span className="truncate">Approve Vouchers</span>
          </div>
        </div>
      </div>

      {/* PAGE HEADER & TOOLBAR */}
      <div className="border-b border-[#dbe3eb] bg-white ml-[15px]">
        <div className="flex items-center justify-between gap-3 pl-4 pr-3 py-2 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[18px] font-semibold tracking-[-0.2px] text-[#172b4d] whitespace-nowrap">
              Approve Vouchers
            </h1>

            {/* Pagination Navigation */}
            <div className="flex items-center rounded-md border border-[#d5dfeb] bg-[#f5f8fb] overflow-hidden">
              <button
                type="button"
                className="voucher-nav-btn"
                title="First voucher"
                onClick={() => handleVoucherNavigation("start")}
                disabled={displayVouchers.length === 0}
              >
                <ChevronsLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="voucher-nav-btn"
                title="Previous voucher"
                onClick={() => handleVoucherNavigation("prev")}
                disabled={displayVouchers.length === 0}
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <span className="voucher-count">
                {selectedVoucher
                  ? displayVouchers.findIndex(
                      (v) => getRowKey(v) === getRowKey(selectedVoucher),
                    ) + 1
                  : 0}{" "}
                / {displayVouchers.length}
              </span>
              <button
                type="button"
                className="voucher-nav-btn"
                title="Next voucher"
                onClick={() => handleVoucherNavigation("next")}
                disabled={displayVouchers.length === 0}
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="voucher-nav-btn"
                title="Last voucher"
                onClick={() => handleVoucherNavigation("end")}
                disabled={displayVouchers.length === 0}
              >
                <ChevronsRight size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center ml-1">
              <Search
                size={13}
                className="absolute left-2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search..."
                className="h-7 w-36 pl-7 pr-6 text-[11px] bg-[#f6f6f6] hover:bg-slate-100/80 focus:bg-white border border-[#d5dfeb] rounded-md outline-none text-[#3c4043] placeholder:text-gray-400 focus:border-[#1677e8] transition-all"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleSaveVoucher}
              className="voucher-primary-btn"
            >
              <Save size={14} /> Save
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="voucher-head-btn"
              title="Copy"
            >
              <Copy size={13} /> Copy
            </button>

            <button
              type="button"
              onClick={handlePaste}
              className="voucher-head-btn"
              title="Paste"
            >
              <ClipboardPaste size={13} /> Paste
            </button>

            <button
              type="button"
              onClick={() => setShowFindReplace(!showFindReplace)}
              className={`voucher-head-btn ${
                showFindReplace
                  ? "bg-slate-100 border-[#1677e8] text-[#1677e8]"
                  : ""
              }`}
              title="Find & Replace"
            >
              <Replace size={14} /> Find/Replace
            </button>

            <button
              type="button"
              onClick={handleDiscardChanges}
              className="voucher-head-btn"
            >
              Cancel
            </button>

            {/* Form / Table View Switch */}
            <button
              type="button"
              onClick={() => setIsFormView(!isFormView)}
              disabled={isLoading}
              className="relative flex h-[30px] w-[82px] items-center rounded-full border border-[#d5dfeb] bg-[#f5f8fb] p-[3px] transition-all duration-200 disabled:opacity-50"
            >
              <span
                className={`absolute top-[3px] h-[24px] w-[38px] rounded-full bg-white shadow-sm transition-all duration-200 ${
                  isFormView ? "left-[3px]" : "left-[41px]"
                }`}
              />
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center text-[10px] font-semibold ${
                  isFormView ? "text-[#1677e8]" : "text-[#7b8798]"
                }`}
              >
                Form
              </span>
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center text-[10px] font-semibold ${
                  !isFormView ? "text-[#1677e8]" : "text-[#7b8798]"
                }`}
              >
                Table
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="px-4 pb-4 pt-3 lg:px-4">
        {/* Find & Replace Bar */}
        {showFindReplace && (
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2.5 animate-in slide-in-from-top-1 duration-150 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-semibold text-slate-600">
                  In:
                </span>
                <select
                  value={searchColumn}
                  onChange={(e) => setSearchColumn(e.target.value)}
                  className="px-2 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-700 outline-none focus:border-[#1677e8]"
                >
                  <option value="all">All Columns</option>
                  {detailsColumns.map((col) => (
                    <option key={col.key || col.id} value={col.key || col.id}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Find..."
                  value={findValue}
                  onChange={(e) => setFindValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFind()}
                  className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#1677e8] w-36"
                />
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceValue}
                  disabled={
                    searchColumn === "voucher" ||
                    searchColumn === "fiscalYear"
                  }
                  onChange={(e) => setReplaceValue(e.target.value)}
                  className={`px-2.5 py-1 text-[11px] border border-slate-300 rounded font-medium outline-none w-36 ${
                    searchColumn === "voucher" ||
                    searchColumn === "fiscalYear"
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed placeholder:text-slate-300"
                      : "bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#1677e8]"
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleFind}
                className="px-2.5 py-1 text-[11px] font-semibold text-[#1677e8] bg-blue-50 hover:bg-blue-100 border border-[#1677e8]/30 rounded cursor-pointer transition-colors"
              >
                Find / Filter
              </button>

              <button
                type="button"
                disabled={
                  searchColumn === "voucher" || searchColumn === "fiscalYear"
                }
                onClick={handleReplaceAll}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                  searchColumn === "voucher" || searchColumn === "fiscalYear"
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "text-white bg-[#1677e8] hover:bg-[#125bc3] cursor-pointer"
                }`}
              >
                Replace All
              </button>

              <button
                type="button"
                onClick={handleClearFind}
                className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/70 border border-slate-200 rounded cursor-pointer transition-colors"
              >
                Reset
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowFindReplace(false)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* TABLE VIEW OR FORM VIEW */}
        <div className="new-ui-content text-xs">
          {!isFormView ? (
            <div className="bg-white border border-gray-200 p-2">
              <ReusableTable
                data={displayVouchers}
                columns={activeColumns}
                selectedRows={displayVouchers.filter((r) =>
                  selectedIds.has(getRowKey(r)),
                )}
                onSelectAll={(e) => {
                  if (e.target.checked) {
                    setSelectedIds(
                      new Set(displayVouchers.map(getRowKey)),
                    );
                  } else {
                    setSelectedIds(new Set());
                  }
                }}
                onRowSelect={(item) => {
                  const key = getRowKey(item);
                  const newIds = new Set(selectedIds);
                  const wasSelected = newIds.has(key);
                  if (wasSelected) {
                    newIds.delete(key);
                  } else {
                    newIds.add(key);
                  }
                  setSelectedIds(newIds);
                  selectVoucherRecord(item, false);
                }}
                onFieldChange={handleVoucherFieldChange}
                rowKey={getRowKey}
              />
            </div>
          ) : !selectedVoucher ? (
            <div className="text-center text-gray-400 italic text-[11px] py-6">
              Select a voucher to see details.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Identification & Status */}
                <FormSection title="Voucher Identification & Status">
                  <div className="space-y-2">
                    <FormInput
                      label="Vendor"
                      value={selectedVoucher.vendor || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "vendor",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="Vendor Name"
                      value={selectedVoucher.vendorName || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "vendorName",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="Voucher"
                      value={selectedVoucher.voucher || ""}
                      readOnly={true}
                    />
                    <FormInput
                      label="Vchr Type"
                      value={selectedVoucher.vchrType || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "vchrType",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="Original Voucher"
                      value={selectedVoucher.originalVoucher || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "originalVoucher",
                          e.target.value,
                        )
                      }
                    />
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <FormInput
                        label="Approve"
                        type="checkbox"
                        checked={selectedVoucher.appr === "Y"}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "appr",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                      <FormInput
                        label="Hold"
                        type="checkbox"
                        checked={selectedVoucher.hold === "Y"}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "hold",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                      <FormInput
                        label="Over Budget"
                        type="checkbox"
                        checked={selectedVoucher.overBudget === "Y"}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "overBudget",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                    </div>
                  </div>
                </FormSection>

                {/* 2. Invoice & Discount Details */}
                <FormSection title="Invoice & Discount Details">
                  <div className="space-y-2">
                    <FormInput
                      label="Invoice"
                      value={selectedVoucher.invoice || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "invoice",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="Invoice Date"
                      type="date"
                      value={selectedVoucher.invoiceDate || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "invoiceDate",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="Invoice Amt"
                      value={selectedVoucher.invoiceAmt || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "invoiceAmt",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="Terms"
                      value={selectedVoucher.terms || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "terms",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="Due Date"
                      type="date"
                      value={selectedVoucher.dueDate || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "dueDate",
                          e.target.value,
                        )
                      }
                    />
                    <FormInput
                      label="Trans Due Amt"
                      value={selectedVoucher.transDueAmt || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "transDueAmt",
                          e.target.value,
                        )
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput
                        label="Discount %"
                        value={selectedVoucher.discountPercent || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "discountPercent",
                            e.target.value,
                          )
                        }
                      />
                      <FormInput
                        label="Discount Amt"
                        value={selectedVoucher.discountAmt || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "discountAmt",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <FormInput
                      label="Discount Date"
                      type="date"
                      value={selectedVoucher.discountDate || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "discountDate",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </FormSection>

                {/* 3. Payment & Posting Info */}
                <FormSection title="Payment & Posting Info">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput
                        label="Check Number"
                        value={selectedVoucher.checkNumber || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "checkNumber",
                            e.target.value,
                          )
                        }
                      />
                      <FormInput
                        label="Check Date"
                        type="date"
                        value={selectedVoucher.checkDate || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "checkDate",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput
                        label="Check Amount"
                        value={selectedVoucher.checkAmount || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "checkAmount",
                            e.target.value,
                          )
                        }
                      />
                      <FormInput
                        label="Discount Taken"
                        value={selectedVoucher.discountTaken || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "discountTaken",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <FormInput
                      label="Cash Description"
                      value={selectedVoucher.cashAccountsDescription || ""}
                      onChange={(e) =>
                        handleVoucherFieldChange(
                          selectedVoucher.id,
                          "cashAccountsDescription",
                          e.target.value,
                        )
                      }
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <FormInput
                        label="Fiscal Year"
                        value={selectedVoucher.fiscalYear || ""}
                        readOnly={true}
                      />
                      <FormInput
                        label="Period"
                        value={selectedVoucher.period || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "period",
                            e.target.value,
                          )
                        }
                      />
                      <FormInput
                        label="Subperiod"
                        value={selectedVoucher.subperiod || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "subperiod",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <FormInput
                        label="Chk FY"
                        value={selectedVoucher.checkFiscalYear || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "checkFiscalYear",
                            e.target.value,
                          )
                        }
                      />
                      <FormInput
                        label="Chk Period"
                        value={selectedVoucher.checkPeriod || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "checkPeriod",
                            e.target.value,
                          )
                        }
                      />
                      <FormInput
                        label="Chk Subpd"
                        value={selectedVoucher.checkSubpd || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "checkSubpd",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput
                        label="Entry User"
                        value={selectedVoucher.entryUser || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "entryUser",
                            e.target.value,
                          )
                        }
                      />
                      <FormInput
                        label="Discr Calc Date"
                        type="date"
                        value={selectedVoucher.discrCalcDate || ""}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "discrCalcDate",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <FormInput
                        label="Manual Ck"
                        type="checkbox"
                        checked={selectedVoucher.manualCk === "Y"}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "manualCk",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                      <FormInput
                        label="PO Discr"
                        type="checkbox"
                        checked={selectedVoucher.poDiscrepancy === "Y"}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "poDiscrepancy",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                      <FormInput
                        label="Rcpt Discr"
                        type="checkbox"
                        checked={selectedVoucher.rcptDiscrepancy === "Y"}
                        onChange={(e) =>
                          handleVoucherFieldChange(
                            selectedVoucher.id,
                            "rcptDiscrepancy",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                    </div>
                  </div>
                </FormSection>
              </div>

              {/* BOTTOM SUB-TABS NAVIGATION */}
              <div className="mt-4 border-t pt-4">
                {/* TABS HEADER */}
                <div className="voucher-tabs mb-3 overflow-x-auto">
                  {[
                    "Voucher Detail",
                    "PO Voucher Lines",
                    "Voucher Totals",
                    "PO Voucher Totals",
                  ].map((tab) => {
                    const isActive = activeSubtab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveSubtab(tab)}
                        className={`voucher-tab ${isActive ? "active" : ""}`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* TABS CONTAINER */}
                {activeSubtab && (
                  <SecondaryContainer
                    title={`Approve Vouchers Details > ${activeSubtab}`}
                    handleClose={() => setActiveSubtab("")}
                    className="shadow-sm bg-white border border-slate-200 rounded-lg"
                  >
                    <FormSection>
                      {activeSubtab === "Voucher Detail" &&
                        renderVoucherDetailContainer()}
                      {activeSubtab === "PO Voucher Lines" &&
                        renderPOLinesContainer()}
                      {activeSubtab === "Voucher Totals" &&
                        renderVoucherTotalsContainer()}
                      {activeSubtab === "PO Voucher Totals" &&
                        renderPOTotalsContainer()}
                    </FormSection>
                  </SecondaryContainer>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveVouchers;
