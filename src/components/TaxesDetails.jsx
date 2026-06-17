import React, { useState, useEffect } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

const taxColumns = [
      { value: "payCycle", label: "Pay Cycle", key: "payCycle" },
      { value: "taxServiceId", label: "Tax Service Group ID", key: "taxServiceId" },
      { value: "fedFilingStatus", label: "Fed Filing Status", key: "fedFilingStatus" },
      { value: "stateWithholding", label: "Withholding State", key: "stateWithholding" },
    ];

const TaxesDetailsTab = ({ data, onChange, isFormView, setConfig }) => {
  const [activeSubTab, setActiveSubTab] = useState("federal");
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");

  // 2. Add useEffect to send config to parent
  useEffect(() => {
    if (setConfig) {
      setConfig({ 
        key: "taxRecords", 
        cols: taxColumns 
      });
    }
  }, [setConfig]);

  // Render Table View (Combined columns for quick overview)
  if (!isFormView) {
    
    return (
      <div className="p-2">
        <ReusableTable data={data.taxRecords || []} columns={taxColumns} onFieldChange={onChange} maxHeight="max-h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2">
      {/* --- Header Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-2 rounded border border-gray-100">
        <div className="space-y-1">
          <FormInput label="Pay Cycle *" value={data.payCycle || ""} onChange={(e) => onChange(currentKey, 'payCycle', e.target.value)} />
          <FormInput label="Tax Service Group ID" value={data.taxServiceId || ""} onChange={(e) => onChange(currentKey, 'taxServiceId', e.target.value)} />
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <FormInput label="Retirement Plan Covered" type="checkbox" checked={data.retirementPlanFl === "Y"} onChange={(e) => onChange(currentKey, 'retirementPlanFl', e.target.checked ? "Y" : "N")} />
          <FormInput label="Nonresident Alien" type="checkbox" checked={data.nonResAlienFl === "Y"} onChange={(e) => onChange(currentKey, 'nonResAlienFl', e.target.checked ? "Y" : "N")} />
        </div>
      </div>

      {/* --- Sub Tabs (Federal / State) --- */}
      <div className="flex gap-4 border-b border-gray-200 mt-2">
        {["Federal", "State"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveSubTab(t.toLowerCase())}
            className={`px-4 py-1 text-[11px] font-bold transition-all ${activeSubTab === t.toLowerCase() ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-400"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-2 min-h-[350px]">
        {activeSubTab === "federal" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSection title="Federal">
              <FormInput label="Form W-4 Revision Year *" type="select" value={data.w4Year || "2020"} options={[{label: "2020 or greater", value: "2020"}]} optionLabel="label" optionValue="value" />
              <FormInput label="Federal Filing Status" type="select" value={data.fedFilingStatus || ""} options={[]} />
              <FormInput label="Total Number of Allowances" value={data.fedAllowances || "0"} />
              <FormInput label="Multiple Jobs or Spouse Works" type="checkbox" checked={data.multipleJobsFl === "Y"} />
              
              <div className="mt-4 space-y-1">
                <FormInput label="Qualifying Children Under 17" value={data.qualChildren || "0"} />
                <FormInput label="Other Dependents" value={data.otherDependents || "0"} />
                <FormInput label="Other Tax Credit Amount" value={data.otherTaxCredit || "0.00"} />
              </div>

              <div className="mt-4 space-y-1">
                <FormInput label="Other Income (not from jobs)" value={data.otherIncome || "0.00"} />
                <FormInput label="Deductions (W-4 Worksheet)" value={data.w4Deductions || "0.00"} />
                <FormInput label="Extra Withholding per Pay Period" value={data.extraWithholding || "0.00"} />
              </div>

              <div className="mt-4 space-y-1">
                <FormInput label="Override Amount per Pay Period" value={data.overrideAmt || ""} />
                <FormInput label="Override Withholding Percent" value={data.overridePct || ""} />
              </div>
              <FormInput label="Disable ESS Federal W-4/Lock-in letter" type="checkbox" checked={data.disableEssFl === "Y"} />
            </FormSection>

            <FormSection title="Subject to">
              <FormInput label="FUTA" type="checkbox" checked={data.subjFuta === "Y"} />
              <FormInput label="Medicare" type="checkbox" checked={data.subjMedicare === "Y"} />
              <FormInput label="Social Security" type="checkbox" checked={data.subjSocSec === "Y"} />
            </FormSection>
          </div>
        ) : (
          /* --- STATE TAB --- */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSection title="State Withholding">
              <FormInput label="Withholding State" value={data.stateWithholding || ""} />
              <FormInput label="Taxable Entity State" value={data.taxableEntityState || ""} readOnly />
              <FormInput label="Filing Status" type="select" value={data.stateFilingStatus || ""} options={[]} />
              
              <div className="mt-2 space-y-1">
                <FormInput label="Exemptions" value={data.stateExemptions || ""} />
                <FormInput label="Blindness Exemptions" value={data.blindExemptions || "0"} />
                <FormInput label="Age 65 Exemptions" value={data.ageExemptions || "0"} />
              </div>

              <div className="mt-2 space-y-1">
                <FormInput label="First-time claimed dependents" value={data.firstTimeDeps || "0"} />
                <FormInput label="Number of adopted children" value={data.adoptedChildren || ""} />
              </div>

              <div className="mt-2 space-y-1">
                <FormInput label="Credit Amount" value={data.stateCreditAmt || "0.00"} />
                <FormInput label="Override Amount" value={data.stateOverrideAmt || ""} />
                <FormInput label="Override Percent" value={data.stateOverridePct || ""} />
              </div>
            </FormSection>

            <FormSection title="SUTA">
              <FormInput label="SUTA State" value={data.sutaState || ""} />
              <FormInput label="Subject To SUTA" type="checkbox" checked={data.subjSuta === "Y"} />
              <div className="mt-4 space-y-1">
                <FormInput label="Occupational/SOC Code" value={data.socCode || ""} />
                <FormInput label="Worksite Number" value={data.worksiteNo || ""} />
                <FormInput label="U.S. Citizenship (VI)" type="select" value={data.citizenshipVi || ""} options={[]} />
              </div>
            </FormSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxesDetailsTab;