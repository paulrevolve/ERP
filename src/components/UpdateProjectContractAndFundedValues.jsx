import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { RefreshCcw } from "lucide-react";

const mainColumns = [
  { id: "parameterId", key: "parameterId", label: "Parameter ID *" },
  { id: "description", key: "description", label: "Description *" },
  { id: "projectRange", key: "projectRange", label: "Project Range" },
  { id: "projectId", key: "projectId", label: "Project ID" }
];

const UpdateProjectContractAndFundedValues = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    {
      id: "1",
      parameterId: "UPDATE_VALUES_01",
      description: "Daily Update of Contract Values",
      projectRange: "All",
      projectId: ""
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
      projectId: "" 
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
      <MainContainer icon={RefreshCcw} title="Update Project Contract and Funded Values">
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
            <FormSection title="Identification">
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
                <p>This process updates contract and funding values at each Project level in the Project Master.</p>
                <p>This process may take a considerable amount of time if a large amount of data exists.</p>
              </div>

              <div className="mt-6 flex items-center gap-12">
                <div className="p-4 border border-gray-200 rounded relative min-w-[150px] bg-white">
                  <span className="absolute -top-2.5 left-2 bg-white px-2 text-[10px] text-blue-600 font-semibold">Project Range</span>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-xs">
                      <input 
                        type="radio" 
                        name="range" 
                        checked={activeRecord.projectRange === "All"} 
                        onChange={() => handleFieldChange("projectRange", "All")}
                      />
                      All
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input 
                        type="radio" 
                        name="range" 
                        checked={activeRecord.projectRange === "One"} 
                        onChange={() => handleFieldChange("projectRange", "One")}
                      />
                      One
                    </label>
                  </div>
                </div>

                <div className="flex-1 max-w-md">
                   <FormInput 
                     label="Project ID" 
                     value={activeRecord.projectId || ""} 
                     onChange={(e) => handleFieldChange("projectId", e.target.value)}
                     disabled={activeRecord.projectRange === "All"}
                   />
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

export default UpdateProjectContractAndFundedValues;
