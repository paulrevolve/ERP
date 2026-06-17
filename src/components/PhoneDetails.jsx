import React, {useEffect} from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

// Column definitions ensure form fields are present in the table view
export const phoneColumns = [
  { value: "phoneType", label: "Type *", key: "phoneType", type: "select" },
  { value: "phoneNumber", label: "Phone Number *", key: "phoneNumber" },
  { value: "extension", label: "Ext", key: "extension" },
];

const PhoneDetailsTab = ({ data, onChange, isFormView, setConfig }) => {

  useEffect(() => {
    if (setConfig) {
      setConfig({ key: "phoneRecords", cols: phoneColumns });
    }
  }, [setConfig]);
  
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = data.phoneRecords || [];

  // Table View
  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={phoneColumns} 
          onFieldChange={onChange} 
          maxHeight="max-h-48" 
        />
      </div>
    );
  }

  // Form View based on the provided image headers
  return (
    <div className="p-2 space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm max-w-2xl">
        <div className="space-y-1">
          <FormInput 
            label="Type *" 
            type="select"
            value={data.phoneType || ""} 
            onChange={(e) => onChange(currentKey, 'phoneType', e.target.value)}
            options={[
              { label: "Home", value: "HOME" },
              { label: "Work", value: "WORK" },
              { label: "Mobile", value: "CELL" },
              { label: "Fax", value: "FAX" }
            ]} 
            optionLabel="label"
            optionValue="value"
          />
          <FormInput 
            label="Phone Number *" 
            value={data.phoneNumber || ""} 
            onChange={(e) => onChange(currentKey, 'phoneNumber', e.target.value)} 
          />
          <div className="flex">
            <FormInput 
              label="Ext" 
              value={data.extension || ""} 
              onChange={(e) => onChange(currentKey, 'extension', e.target.value)} 
            />
            <div className="w-16 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetailsTab;