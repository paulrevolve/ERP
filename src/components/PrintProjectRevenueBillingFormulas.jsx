import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Printer } from "lucide-react";

const columns = [
  { id: "parameterId", key: "parameterId", label: "Parameter ID *" },
  { id: "description", key: "description", label: "Description *" }
];

const PrintProjectRevenueBillingFormulas = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAdd = () => {
    setRecords([{ id: `NEW_${Date.now()}`, parameterId: "", description: "", optionVal: "all", startVal: "", endVal: "", isDirty: true }, ...records]);
    setCurrentIndex(0);
  };

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const activeRecord = records[currentIndex] || {};

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Printer} title="Print Project Revenue and Billing Formulas">
        <Toolbar 
          isFormView={isFormView} 
          columns={columns}
          totalRecords={records.length}
          currentIndex={currentIndex}
          handleNavigate={(dir) => {
            if (dir === 'next') setCurrentIndex(i => Math.min(i + 1, records.length - 1));
            if (dir === 'prev') setCurrentIndex(i => Math.max(i - 1, 0));
          }}
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
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormInput label="Parameter ID *" value={activeRecord.parameterId || ""} onChange={(e) => activeRecord.id && handleFieldChange(activeRecord.id, "parameterId", e.target.value)} />
                   <FormInput label="Description *" value={activeRecord.description || ""} onChange={(e) => activeRecord.id && handleFieldChange(activeRecord.id, "description", e.target.value)} />
                </div>
                <FormSection title="Selection Ranges">
                   <div className="grid grid-cols-4 gap-4 items-end mb-2 text-xs font-bold text-[#17414d]">
                      <div></div>
                      <div>Option</div>
                      <div>Start</div>
                      <div>End</div>
                   </div>
                   <div className="grid grid-cols-4 gap-4 items-center">
                      <FormInput type="select" options={[{label: "Project", value: "project"}]} disabled />
                      <FormInput type="select" value={activeRecord.optionVal || "all"} onChange={(e) => activeRecord.id && handleFieldChange(activeRecord.id, "optionVal", e.target.value)} options={[{label: "All", value: "all"}, {label: "Range", value: "range"}]} />
                      <FormInput value={activeRecord.startVal || ""} onChange={(e) => activeRecord.id && handleFieldChange(activeRecord.id, "startVal", e.target.value)} />
                      <FormInput value={activeRecord.endVal || ""} onChange={(e) => activeRecord.id && handleFieldChange(activeRecord.id, "endVal", e.target.value)} />
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

export default PrintProjectRevenueBillingFormulas;
