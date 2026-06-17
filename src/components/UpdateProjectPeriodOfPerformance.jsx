import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { CalendarRange } from "lucide-react";

const mainColumns = [
  { id: "parameterId", key: "parameterId", label: "Parameter ID *" },
  { id: "description", key: "description", label: "Description *" },
  { id: "projectRange", key: "projectRange", label: "Project Range *" },
  { id: "project", key: "project", label: "Project" }
];

const UpdateProjectPeriodOfPerformance = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    {
      id: "1",
      parameterId: "UPDATE_POP_01",
      description: "Quarterly POP Update",
      projectRange: "All",
      project: "",
      startBasis: "All modifications",
      endBasis: "Only mods with latest effective dates"
    }
  ]);

  const activeRecord = records[currentIndex] || {};

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    const newRecord = { 
      id: newId, 
      parameterId: "", 
      description: "", 
      projectRange: "All", 
      project: "",
      startBasis: "All modifications",
      endBasis: "Only mods with latest effective dates"
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
      <MainContainer icon={CalendarRange} title="Update Project Period of Performance">
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
            <FormSection title="Update Project Period of Performance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <FormInput 
                  label="Parameter ID *" 
                  value={activeRecord.parameterId || ""} 
                  onChange={(e) => handleFieldChange("parameterId", e.target.value)} 
                />
                <FormInput 
                  label="Description *" 
                  value={activeRecord.description || ""} 
                  onChange={(e) => handleFieldChange("description", e.target.value)} 
                />
              </div>

              <div className="mt-4 px-2 py-3 bg-gray-50 border-l-4 border-blue-500 text-[11px] text-gray-700 space-y-1">
                <p>This toolkit updates period of performance dates at each Project level in the Project Master.</p>
                <p>This process may take a considerable amount of time if a large amount of data exists.</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                   <div className="flex flex-col">
                      <label className="text-[11px] text-gray-600 mb-1">Project Range *</label>
                      <select 
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={activeRecord.projectRange || "All"}
                        onChange={(e) => handleFieldChange("projectRange", e.target.value)}
                      >
                        <option value="All">All</option>
                        <option value="One">One</option>
                        <option value="Range">Range</option>
                      </select>
                   </div>
                   <FormInput 
                     label="Project" 
                     value={activeRecord.project || ""} 
                     onChange={(e) => handleFieldChange("project", e.target.value)}
                     disabled={activeRecord.projectRange === "All"}
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                   <div className="flex flex-col">
                      <label className="text-[11px] text-gray-600 mb-1">Update POP Start Date based on earliest Start Date from *</label>
                      <select 
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={activeRecord.startBasis || "All modifications"}
                        onChange={(e) => handleFieldChange("startBasis", e.target.value)}
                      >
                        <option value="All modifications">All modifications</option>
                        <option value="Original modification only">Original modification only</option>
                      </select>
                   </div>
                   <div className="flex flex-col">
                      <label className="text-[11px] text-gray-600 mb-1">Update POP End Date based on latest End Date from *</label>
                      <select 
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={activeRecord.endBasis || "Only mods with latest effective dates"}
                        onChange={(e) => handleFieldChange("endBasis", e.target.value)}
                      >
                        <option value="Only mods with latest effective dates">Only mods with latest effective dates</option>
                        <option value="All modifications">All modifications</option>
                      </select>
                   </div>
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

export default UpdateProjectPeriodOfPerformance;
