import React, { useEffect }from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

export const savingBondsColumns = [
  { value: "effDate", label: "Effective Date *", key: "effDate", type: "date" },
  { value: "deductionCode", label: "Deduction *", key: "deductionCode" },
  { value: "computeMethod", label: "Compute Method *", key: "computeMethod", type: "select" },
  { value: "rateAmount", label: "Rate/Amount *", key: "rateAmount" },
  { value: "limit", label: "Limit *", key: "limit" },
  { value: "priority", label: "Priority", key: "priority" },
  { value: "startDate", label: "Start Date", key: "startDate", type: "date" },
  { value: "endDate", label: "End Date", key: "endDate", type: "date" },
  { value: "begBalance", label: "Beginning Balance", key: "begBalance" },
  { value: "bondFunds", label: "Bond Funds", key: "bondFunds" },
  { value: "amtSpent", label: "Amount Spent", key: "amtSpent" },
  { value: "balance", label: "Balance", key: "balance" },
];

const SavingBondsDetailsTab = ({ data, onChange, isFormView, setConfig }) => {
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = data.savingBondsRecords || [];

  useEffect(() => {
    if (setConfig) {
      setConfig({ 
        key: "savingBondsRecords", 
        cols: savingBondsColumns 
      });
    }
  }, [setConfig]);

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={savingBondsColumns} 
          onFieldChange={onChange} 
          maxHeight="max-h-48" 
        />
      </div>
    );
  }

  return (
    <div className="p-2 space-y-3">
      {/* Top Level Field */}
      <div className="px-1">
        <FormInput 
          label="Effective Date *" 
          type="date" 
          value={data.effDate || ""} 
          onChange={(e) => onChange(currentKey, 'effDate', e.target.value)} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Deduction Information Section */}
        <FormSection title="Deduction Information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1">
            <div className="space-y-1">
              <FormInput 
                label="Deduction *" 
                value={data.deductionCode || ""} 
                onChange={(e) => onChange(currentKey, 'deductionCode', e.target.value)} 
              />
              <FormInput 
                label="Compute Method *" 
                type="select" 
                value={data.computeMethod || ""} 
                onChange={(e) => onChange(currentKey, 'computeMethod', e.target.value)} 
                options={[]} 
              />
              <FormInput 
                label="Rate/Amount *" 
                value={data.rateAmount || ""} 
                onChange={(e) => onChange(currentKey, 'rateAmount', e.target.value)} 
              />
              <FormInput 
                label="Limit *" 
                value={data.limit || ""} 
                onChange={(e) => onChange(currentKey, 'limit', e.target.value)} 
              />
            </div>
            <div className="space-y-1">
              <div className="flex">
                <FormInput 
                  label="Priority" 
                  value={data.priority || ""} 
                  onChange={(e) => onChange(currentKey, 'priority', e.target.value)} 
                />
                <div className="w-16 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
              </div>
              <FormInput 
                label="Start Date" 
                type="date" 
                value={data.startDate || ""} 
                onChange={(e) => onChange(currentKey, 'startDate', e.target.value)} 
              />
              <FormInput 
                label="End Date" 
                type="date" 
                value={data.endDate || ""} 
                onChange={(e) => onChange(currentKey, 'endDate', e.target.value)} 
              />
            </div>
          </div>
        </FormSection>

        {/* Activity Section */}
        <FormSection title="Activity">
          <div className="space-y-1">
            <FormInput 
              label="Beginning Balance" 
              value={data.begBalance || ""} 
              onChange={(e) => onChange(currentKey, 'begBalance', e.target.value)} 
            />
            <FormInput 
              label="Bond Funds" 
              value={data.bondFunds || ""} 
              readOnly 
              className="bg-gray-100"
            />
            <FormInput 
              label="Amount Spent" 
              value={data.amtSpent || ""} 
              readOnly 
              className="bg-gray-100"
            />
            <FormInput 
              label="Balance" 
              value={data.balance || ""} 
              readOnly 
              className="bg-gray-100"
            />
          </div>
        </FormSection>
      </div>
    </div>
  );
};

export default SavingBondsDetailsTab;