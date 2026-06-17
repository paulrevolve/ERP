import React, { useEffect } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

// Column definitions for the Table View
export const citizenshipColumns = [
  { value: "countryCd", label: "Country *", key: "countryCd" },
  { value: "citizenStatus", label: "Citizen Status *", key: "citizenStatus" },
  { value: "natoFl", label: "NATO", key: "natoFl", type: "flag" },
  { value: "euFl", label: "EU", key: "euFl", type: "flag" },
  { value: "nin", label: "National Identification Number (NIN)", key: "nin" },
  { value: "effDate", label: "Effective Date", key: "effDate", type: "date" },
  { value: "endDate", label: "End Date", key: "endDate", type: "date" },
  { value: "passportNo", label: "Passport Number", key: "passportNo" },
  { value: "passportIssueDt", label: "Passport Issue Date", key: "passportIssueDt", type: "date" },
  { value: "passportExpDt", label: "Passport Expiration Date", key: "passportExpDt", type: "date" },
];

const CitizenshipDetailsTab = ({ data, onChange, isFormView, setConfig }) => {

  useEffect(() => {
    if (setConfig) {
      setConfig({ key: "citizenshipRecords", cols: citizenshipColumns });
    }
  }, [setConfig]);

  
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = data.citizenshipRecords || [];

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={citizenshipColumns} 
          onFieldChange={onChange} 
          maxHeight="max-h-48" 
        />
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-2">
        
        {/* Country and Status Row */}
        <div className="flex flex-wrap items-start gap-x-8">
          <div className="space-y-1">
            <div className="flex gap-2">
              <FormInput 
                label="Country *" 
                value={data.countryCd || ""} 
                onChange={(e) => onChange(currentKey, 'countryCd', e.target.value)} 
              />
              <div className="w-48 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
            </div>
            <div className="flex gap-2">
              <FormInput 
                label="Citizen Status *" 
                value={data.citizenStatus || ""} 
                onChange={(e) => onChange(currentKey, 'citizenStatus', e.target.value)} 
              />
              <div className="w-48 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
            </div>
          </div>

          {/* NATO/EU Flags */}
          <div className="flex gap-6 pt-2">
            <FormInput 
              label="NATO" 
              type="checkbox" 
              checked={data.natoFl === "Y" || data.natoFl === true} 
              onChange={(e) => onChange(currentKey, 'natoFl', e.target.checked)} 
            />
            <FormInput 
              label="EU" 
              type="checkbox" 
              checked={data.euFl === "Y" || data.euFl === true} 
              onChange={(e) => onChange(currentKey, 'euFl', e.target.checked)} 
            />
          </div>
        </div>

        {/* Identification Numbers and Dates */}
        <div className="max-w-2xl space-y-1">
          <FormInput 
            label="National Identification Number (NIN)" 
            value={data.nin || ""} 
            onChange={(e) => onChange(currentKey, 'nin', e.target.value)} 
          />
          <FormInput 
            label="Effective Date" 
            type="date" 
            value={data.effDate || ""} 
            onChange={(e) => onChange(currentKey, 'effDate', e.target.value)} 
          />
          <FormInput 
            label="End Date" 
            type="date" 
            value={data.endDate || ""} 
            onChange={(e) => onChange(currentKey, 'endDate', e.target.value)} 
          />
          <FormInput 
            label="Passport Number" 
            value={data.passportNo || ""} 
            onChange={(e) => onChange(currentKey, 'passportNo', e.target.value)} 
          />
          <FormInput 
            label="Passport Issue Date" 
            type="date" 
            value={data.passportIssueDt || ""} 
            onChange={(e) => onChange(currentKey, 'passportIssueDt', e.target.value)} 
          />
          <FormInput 
            label="Passport Expiration Date" 
            type="date" 
            value={data.passportExpDt || ""} 
            onChange={(e) => onChange(currentKey, 'passportExpDt', e.target.value)} 
          />
        </div>

        {/* Notes Section */}
        <div className="flex items-start gap-2 m-1">
          <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">Notes</label>
          <textarea
            className="flex-1 border border-gray-300 outline-none p-2 rounded text-[10px] h-24 focus:border-[#17414d] bg-white transition-all"
            value={data.citizenshipNotes || ""}
            onChange={(e) => onChange(currentKey, 'citizenshipNotes', e.target.value)}
          />
        </div>

      </div>
    </div>
  );
};

export default CitizenshipDetailsTab;