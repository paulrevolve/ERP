import React, { useState } from "react";
import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
import { FormInput, FormSearchSelect } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { ListOrdered } from "lucide-react";

const mainColumns = [{ id: "project", key: "project", label: "Project *" }];

const detailsColumns = [
  { id: "sequence", key: "sequence", label: "Sequence *" },
  { id: "rateTable", key: "rateTable", label: "Rate Table *" },
  { id: "rateTableDescription", key: "rateTableDescription", label: "Rate Table Description" },
  { id: "sourceProject", key: "sourceProject", label: "Source Project" }
];

const ManageRateSequenceOrders = () => {
  const [isMainFormView, setIsMainFormView] = useState(true);
  const [isSecondaryFormView, setIsSecondaryFormView] = useState(false);

  const [projects, setProjects] = useState([{ id: "P01", project: "", isDirty: false }]);
  const [details, setDetails] = useState([]);
  
  const handleAddDetail = () => {
    setDetails([{ id: `NEW_${Date.now()}`, sequence: "", rateTable: "", rateTableDescription: "", sourceProject: "", isDirty: true }, ...details]);
  };

  const handleDetailChange = (id, field, value) => {
    setDetails(details.map(d => d.id === id ? { ...d, [field]: value, isDirty: true } : d));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={ListOrdered} title="Manage Rate Sequence Orders">
        <Toolbar 
          isFormView={isMainFormView} 
          columns={mainColumns}
          actions={{ 
            onToggleView: () => setIsMainFormView(!isMainFormView),
            onAdd: () => {},
            onSave: () => {},
            onDelete: () => {}
          }} 
        />
        <div className="mt-2">
           {isMainFormView ? (
               <div className="w-full md:w-1/2 p-4">
                 <FormSearchSelect 
                   label="Project *" 
                   value={projects[0].project}
                   options={[]}
                   displayKey="project"
                   onChange={(val) => setProjects([{...projects[0], project: val, isDirty: true}])}
                 />
               </div>
           ) : (
               <ReusableTable data={projects} columns={mainColumns} />
           )}
        </div>
      </MainContainer>
      
      <SecondaryContainer title="Rate Sequence Details">
        <Toolbar 
          isFormView={isSecondaryFormView} 
          columns={detailsColumns}
          actions={{ 
            onToggleView: () => setIsSecondaryFormView(!isSecondaryFormView),
            onAdd: handleAddDetail,
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {}
          }} 
        />
        <div className="mt-2">
           {isSecondaryFormView ? (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-gray-100 rounded-lg">
                 <FormInput label="Sequence *" value={details[0]?.sequence || ""} onChange={(e) => details[0] && handleDetailChange(details[0].id, "sequence", e.target.value)} />
                 <FormInput label="Rate Table *" value={details[0]?.rateTable || ""} onChange={(e) => details[0] && handleDetailChange(details[0].id, "rateTable", e.target.value)} />
                 <FormInput label="Rate Table Description" value={details[0]?.rateTableDescription || ""} onChange={(e) => details[0] && handleDetailChange(details[0].id, "rateTableDescription", e.target.value)} />
                 <FormInput label="Source Project" value={details[0]?.sourceProject || ""} onChange={(e) => details[0] && handleDetailChange(details[0].id, "sourceProject", e.target.value)} />
              </div>
           ) : (
              <ReusableTable data={details} columns={detailsColumns} onFieldChange={handleDetailChange} />
           )}
        </div>
      </SecondaryContainer>
    </div>
  );
};

export default ManageRateSequenceOrders;
