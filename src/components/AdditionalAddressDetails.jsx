import React, { useEffect } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

// Column definitions for the Table View
export const additionalAddressColumns = [
  { value: "addressType", label: "Type *", key: "addressType", type: "select" },
  { value: "line1", label: "Line 1 *", key: "line1" },
  { value: "line2", label: "Line 2", key: "line2" },
  { value: "line3", label: "Line 3", key: "line3" },
  { value: "cityName", label: "City", key: "cityName" },
  { value: "stateProv", label: "State/Province", key: "stateProv" },
  { value: "postalCode", label: "Postal Code", key: "postalCode" },
  { value: "countryCd", label: "Country", key: "countryCd" },
];

const AdditionalAddressDetailsTab = ({ data, onChange, isFormView, setConfig }) => {

  useEffect(() => {
    if (setConfig) {
      setConfig({ key: "additionalAddressRecords", cols: additionalAddressColumns });
    }
  }, [setConfig]);
  
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = data.additionalAddressRecords || [];

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={additionalAddressColumns} 
          onFieldChange={onChange} 
          maxHeight="max-h-48" 
        />
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
          
          {/* Left Column Fields */}
          <div className="space-y-1">
            <FormInput 
              label="Type *" 
              type="select"
              value={data.addressType || ""} 
              onChange={(e) => onChange(currentKey, 'addressType', e.target.value)}
              options={[]} // Add relevant address types here (e.g., Home, Work, Mailing)
            />
            <FormInput 
              label="Line 1 *" 
              value={data.line1 || ""} 
              onChange={(e) => onChange(currentKey, 'line1', e.target.value)} 
            />
            <FormInput 
              label="Line 2" 
              value={data.line2 || ""} 
              onChange={(e) => onChange(currentKey, 'line2', e.target.value)} 
            />
            <FormInput 
              label="Line 3" 
              value={data.line3 || ""} 
              onChange={(e) => onChange(currentKey, 'line3', e.target.value)} 
            />
          </div>

          {/* Right Column Fields */}
          <div className="space-y-1">
            <FormInput 
              label="City" 
              value={data.cityName || ""} 
              onChange={(e) => onChange(currentKey, 'cityName', e.target.value)} 
            />
            <FormInput 
              label="State/Province" 
              value={data.stateProv || ""} 
              onChange={(e) => onChange(currentKey, 'stateProv', e.target.value)} 
            />
            <FormInput 
              label="Postal Code" 
              value={data.postalCode || ""} 
              onChange={(e) => onChange(currentKey, 'postalCode', e.target.value)} 
            />
            <FormInput 
              label="Country" 
              value={data.countryCd || ""} 
              onChange={(e) => onChange(currentKey, 'countryCd', e.target.value)} 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdditionalAddressDetailsTab;