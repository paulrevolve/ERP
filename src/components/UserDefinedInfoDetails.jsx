import React, {useEffect} from "react";
import { FormSection, FormInput, ActionDetailButton } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { RefreshCw } from "lucide-react";

export const userDefinedColumns = [
  { value: "seqNo", label: "Sequence Number", key: "seqNo" },
  { value: "dataType", label: "Data Type", key: "dataType" },
  { value: "labels", label: "Labels *", key: "labels" },
  { value: "value", label: "Value", key: "value" },
  { value: "cpValidationField", label: "Costpoint Validation Field", key: "cpValidationField" },
  { value: "validatedText", label: "Validated Text", key: "validatedText" },
  { value: "requiredFl", label: "Required", key: "requiredFl", type: "flag" },
];

const UserDefinedInfoDetailsTab = ({ data, onChange, isFormView, setConfig }) => {
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = data.userDefinedRecords || [];

  useEffect(() => {
    if (setConfig) {
      setConfig({ 
        key: "userDefinedRecords", 
        cols: userDefinedColumns 
      });
    }
  }, [setConfig]);

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={userDefinedColumns} 
          onFieldChange={onChange} 
          maxHeight="max-h-48" 
        />
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
          
          {/* Column 1 */}
          <div className="space-y-1">
            <div className="flex">
              <FormInput 
                label="Sequence Number" 
                value={data.seqNo || ""} 
                onChange={(e) => onChange(currentKey, "seqNo", e.target.value)} 
              />
              <div className="w-16 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
            </div>
            <div className="flex">
              <FormInput 
                label="Data Type" 
                value={data.dataType || ""} 
                onChange={(e) => onChange(currentKey, "dataType", e.target.value)} 
              />
              <div className="w-10 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
            </div>
            <FormInput 
              label="Costpoint Validation Field" 
              value={data.cpValidationField || ""} 
              onChange={(e) => onChange(currentKey, "cpValidationField", e.target.value)} 
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-1">
            <div className="h-8"></div> {/* Spacer to align with Sequence Number */}
            <FormInput 
              label="Labels *" 
              value={data.labels || ""} 
              onChange={(e) => onChange(currentKey, "labels", e.target.value)} 
            />
            <div className="flex">
              <FormInput 
                label="Validated Text" 
                value={data.validatedText || ""} 
                onChange={(e) => onChange(currentKey, "validatedText", e.target.value)} 
              />
              <div className="w-12 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-1">
            <div className="h-8"></div> {/* Spacer to align with Sequence Number */}
            <FormInput 
              label="Value" 
              value={data.value || ""} 
              onChange={(e) => onChange(currentKey, "value", e.target.value)} 
            />
            <div className="flex items-center gap-4">
              <div className="flex">
                <FormInput 
                  label="Required" 
                  value={data.requiredFl || ""} 
                  onChange={(e) => onChange(currentKey, "requiredFl", e.target.value)} 
                />
                <div className="w-12 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
              </div>
              <button 
                className="px-4 py-1 text-[11px] font-bold text-[#17414d] border border-[#17414d] rounded-md hover:bg-[#17414d] hover:text-white transition-all cursor-pointer"
                onClick={() => console.log("Autoload clicked")}
              >
                Autoload
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDefinedInfoDetailsTab;