import React, { useState } from "react";
import { MainContainer, Toolbar, ActionButton } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";
import { Plus, Copy, Trash2, Search, CheckSquare } from "lucide-react";

const columns = [
  { id: "modificationsEffectiveDate", key: "modificationsEffectiveDate", label: "Modifications Effective Date" },
  { id: "updatePopStartDate", key: "updatePopStartDate", label: "Update POP Start Date" },
  { id: "updatePopEndDate", key: "updatePopEndDate", label: "Update POP End Date" },
];

const ConfigureProjectSettings = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [activeTab, setActiveTab] = useState("Projects");
  const [activeNestedTabs, setActiveNestedTabs] = useState({});
  
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    requireIncurredCost: false,
    validateProjectCharging: false,
    showPeriodOfPerformance: true,
    trackOwningOrganization: true,
    useGoalMultipliers: false,
    modificationsEffectiveDate: "Default System Date",
    validateModificationDescriptions: false,
    updatePopStartDate: "All Modifications",
    updatePopEndDate: "Only mods with latest effective dates",
    owningOrganization: "",
    accountGroup: "",
    useQuickProjectTemplates: false,
    // Revenue Tab
    defaultRevenuePostingBy: "Owning Organization",
    allowRevenueToExceed: "Contract Value",
    calculateUnitPricingBasedOn: "Total",
    calculatePoCommitments: "Real Time",
    tmRateSequenceSearch: "First Row",
    restrictRevenue: true,
    allowUsePreviouslyStored: false,
    trackRevenueSetup: true,
    itdcpfcOtherFee: false,
    allowRevenuePosting: false,
    allowAdjustmentPeriodRev: false,
    updatePriorYearHistory: "Cost Only, No Revenue",
    allowDefaultChanged: false,
    // Pools Tab
    lastCreatePoolLinksRunDate: "",
    capitalizeGaAppliedToWip: false,
    presentWipGaOnPsr: false,
    applyGaToWip: false,
    wipGaPoolType: "",
    allowProjectsInactive: false,
    // Budgeting Tab
    budgetingMethod: "Advanced Budgeting",
    // Corporate Settings Tab
    applyBurdeningBasedOn: "Year to Date Rates",
    topLevelLength: "4"
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
      requireIncurredCost: false,
      validateProjectCharging: false,
      showPeriodOfPerformance: true,
      trackOwningOrganization: true,
      useGoalMultipliers: false,
      modificationsEffectiveDate: "Default System Date",
      validateModificationDescriptions: false,
      updatePopStartDate: "All Modifications",
      updatePopEndDate: "Only mods with latest effective dates",
      owningOrganization: "",
      accountGroup: "",
      useQuickProjectTemplates: false,
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  const tabs = ["Projects", "Project Segment Lengths", "Revenue", "Pools", "Budgeting"];

  // Mock data for Project Segment Lengths
  const [segmentLengths, setSegmentLengths] = useState([
    { id: "1", level: 1, length: 1, levelName: "Company" }
  ]);

  // Mock data for Revenue Formulas
  const [revenueFormulas, setRevenueFormulas] = useState([
    { id: "1", selected: true, description: "Cost Incurred using Estimate At Completion (Funded Value)" },
    { id: "2", selected: false, description: "Contract Value Less Backlog" },
    { id: "3", selected: false, description: "Contract Value Times % Complete Vs. Rate Schedule" }
  ]);

  return (
    <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
      <MainContainer icon={null} title="Project Settings">
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
            <div className="bg-white border border-gray-200">
              {/* Tabs header */}
              <div className="flex border-b border-gray-200 overflow-x-auto bg-white">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-[10px] font-bold whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? "border-b-2 border-[#17414d] text-[#17414d]"
                        : "text-gray-500 hover:text-[#17414d]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="bg-white rounded-b-lg">
                {activeTab === "Projects" && (
                  <div className="p-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.requireIncurredCost || false} onChange={(e) => handleFieldChange(activeRecord.id, "requireIncurredCost", e.target.checked)} />
                          <span className="text-[11px] font-bold text-gray-700">Require Incurred Cost Submission Code for all Projects</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.validateProjectCharging || false} onChange={(e) => handleFieldChange(activeRecord.id, "validateProjectCharging", e.target.checked)} />
                          <span className="text-[11px] font-bold text-gray-700">Validate Project Charging by Organizations</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.showPeriodOfPerformance !== false} onChange={(e) => handleFieldChange(activeRecord.id, "showPeriodOfPerformance", e.target.checked)} />
                          <span className="text-[11px] font-bold text-gray-700">Show Period of Performance Warning Message</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.trackOwningOrganization !== false} onChange={(e) => handleFieldChange(activeRecord.id, "trackOwningOrganization", e.target.checked)} />
                          <span className="text-[11px] font-bold text-gray-700">Track Owning Organization History</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.useGoalMultipliers || false} onChange={(e) => handleFieldChange(activeRecord.id, "useGoalMultipliers", e.target.checked)} />
                          <span className="text-[11px] font-bold text-gray-700">Use Goal Multipliers for Billable Value Calculations</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 p-2 border border-gray-200">
                      <FormSearchSelect 
                          label="Modifications Effective Date *" 
                          value={activeRecord.modificationsEffectiveDate} 
                          options={[{modificationsEffectiveDate: "Default System Date"}, {modificationsEffectiveDate: "Other Options"}]} 
                          displayKey="modificationsEffectiveDate"
                          onChange={(e) => handleFieldChange(activeRecord.id, "modificationsEffectiveDate", e.target.value)}
                      />
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.validateModificationDescriptions || false} onChange={(e) => handleFieldChange(activeRecord.id, "validateModificationDescriptions", e.target.checked)} />
                        <span className="text-[11px] font-bold text-gray-700">Validate Modification Descriptions</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                      <FormSection title="Period of Performance Start and End Dates">
                        <div className="space-y-4">
                          <FormSearchSelect 
                              label="Update POP Start Date based on earliest Start Date From *" 
                              value={activeRecord.updatePopStartDate} 
                              options={[{updatePopStartDate: "All Modifications"}, {updatePopStartDate: "Some Modifications"}]} 
                              displayKey="updatePopStartDate"
                              onChange={(e) => handleFieldChange(activeRecord.id, "updatePopStartDate", e.target.value)}
                          />
                          <FormSearchSelect 
                              label="Update POP End Date based on latest End Date From *" 
                              value={activeRecord.updatePopEndDate} 
                              options={[{updatePopEndDate: "Only mods with latest effective dates"}, {updatePopEndDate: "Other Options"}]} 
                              displayKey="updatePopEndDate"
                              onChange={(e) => handleFieldChange(activeRecord.id, "updatePopEndDate", e.target.value)}
                          />
                        </div>
                      </FormSection>
                      
                      <FormSection title="Quick Project Defaults">
                        <div className="space-y-4">
                          <FormInput label="Owning Organization" value={activeRecord.owningOrganization || ""} onChange={(e) => handleFieldChange(activeRecord.id, "owningOrganization", e.target.value)} />
                          <FormInput label="Account Group" value={activeRecord.accountGroup || ""} onChange={(e) => handleFieldChange(activeRecord.id, "accountGroup", e.target.value)} />
                          <label className="flex items-center space-x-2 mt-2">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.useQuickProjectTemplates || false} onChange={(e) => handleFieldChange(activeRecord.id, "useQuickProjectTemplates", e.target.checked)} />
                            <span className="text-[11px] font-bold text-gray-700">Use Quick Project Templates</span>
                          </label>
                        </div>
                      </FormSection>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 px-1 pb-2">
                      {["Revenue Formulas", "Corporate Settings"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            setActiveNestedTabs(prev => ({ ...prev, [tab]: !prev[tab] }));
                          }}
                          className={`px-3 py-1 rounded text-[10px] font-bold transition-colors whitespace-nowrap border cursor-pointer ${
                            activeNestedTabs[tab]
                              ? "bg-[#17414d] text-white border-[#17414d] shadow-md cursor-pointer"
                              : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe] cursor-pointer"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {activeNestedTabs["Revenue Formulas"] && (
                       <div className="p-4 border border-[#17414d]/40 rounded mt-2 bg-gray-50 flex space-x-4">
                         <div className="w-1/2 border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
                           <div className="bg-white border-b border-gray-200 text-gray-600 text-[11px] font-bold px-3 py-2 flex justify-between items-center">
                             <span>Project Settings &gt; Revenue Formulas</span>
                             <div className="flex space-x-1">
                               <ActionButton icon={Search} onClick={() => {}} title="Query" />
                               <ActionButton icon={CheckSquare} onClick={() => {}} title="Select" />
                             </div>
                           </div>
                           <table className="w-full text-xs text-left">
                             <thead>
                               <tr className="bg-gray-100 border-b">
                                 <th className="w-6 p-1 text-center border-r"><input type="checkbox" className="accent-[#17414d]" /></th>
                                 <th className="p-2 font-bold text-gray-700">Description</th>
                               </tr>
                             </thead>
                             <tbody>
                               {revenueFormulas.filter(f => f.selected).map((f) => (
                                 <tr key={`l-${f.id}`} className="border-b hover:bg-gray-50 text-gray-600">
                                   <td className="w-6 p-1 text-center border-r"><input type="checkbox" className="accent-[#17414d]" /></td>
                                   <td className="p-2">{f.description}</td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                         <div className="w-1/2 border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
                           <div className="bg-white border-b border-gray-200 text-gray-600 text-[11px] font-bold px-3 py-2 flex justify-between items-center">
                             <span>Selected Revenue Formulas</span>
                             <ActionButton icon={Trash2} onClick={() => {}} title="Delete" />
                           </div>
                           <table className="w-full text-xs text-left">
                             <thead>
                               <tr className="bg-gray-100 border-b">
                                 <th className="w-6 p-1 text-center border-r"><input type="checkbox" className="accent-[#17414d]" /></th>
                                 <th className="p-2 font-bold text-gray-700">Description</th>
                               </tr>
                             </thead>
                             <tbody>
                               {revenueFormulas.filter(f => !f.selected).map((f) => (
                                 <tr key={`r-${f.id}`} className="border-b hover:bg-gray-50 text-gray-600">
                                   <td className="w-6 p-1 text-center border-r"><input type="checkbox" className="accent-[#17414d]" /></td>
                                   <td className="p-2">{f.description}</td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                       </div>
                    )}
                    
                    {activeNestedTabs["Corporate Settings"] && (
                      <div className="p-4 border border-[#17414d]/40 rounded mt-2 bg-gray-50 max-w-2xl">
                         <div className="border border-gray-200 bg-white rounded shadow-sm overflow-hidden">
                           <div className="bg-white border-b border-gray-200 text-gray-600 text-[11px] font-bold px-3 py-2 flex justify-between items-center">
                             <span>Project Settings &gt; Corporate Settings</span>
                           </div>
                           <div className="p-4 flex flex-col space-y-4">
                             <div className="flex items-center space-x-4">
                               <span className="text-[11px] font-bold text-gray-700 w-1/3">Apply Burdening based on *</span>
                               <div className="w-2/3">
                                 <FormSearchSelect 
                                    value={activeRecord.applyBurdeningBasedOn} 
                                    options={[{applyBurdeningBasedOn: "Year to Date Rates"}]} 
                                    displayKey="applyBurdeningBasedOn"
                                    onChange={(e) => handleFieldChange(activeRecord.id, "applyBurdeningBasedOn", e.target.value)}
                                 />
                               </div>
                             </div>
                             <div className="flex items-center space-x-4">
                               <span className="text-[11px] font-bold text-gray-700 w-1/3">Top Level Length of the Project *</span>
                               <input type="number" className="w-24 border border-gray-300 p-1 text-[11px] rounded" value={activeRecord.topLevelLength || ""} onChange={(e) => handleFieldChange(activeRecord.id, "topLevelLength", e.target.value)} />
                             </div>
                           </div>
                         </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "Project Segment Lengths" && (
                  <div className="p-2 space-y-4 min-h-[400px]">
                     <div className="flex bg-[#f8f9fa] p-1 items-center justify-end border border-gray-200 rounded">
                        <div className="flex space-x-1">
                          <ActionButton icon={Plus} onClick={() => {}} title="New" />
                          <ActionButton icon={Copy} onClick={() => {}} title="Copy" disabled />
                          <ActionButton icon={Trash2} onClick={() => {}} title="Delete" disabled />
                        </div>
                     </div>
                     <table className="w-[500px] text-[11px] text-left border border-gray-300">
                       <thead>
                         <tr className="bg-gray-50 border-b border-gray-300">
                           <th className="w-6 p-1 border-r border-gray-300 text-center"><input type="checkbox" className="accent-[#17414d]" /></th>
                           <th className="p-2 font-bold text-gray-700 border-r border-gray-300">Level</th>
                           <th className="p-2 font-bold text-gray-700 border-r border-gray-300">Length *</th>
                           <th className="p-2 font-bold text-gray-700">Level Name *</th>
                         </tr>
                       </thead>
                       <tbody>
                         {segmentLengths.map(sl => (
                           <tr key={sl.id} className="border-b border-gray-200">
                             <td className="w-6 p-1 border-r border-gray-300 text-center"><input type="checkbox" className="accent-[#17414d]" /></td>
                             <td className="p-2 border-r border-gray-300">{sl.level}</td>
                             <td className="p-2 border-r border-gray-300"><input type="text" className="w-full border border-gray-300 p-1 text-[11px]" value={sl.length} readOnly /></td>
                             <td className="p-2"><input type="text" className="w-full border border-gray-300 p-1 text-[11px]" value={sl.levelName} readOnly /></td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                  </div>
                )}

                {activeTab === "Revenue" && (
                  <div className="p-4 space-y-6 min-h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-4">
                         <FormSearchSelect 
                              label="Default Revenue Posting By *" 
                              value={activeRecord.defaultRevenuePostingBy} 
                              options={[{defaultRevenuePostingBy: "Owning Organization"}]} 
                              displayKey="defaultRevenuePostingBy"
                              onChange={(e) => handleFieldChange(activeRecord.id, "defaultRevenuePostingBy", e.target.value)}
                          />
                          <FormSearchSelect 
                              label="Calculate Unit Pricing Based on *" 
                              value={activeRecord.calculateUnitPricingBasedOn} 
                              options={[{calculateUnitPricingBasedOn: "Total"}]} 
                              displayKey="calculateUnitPricingBasedOn"
                              onChange={(e) => handleFieldChange(activeRecord.id, "calculateUnitPricingBasedOn", e.target.value)}
                          />
                          <FormSearchSelect 
                              label="T&M Rate Sequence Search for PLC Source Project *" 
                              value={activeRecord.tmRateSequenceSearch} 
                              options={[{tmRateSequenceSearch: "First Row"}]} 
                              displayKey="tmRateSequenceSearch"
                              onChange={(e) => handleFieldChange(activeRecord.id, "tmRateSequenceSearch", e.target.value)}
                          />
                       </div>
                       <div className="space-y-4">
                          <FormSearchSelect 
                              label="Allow Revenue to Exceed *" 
                              value={activeRecord.allowRevenueToExceed} 
                              options={[{allowRevenueToExceed: "Contract Value"}]} 
                              displayKey="allowRevenueToExceed"
                              onChange={(e) => handleFieldChange(activeRecord.id, "allowRevenueToExceed", e.target.value)}
                          />
                          <FormSearchSelect 
                              label="Calculate PO Commitments *" 
                              value={activeRecord.calculatePoCommitments} 
                              options={[{calculatePoCommitments: "Real Time"}]} 
                              displayKey="calculatePoCommitments"
                              onChange={(e) => handleFieldChange(activeRecord.id, "calculatePoCommitments", e.target.value)}
                          />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.restrictRevenue || false} onChange={(e) => handleFieldChange(activeRecord.id, "restrictRevenue", e.target.checked)} />
                            <span className="text-[11px] font-bold text-gray-700">Restrict Revenue for Closed and N/A Periods</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.trackRevenueSetup || false} onChange={(e) => handleFieldChange(activeRecord.id, "trackRevenueSetup", e.target.checked)} />
                            <span className="text-[11px] font-bold text-gray-700">Track Revenue Setup Information on Compute Revenue</span>
                          </label>
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.allowUsePreviouslyStored || false} onChange={(e) => handleFieldChange(activeRecord.id, "allowUsePreviouslyStored", e.target.checked)} />
                            <span className="text-[11px] font-bold text-gray-700">Allow Use of Previously-Stored Revenue Calculation Values for Compute Revenue</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.itdcpfcOtherFee || false} onChange={(e) => handleFieldChange(activeRecord.id, "itdcpfcOtherFee", e.target.checked)} />
                            <span className="text-[11px] font-bold text-gray-700">ITDCPFC - Other Fee on Revenue Level</span>
                          </label>
                        </div>
                    </div>
                    
                    <FormSection title="Adjustment Periods">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.allowRevenuePosting || false} onChange={(e) => handleFieldChange(activeRecord.id, "allowRevenuePosting", e.target.checked)} />
                            <span className="text-[11px] font-bold text-gray-700">Allow Revenue Posting in Adjustment Periods</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.allowAdjustmentPeriodRev || false} onChange={(e) => handleFieldChange(activeRecord.id, "allowAdjustmentPeriodRev", e.target.checked)} />
                            <span className="text-[11px] font-bold text-gray-700">Allow Adjustment Period Revenue Computation & Posting in Subsequent Fiscal Years</span>
                          </label>
                        </div>
                        <div className="space-y-4 bg-gray-50 p-2 border border-gray-200">
                           <FormSearchSelect 
                                label="Update Prior Year History Defaults for Adjustment Periods *" 
                                value={activeRecord.updatePriorYearHistory} 
                                options={[{updatePriorYearHistory: "Cost Only, No Revenue"}]} 
                                displayKey="updatePriorYearHistory"
                                onChange={(e) => handleFieldChange(activeRecord.id, "updatePriorYearHistory", e.target.value)}
                            />
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.allowDefaultChanged || false} onChange={(e) => handleFieldChange(activeRecord.id, "allowDefaultChanged", e.target.checked)} />
                              <span className="text-[11px] font-bold text-gray-700">Allow this default to be changed in Update process</span>
                            </label>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                )}

                {activeTab === "Pools" && (
                  <div className="p-4 space-y-6 min-h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                       <div className="space-y-4">
                         <div className="flex items-center space-x-4">
                           <span className="text-[11px] font-bold text-gray-700 w-1/2">Last Create Pool Links Run Date</span>
                           <input type="date" className="w-1/2 border border-gray-300 p-1 text-[11px] rounded" value={activeRecord.lastCreatePoolLinksRunDate || ""} onChange={(e) => handleFieldChange(activeRecord.id, "lastCreatePoolLinksRunDate", e.target.value)} />
                         </div>
                         <label className="flex items-center space-x-2 opacity-50">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-not-allowed" disabled checked={activeRecord.capitalizeGaAppliedToWip || false} />
                            <span className="text-[11px] font-bold text-gray-500">Capitalize G&A Applied to WIP</span>
                         </label>
                         <label className="flex items-center space-x-2 opacity-50">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-not-allowed" disabled checked={activeRecord.presentWipGaOnPsr || false} />
                            <span className="text-[11px] font-bold text-gray-500">Present WIP G&A on PSR Profit & Loss</span>
                         </label>
                       </div>
                       <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.applyGaToWip || false} onChange={(e) => handleFieldChange(activeRecord.id, "applyGaToWip", e.target.checked)} />
                              <span className="text-[11px] font-bold text-gray-700">Apply G&A to WIP</span>
                            </label>
                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] font-bold text-gray-700">WIP G&A Pool Type</span>
                              <input type="text" className="border border-gray-300 bg-gray-100 p-1 w-24 text-[11px]" readOnly />
                            </div>
                         </div>
                         <label className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox h-4 w-4 accent-[#17414d] cursor-pointer" checked={activeRecord.allowProjectsInactive || false} onChange={(e) => handleFieldChange(activeRecord.id, "allowProjectsInactive", e.target.checked)} />
                            <span className="text-[11px] font-bold text-gray-700">Allow Projects that are Inactive or Do Not Allow Charging in Allocation Journals</span>
                         </label>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === "Budgeting" && (
                  <div className="p-4 min-h-[400px]">
                    <div className="w-1/2">
                       <FormSearchSelect 
                          label="Budgeting Method *" 
                          value={activeRecord.budgetingMethod} 
                          options={[{budgetingMethod: "Advanced Budgeting"}, {budgetingMethod: "Budgeting and ETC"}, {budgetingMethod: "Planning Project Budgets"}]} 
                          displayKey="budgetingMethod"
                          onChange={(e) => handleFieldChange(activeRecord.id, "budgetingMethod", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ConfigureProjectSettings;
