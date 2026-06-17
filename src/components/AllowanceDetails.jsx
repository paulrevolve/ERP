import React from "react";
import { useEffect } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

// Column definitions for the Table View
export const allowanceColumns = [
  { value: "allowCode", label: "Allowance Code *", key: "allowCode" },
  { value: "effDate", label: "Effective Date", key: "effDate", type: "date" },
  { value: "throughDate", label: "Through Date", key: "throughDate", type: "date" },
  { value: "allowRate", label: "Allowance Rate", key: "allowRate" },
  { value: "project", label: "Project", key: "project" },
  { value: "account", label: "Account", key: "account" },
  { value: "org", label: "Organization", key: "org" },
  { value: "glc", label: "GLC", key: "glc" },
  { value: "plc", label: "PLC", key: "plc" },
  { value: "laborLoc", label: "Labor Location", key: "laborLoc" },
  { value: "workersComp", label: "Workers' Comp", key: "workersComp" },
  { value: "whState", label: "W/H State", key: "whState" },
  { value: "refNo1", label: "Ref No 1", key: "refNo1" },
  { value: "refNo2", label: "Ref No 2", key: "refNo2" },
];

const AllowanceDetailsTab = ({ data, onChange, isFormView, setConfig }) => {

  // Use useEffect to send column info to the parent on mount
  useEffect(() => {
    if (setConfig) {
      setConfig({ 
        key: "allowanceRecords", 
        cols: allowanceColumns 
      });
    }
  }, [setConfig]);

  // Use the established stable key helper logic
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = data.allowanceRecords || [];
  const activeRecord = records[0] ?? {};

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={allowanceColumns} 
          onFieldChange={onChange} 
          maxHeight="max-h-48" 
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {/* Top Section: Primary Allowance Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1">
          <FormInput 
            label="Allowance Code *" 
            value={data.allowCode || ""} 
            onChange={(e) => onChange(currentKey, 'allowCode', e.target.value)} 
          />
          <FormInput 
            label="Effective Date" 
            type="date" 
            value={data.effDate || ""} 
            onChange={(e) => onChange(currentKey, 'effDate', e.target.value)} 
          />
          <FormInput 
            label="Through Date" 
            type="date" 
            value={data.throughDate || ""} 
            onChange={(e) => onChange(currentKey, 'throughDate', e.target.value)} 
          />
          <div className="flex gap-2">
             <FormInput 
                label="Allowance Rate" 
                value={data.allowRate || ""} 
                onChange={(e) => onChange(currentKey, 'allowRate', e.target.value)} 
             />
             <div className="w-24 bg-gray-100 border border-gray-300 rounded h-6 mt-1"></div> {/* Placeholder for the gray box in your image */}
          </div>
        </div>
      </div>

      {/* Bottom Section: Timesheet Defaults */}
      <FormSection title="Allowance Timesheet Line Defaults">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
          <div className="space-y-1">
            <FormInput label="Project" value={data.project || ""} onChange={(e) => onChange(currentKey, 'project', e.target.value)} />
            <FormInput label="Account" value={data.account || ""} onChange={(e) => onChange(currentKey, 'account', e.target.value)} />
            <FormInput label="Organization" value={data.org || ""} onChange={(e) => onChange(currentKey, 'org', e.target.value)} />
            <FormInput label="GLC" value={data.glc || ""} onChange={(e) => onChange(currentKey, 'glc', e.target.value)} />
            <FormInput label="PLC" value={data.plc || ""} onChange={(e) => onChange(currentKey, 'plc', e.target.value)} />
          </div>
          <div className="space-y-1">
            <FormInput label="Labor Location" value={data.laborLoc || ""} onChange={(e) => onChange(currentKey, 'laborLoc', e.target.value)} />
            <FormInput label="Workers' Compensation" value={data.workersComp || ""} onChange={(e) => onChange(currentKey, 'workersComp', e.target.value)} />
            <FormInput label="W/H State" value={data.whState || ""} onChange={(e) => onChange(currentKey, 'whState', e.target.value)} />
            <FormInput label="Ref No 1" value={data.refNo1 || ""} onChange={(e) => onChange(currentKey, 'refNo1', e.target.value)} />
            <FormInput label="Ref No 2" value={data.refNo2 || ""} onChange={(e) => onChange(currentKey, 'refNo2', e.target.value)} />
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export default AllowanceDetailsTab;