import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

const columns = [
  { id: "parameterId", key: "parameterId", label: "Parameter ID" },
  { id: "description", key: "description", label: "Description" },
  { id: "userOptions", key: "userOptions", label: "User Options" },
  { id: "startId", key: "startId", label: "Start ID" },
  { id: "endId", key: "endId", label: "End ID" },
  { id: "alternateFileLocation", key: "alternateFileLocation", label: "Alternate File Location" }
];

const ImportProjectMasterData = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    parameterId: "", 
    description: "",
    userOptions: "All",
    startId: "",
    endId: "",
    alternateFileLocation: "",
    deleteInputFile: false,
    printEditReports: true,
    reportType: "Full Reports"
  }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeRecord = records[currentIndex] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const handleNavigate = (dir) => {
    if (dir === 'next' && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
    if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    if (dir === 'start') setCurrentIndex(0);
    if (dir === 'end') setCurrentIndex(records.length - 1);
  };

  const handleAdd = () => {
    const newRecord = {
      id: `NEW_${Date.now()}`,
      parameterId: "",
      description: "",
      userOptions: "All",
      startId: "",
      endId: "",
      alternateFileLocation: "",
      deleteInputFile: false,
      printEditReports: true,
      reportType: "Full Reports",
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  return (
    <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
      <MainContainer icon={null} title="Identification">
        <Toolbar 
          isFormView={isFormView} 
          columns={columns}
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
            onClear: () => {}
          }} 
        />
        <div className="mt-2">
          {isFormView ? (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-gray-200 rounded-sm">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormInput label="Parameter ID *" value={activeRecord.parameterId || ""} onChange={(e) => handleFieldChange(activeRecord.id, "parameterId", e.target.value)} />
                    <FormInput label="Description *" value={activeRecord.description || ""} onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} />
                 </div>
              </div>

              <FormSection title="Selection Ranges">
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                       <div className="font-medium text-sm text-gray-700">User ID's *</div>
                       <FormSearchSelect 
                          label="Option" 
                          value={activeRecord.userOptions} 
                          options={[{userOptions: "All"}, {userOptions: "One"}, {userOptions: "Range"}]} 
                          displayKey="userOptions"
                          onChange={(e) => handleFieldChange(activeRecord.id, "userOptions", e.target.value)}
                       />
                       <FormInput label="Start" value={activeRecord.startId || ""} onChange={(e) => handleFieldChange(activeRecord.id, "startId", e.target.value)} />
                       <FormInput label="End" value={activeRecord.endId || ""} onChange={(e) => handleFieldChange(activeRecord.id, "endId", e.target.value)} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                       <FormInput label="Alternate File Location" value={activeRecord.alternateFileLocation || ""} onChange={(e) => handleFieldChange(activeRecord.id, "alternateFileLocation", e.target.value)} />
                       <div className="flex items-center space-x-2 mt-4 md:mt-0">
                          <input 
                             type="checkbox" 
                             className="form-checkbox h-4 w-4 text-blue-600 rounded-sm border-gray-300" 
                             checked={activeRecord.deleteInputFile || false}
                             onChange={(e) => handleFieldChange(activeRecord.id, "deleteInputFile", e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">Delete Input file upon successful Import</span>
                       </div>
                    </div>
                 </div>
              </FormSection>

              <FormSection title="Report Options">
                 <div className="flex items-center space-x-12">
                    <div className="flex items-center space-x-2">
                       <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded-sm border-gray-300" 
                          checked={activeRecord.printEditReports !== false}
                          onChange={(e) => handleFieldChange(activeRecord.id, "printEditReports", e.target.checked)}
                       />
                       <span className="text-sm text-gray-700">Print Edit Report(s)</span>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                       <label className="flex items-center space-x-2">
                          <input 
                             type="radio" 
                             className="form-radio h-4 w-4 text-blue-600 border-gray-300" 
                             name="reportType"
                             value="Full Reports"
                             checked={activeRecord.reportType === "Full Reports"}
                             onChange={(e) => handleFieldChange(activeRecord.id, "reportType", e.target.value)}
                          />
                          <span className="text-sm text-gray-700">Full Reports</span>
                       </label>
                       <label className="flex items-center space-x-2">
                          <input 
                             type="radio" 
                             className="form-radio h-4 w-4 text-blue-600 border-gray-300" 
                             name="reportType"
                             value="Abbreviated Reports"
                             checked={activeRecord.reportType === "Abbreviated Reports"}
                             onChange={(e) => handleFieldChange(activeRecord.id, "reportType", e.target.value)}
                          />
                          <span className="text-sm text-gray-700">Abbreviated Reports</span>
                       </label>
                    </div>
                 </div>
              </FormSection>
            </div>
          ) : (
            <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ImportProjectMasterData;
