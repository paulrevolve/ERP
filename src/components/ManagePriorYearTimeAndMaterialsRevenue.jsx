import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Clock } from "lucide-react";

const mainColumns = [
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
  { id: "project", key: "project", label: "Project *" }
];

const detailsColumns = [
  { id: "account", key: "account", label: "Account *" },
  { id: "accountName", key: "accountName", label: "Account Name" },
  { id: "organization", key: "organization", label: "Organization *" },
  { id: "plc", key: "plc", label: "PLC" },
  { id: "glc", key: "glc", label: "GLC *" },
  { id: "actualAmount", key: "actualAmount", label: "Actual Amount *", type: "number" },
  { id: "actualHours", key: "actualHours", label: "Actual Hours *", type: "number" },
  { id: "allowableHours", key: "allowableHours", label: "Allowable Hours *", type: "number" },
  { id: "billingRate", key: "billingRate", label: "Billing Rate *", type: "number" },
  { id: "billingRateBeforeDiscount", key: "billingRateBeforeDiscount", label: "Billing Rate Before Discount", type: "number" },
  { id: "rateType", key: "rateType", label: "Rate Type" }
];

const ManagePriorYearTimeAndMaterialsRevenue = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    {
      id: "1",
      fiscalYear: "2023",
      project: "PRJ-TM-01",
      projectName: "T&M Tracking Project",
      details: [
        { 
          id: "d1", 
          account: "400-01", 
          accountName: "T&M Revenue", 
          organization: "ORG-01", 
          plc: "PLC-A", 
          glc: "GLC-X", 
          actualAmount: 15000, 
          actualHours: 150, 
          allowableHours: 150, 
          billingRate: 100, 
          billingRateBeforeDiscount: 110, 
          rateType: "Standard" 
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
      <MainContainer icon={Clock} title="Prior Year Time and Materials Revenue">
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

          <SecondaryContainer title="Prior Year T&M Revenue Details">
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

export default ManagePriorYearTimeAndMaterialsRevenue;
