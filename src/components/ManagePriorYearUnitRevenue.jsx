import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Package } from "lucide-react";

const mainColumns = [
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
  { id: "project", key: "project", label: "Project *" }
];

const detailsColumns = [
  { id: "clin", key: "clin", label: "CLIN" },
  { id: "priceCatalog", key: "priceCatalog", label: "Price Catalog" },
  { id: "item", key: "item", label: "Item *" },
  { id: "itemRevision", key: "itemRevision", label: "Item Revision" },
  { id: "actualUnitsQty", key: "actualUnitsQty", label: "Actual Units Qty *", type: "number" },
  { id: "allowableUnitsQty", key: "allowableUnitsQty", label: "Allowable Units Qty", type: "number" }
];

const ManagePriorYearUnitRevenue = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    {
      id: "1",
      fiscalYear: "2023",
      project: "PRJ-UNIT-01",
      projectName: "Unit Revenue Project",
      details: [
        { 
          id: "d1", 
          clin: "001", 
          priceCatalog: "CAT-A", 
          item: "ITEM-X", 
          itemRevision: "Rev 1", 
          actualUnitsQty: 100, 
          allowableUnitsQty: 100 
        }
      ]
    }
  ]);

  const activeRecord = records[currentIndex] || {};

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    const newRecord = { 
      id: newId, 
      fiscalYear: "", 
      project: "", 
      projectName: "",
      details: [] 
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
      <MainContainer icon={Package} title="Prior Year Unit Revenue">
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
                  label="Fiscal Year *" 
                  value={activeRecord.fiscalYear || ""} 
                  onChange={(e) => handleFieldChange("fiscalYear", e.target.value)} 
                />
                <div className="flex gap-2 col-span-1 md:col-span-2">
                  <FormInput 
                    label="Project *" 
                    value={activeRecord.project || ""} 
                    onChange={(e) => handleFieldChange("project", e.target.value)} 
                  />
                  <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
                    {activeRecord.projectName}
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

          <SecondaryContainer title="Prior Year Unit Revenue Details">
            <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
            <ReusableTable 
              data={activeRecord.details || []} 
              columns={detailsColumns} 
              onFieldChange={() => {}} 
            />
          </SecondaryContainer>
        </div>
      </MainContainer>
    </div>
  );
};

export default ManagePriorYearUnitRevenue;
