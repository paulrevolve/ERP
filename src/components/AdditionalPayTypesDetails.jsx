import React, {useEffect} from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

// Column definitions ensure all form fields are present in the table view
export const additionalPayColumns = [
  { value: "payType", label: "Pay Type *", key: "payType" },
  { value: "payDescription", label: "Description", key: "payDescription" },
];

const AdditionalPayTypesDetailsTab = ({ data, onChange, isFormView, setConfig }) => {

  useEffect(() => {
    if (setConfig) {
      setConfig({ key: "additionalPayRecords", cols: additionalPayColumns });
    }
  }, [setConfig]);
  
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = data.additionalPayRecords || [];

  // Table View
  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={additionalPayColumns} 
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
          <div className="flex gap-2">
            <FormInput 
              label="Pay Type *" 
              value={data.payType || ""} 
              onChange={(e) => onChange(currentKey, 'payType', e.target.value)} 
            />
            {/* Gray placeholder matching the visual style of your software */}
            <div className="w-48 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
          </div>
          <FormInput 
            label="Description" 
            value={data.payDescription || ""} 
            onChange={(e) => onChange(currentKey, 'payDescription', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalPayTypesDetailsTab;