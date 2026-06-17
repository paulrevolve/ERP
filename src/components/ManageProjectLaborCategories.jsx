import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput } from "../helper/formSection";

const plcColumns = [
  { id: "laborCategory", key: "laborCategory", label: "Labor Category *" },
  { id: "description", key: "description", label: "Description *" },
  { id: "defaultWorkersComp", key: "defaultWorkersComp", label: "Default Workers' Compensation" },
];

const billingRateColumns = [
  { id: "billingRate", key: "billingRate", label: "Billing Rate *" },
  { id: "discountPercentage", key: "discountPercentage", label: "Discount Percentage *" },
  { id: "startingDate", key: "startingDate", label: "Starting Date", type: "date" },
  { id: "endingDate", key: "endingDate", label: "Ending Date", type: "date" },
];

const ManageProjectLaborCategories = () => {
  const [showBillingRates, setShowBillingRates] = useState(false);
  const [isFormView, setIsFormView] = useState(false);
  
  const [plcRecords, setPlcRecords] = useState([{ id: "1", laborCategory: "LC001", description: "Engineer", defaultWorkersComp: "WC001" }]);
  const [billingRateRecords, setBillingRateRecords] = useState([{ id: "1", billingRate: "100", discountPercentage: "10", startingDate: "2023-01-01", endingDate: "2023-12-31" }]);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // For the purpose of Toolbar, we'll assume it controls PLC records unless some other logic is needed.
  // However, the user wants Toolbar consistency.
  const activeRecords = plcRecords;
  const activeColumns = plcColumns;
  const activeRecord = activeRecords[currentIndex] || {};

  const handleFieldChange = (id, field, value) => {
    setPlcRecords(plcRecords.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const handleBillingRateChange = (id, field, value) => {
    setBillingRateRecords(billingRateRecords.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const handleNavigate = (dir) => {
    if (dir === 'next' && currentIndex < activeRecords.length - 1) setCurrentIndex(currentIndex + 1);
    if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    if (dir === 'start') setCurrentIndex(0);
    if (dir === 'end') setCurrentIndex(activeRecords.length - 1);
  };

  const handleAdd = () => {
    const newRecord = { id: `NEW_${Date.now()}`, isDirty: true };
    setPlcRecords([newRecord, ...plcRecords]);
    setCurrentIndex(0);
  };

  const handleAddBillingRate = () => {
    const newRecord = { id: `NEW_BR_${Date.now()}`, isDirty: true };
    setBillingRateRecords([newRecord, ...billingRateRecords]);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer 
        icon={null} 
        title="Project Labor Categories (PLC)"
      >
        <Toolbar 
          isFormView={isFormView} 
          columns={activeColumns}
          currentIndex={currentIndex}
          totalRecords={activeRecords.length}
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
        
        <div className="mt-4 space-y-6">
          {/* PLC Table - ALWAYS VISIBLE */}
          <SecondaryContainer title="Labor Categories">
             {!isFormView ? (
                <ReusableTable data={plcRecords} columns={plcColumns} onFieldChange={handleFieldChange} />
             ) : (
                <FormSection title="PLC Details">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {plcColumns.map(col => (
                        <FormInput 
                          key={col.id}
                          label={col.label} 
                          value={activeRecord[col.key] || ""} 
                          onChange={(e) => handleFieldChange(activeRecord.id, col.key, e.target.value)}
                          type={col.type || "text"}
                        />
                      ))}
                   </div>
                </FormSection>
             )}
          </SecondaryContainer>

          {/* Tab Selection area (matches ManageEmployee styling) */}
          <div className="flex border-b border-gray-200 mt-4 bg-white">
            <button
              onClick={() => setShowBillingRates(!showBillingRates)}
              className={`px-6 py-2 text-[11px] font-bold uppercase transition-all border-b-2 ${
                showBillingRates 
                ? "border-[#17414d] text-[#17414d]" 
                : "border-transparent text-gray-500 hover:text-[#17414d]"
              }`}
            >
              Billing Rates
            </button>
          </div>

          {/* Conditional Billing Rates Section */}
          {showBillingRates && (
            <SecondaryContainer title="Billing Rates">
                <div className="mb-2 flex justify-end">
                    <button 
                        onClick={handleAddBillingRate}
                        className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all"
                    >
                        + Add Rate
                    </button>
                </div>
                <ReusableTable data={billingRateRecords} columns={billingRateColumns} onFieldChange={handleBillingRateChange} />
            </SecondaryContainer>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageProjectLaborCategories;
