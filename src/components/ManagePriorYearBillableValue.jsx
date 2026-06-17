import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { DollarSign } from "lucide-react";

const mainColumns = [
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
  { id: "project", key: "project", label: "Project *" },
  { id: "totalBillingValue", key: "totalBillingValue", label: "Total Billing Value", type: "number" }
];

const detailsColumns = [
  { id: "account", key: "account", label: "Account *" },
  { id: "organization", key: "organization", label: "Organization *" },
  { id: "employee", key: "employee", label: "Employee" },
  { id: "vendor", key: "vendor", label: "Vendor" },
  { id: "vendorEmployee", key: "vendorEmployee", label: "Vendor Employee" },
  { id: "generalLaborCategory", key: "generalLaborCategory", label: "General Labor Category" },
  { id: "projectLaborCategory", key: "projectLaborCategory", label: "Project Labor Category" },
  { id: "billingValue", key: "billingValue", label: "Billing Value", type: "number" }
];

const ManagePriorYearBillableValue = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    {
      id: "1",
      fiscalYear: "2023",
      project: "PRJ-BV-01",
      projectName: "Billable Value Project",
      totalBillingValue: 25000,
      details: [
        { 
          id: "d1", 
          account: "400-02", 
          organization: "ORG-02", 
          employee: "John Doe", 
          vendor: "ABC Corp", 
          vendorEmployee: "Jane Smith", 
          generalLaborCategory: "Engineer", 
          projectLaborCategory: "L-ENG", 
          billingValue: 25000 
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
      totalBillingValue: 0,
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
      <MainContainer icon={DollarSign} title="Prior Year Billable Value">
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
                <FormInput 
                  label="Total Billing Value" 
                  value={activeRecord.totalBillingValue || 0} 
                  readOnly 
                />
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

          <SecondaryContainer title="Billable Value Details">
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

export default ManagePriorYearBillableValue;
