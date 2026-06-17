import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { ToggleLeft } from "lucide-react";

const mainColumns = [
  { id: "option", key: "option", label: "Option" },
  { id: "start", key: "start", label: "Start" },
  { id: "end", key: "end", label: "End" },
  { id: "status", key: "status", label: "Project Status" }
];

const ActiveInactiveProjects = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    {
      id: "1",
      option: "One",
      start: "PRJ001",
      end: "",
      status: "Inactive"
    }
  ]);

  const activeRecord = records[currentIndex] || {};

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    const newRecord = { 
      id: newId, 
      option: "One", 
      start: "", 
      end: "", 
      status: "Active" 
    };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  const handleFieldChange = (field, value) => {
    setRecords(records.map((r, idx) => idx === currentIndex ? { ...r, [field]: value } : r));
  };

  const handleNavigate = (dir) => {
    if (dir === "next" && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
    if (dir === "prev" && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    if (dir === "start") setCurrentIndex(0);
    if (dir === "end") setCurrentIndex(records.length - 1);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={ToggleLeft} title="Active/Inactive Projects">
        <Toolbar 
          isFormView={isFormView}
          currentIndex={currentIndex}
          totalRecords={records.length}
          handleNavigate={handleNavigate}
          actions={{
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: handleAdd,
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {},
            onQuery: () => {}
          }}
        />

        <div className="mt-2 space-y-4">
          {isFormView ? (
            <FormSection title="Selection Ranges">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                <div className="flex flex-col">
                  <label className="text-[11px] text-gray-600 mb-1 text-center">Option</label>
                  <select 
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-500 text-white"
                    value={activeRecord.option || "One"}
                    onChange={(e) => handleFieldChange("option", e.target.value)}
                  >
                    <option value="One">One</option>
                    <option value="Range">Range</option>
                    <option value="All">All</option>
                  </select>
                </div>
                <FormInput 
                  label="Start" 
                  value={activeRecord.start || ""} 
                  onChange={(e) => handleFieldChange("start", e.target.value)} 
                />
                <FormInput 
                  label="End" 
                  value={activeRecord.end || ""} 
                  onChange={(e) => handleFieldChange("end", e.target.value)} 
                />
              </div>

              <div className="mt-6 p-4 border border-gray-200 rounded relative">
                <span className="absolute -top-2.5 left-2 bg-white px-2 text-[10px] text-blue-600 font-semibold">Options</span>
                <div className="flex items-center gap-8">
                   <div className="flex flex-col gap-2 p-2 border border-gray-100 rounded bg-gray-50/50">
                     <span className="text-[10px] text-blue-600 font-semibold">Project Status</span>
                     <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs">
                          <input 
                            type="radio" 
                            name="status" 
                            checked={activeRecord.status === "Active"} 
                            onChange={() => handleFieldChange("status", "Active")}
                          />
                          Active
                        </label>
                        <label className="flex items-center gap-2 text-xs">
                          <input 
                            type="radio" 
                            name="status" 
                            checked={activeRecord.status === "Inactive"} 
                            onChange={() => handleFieldChange("status", "Inactive")}
                          />
                          Inactive
                        </label>
                     </div>
                   </div>
                   <button className="px-6 py-1.5 bg-[#2d4a77] text-white text-xs rounded shadow-sm hover:bg-[#1e3250] transition-colors self-end mb-2">
                     Update
                   </button>
                </div>
              </div>
            </FormSection>
          ) : (
            <SecondaryContainer title="">
              <ReusableTable 
                data={records} 
                columns={mainColumns} 
                onFieldChange={() => {}} 
              />
            </SecondaryContainer>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ActiveInactiveProjects;
