import React from "react";
import { SecondaryContainer } from "../helper/container";
import { FormInput } from "../helper/formSection";

const ProjRevCalcValRevInfo = ({ data, onChange, handleClose }) => {
  const currentKey = data ? String(data.tempId || data.id || "") : "";
  const info = data?.revenueInfo || {};

  const handleFieldChange = (field, value) => {
    const updated = { ...info, [field]: value };
    onChange(currentKey, "revenueInfo", updated);
  };

  return (
    <SecondaryContainer title="Identification > Revenue Info" handleClose={handleClose}>
      <div className="p-4 bg-gray-50 border border-gray-100 rounded mt-2 space-y-4">
        
        <div className="flex items-center gap-4 w-full lg:w-2/3">
          <span className="text-[10px] font-bold text-gray-700 w-1/4">Revenue Formula</span>
          <div className="flex gap-2 flex-1">
            <input 
              type="text" 
              className="border border-gray-300 rounded px-2 py-1 outline-none text-[10px] bg-gray-100 w-1/3" 
              value={info.revenueFormulaCode || ""} 
              onChange={(e) => handleFieldChange("revenueFormulaCode", e.target.value)} 
            />
            <input 
              type="text" 
              className="border border-gray-300 rounded px-2 py-1 outline-none text-[10px] bg-gray-100 flex-1" 
              value={info.revenueFormulaDesc || ""} 
              onChange={(e) => handleFieldChange("revenueFormulaDesc", e.target.value)} 
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input 
            type="checkbox" 
            className="accent-[#17414d]" 
            checked={info.allowExceed === "Y"} 
            onChange={(e) => handleFieldChange("allowExceed", e.target.checked ? "Y" : "N")} 
          />
          <span className="text-[10px] text-gray-700">Allow Revenue to Exceed Value</span>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-1/3">
          <span className="text-[10px] text-gray-700">By How Much ?</span>
          <input 
            type="text" 
            className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]" 
            value={info.exceedAmount || ""} 
            onChange={(e) => handleFieldChange("exceedAmount", e.target.value)} 
          />
        </div>

        <div className="border border-gray-200 rounded p-2 relative mt-4 lg:w-1/2">
          <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Goal Multiplier</div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[10px] text-gray-700 w-1/3">Labor</span>
              <input 
                type="text" 
                className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]" 
                value={info.goalLabor || ""} 
                onChange={(e) => handleFieldChange("goalLabor", e.target.value)} 
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[10px] text-gray-700 w-1/3">Non-Labor</span>
              <input 
                type="text" 
                className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]" 
                value={info.goalNonLabor || ""} 
                onChange={(e) => handleFieldChange("goalNonLabor", e.target.value)} 
              />
            </div>
          </div>
        </div>

      </div>
    </SecondaryContainer>
  );
};

export default ProjRevCalcValRevInfo;
