import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ClipboardCopy, Layers, Plus, Save, Trash2, X } from 'lucide-react';
import { MainContainer, SecondaryContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSection, FormInput, FormSearchSelect } from '../helper/formSection';

// Mock Project options
const projectOptions = [
  { value: 'PRJ001', name: 'Acme Web Development' },
  { value: 'PRJ002', name: 'Alpha Infrastructure Setup' },
  { value: 'PRJ003', name: 'Gamma Cloud Integration' },
  { value: 'PRJ004', name: 'Delta Security Audit' },
  { value: 'PRJ005', name: 'Epsilon IoT Platform' }
];

const lineTypeOptions = [
  { optionValue: 'Labor', optionLabel: 'Labor' },
  { optionValue: 'Material', optionLabel: 'Material' },
  { optionValue: 'Travel', optionLabel: 'Travel' },
  { optionValue: 'Subcontractor', optionLabel: 'Subcontractor' },
  { optionValue: 'Other', optionLabel: 'Other' }
];

const updateBudgetOptions = [
  { optionValue: 'total_only', optionLabel: 'Update Project total budget only' },
  { optionValue: 'first_period', optionLabel: 'Assign approved C/O amount to first period within POP' },
  { optionValue: 'all_periods', optionLabel: 'Spread approved C/O amount to all periods within POP' },
  { optionValue: 'last_period', optionLabel: 'Assign approved C/O to last period within POP' }
];

const ManageChangeOrders = () => {
  const [coList, setCoList] = useState([]);
  const [selectedCoIndex, setSelectedCoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('project-info'); // 'project-info' or 'project-detail'
  
  // Master View States
  const [isMasterFormView, setIsMasterFormView] = useState(false);
  const [selectedCoIds, setSelectedCoIds] = useState(new Set());
  const [coClipboard, setCoClipboard] = useState([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [masterSearchValue, setMasterSearchValue] = useState('');

  // Child Line Item View States
  const [isLineFormView, setIsLineFormView] = useState(false);
  const [selectedLineRow, setSelectedLineRow] = useState(null);
  const [selectedLineIds, setSelectedLineIds] = useState(new Set());
  const [lineClipboard, setLineClipboard] = useState([]);
  const [lineSearchValue, setLineSearchValue] = useState('');

  // Active Change Order reference
  const currentCo = coList[selectedCoIndex] || null;

  // Sync line item details selection
  useEffect(() => {
    if (currentCo && currentCo.lineItems?.length > 0) {
      setSelectedLineRow(currentCo.lineItems[0]);
    } else {
      setSelectedLineRow(null);
    }
    setSelectedLineIds(new Set());
  }, [selectedCoIndex, coList.length]);

  // Total change calculations
  useEffect(() => {
    if (!currentCo) return;
    const computedTotal = (currentCo.lineItems || []).reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0);
    if (computedTotal !== currentCo.coTotal) {
      handleMasterFieldChange('coTotal', computedTotal);
    }
  }, [currentCo?.lineItems]);

  const handleMasterFieldChange = (field, value) => {
    setCoList(prev => prev.map((co, idx) => {
      if (idx === selectedCoIndex) {
        let updated = { ...co, [field]: value, isDirty: true };
        if (field === 'project') {
          const matchedProj = projectOptions.find(p => p.value === value);
          updated.projectName = matchedProj ? matchedProj.name : '';
        }
        return updated;
      }
      return co;
    }));
  };

  const handleMasterFieldChangeByRow = (rowId, field, value) => {
    setCoList(prev => prev.map((co) => {
      if (co.id === rowId) {
        let updated = { ...co, [field]: value, isDirty: true };
        if (field === 'project') {
          const matchedProj = projectOptions.find(p => p.value === value);
          updated.projectName = matchedProj ? matchedProj.name : '';
        }
        return updated;
      }
      return co;
    }));
  };

  const handleLineFieldChange = (lineId, field, value) => {
    setCoList(prev => prev.map((co, idx) => {
      if (idx === selectedCoIndex) {
        const updatedItems = co.lineItems.map(item => {
          if (item.id === lineId) {
            let updatedItem = { ...item, [field]: value };
            
            // Calculate Profit & Total Amount when changes, multiplier, or profitAmount change
            if (field === 'changes' || field === 'multiplier' || field === 'profitAmount') {
              const changesVal = parseFloat(field === 'changes' ? value : item.changes) || 0;
              const multVal = parseFloat(field === 'multiplier' ? value : item.multiplier) || 1;
              const profitVal = parseFloat(field === 'profitAmount' ? value : item.profitAmount) || 0;
              
              updatedItem.totalAmount = (changesVal * multVal) + profitVal;
            }
            
            if (field === 'account') {
              updatedItem.accountName = value === '1100' ? 'Direct Labor' : value === '2200' ? 'Project Materials' : 'Other Account';
            }
            
            return updatedItem;
          }
          return item;
        });
        return { ...co, lineItems: updatedItems, isDirty: true };
      }
      return co;
    }));

    // Keep active selected line row updated
    setSelectedLineRow(prev => {
      if (!prev || prev.id !== lineId) return prev;
      let updatedItem = { ...prev, [field]: value };
      if (field === 'changes' || field === 'multiplier' || field === 'profitAmount') {
        const changesVal = parseFloat(field === 'changes' ? value : prev.changes) || 0;
        const multVal = parseFloat(field === 'multiplier' ? value : prev.multiplier) || 1;
        const profitVal = parseFloat(field === 'profitAmount' ? value : prev.profitAmount) || 0;
        updatedItem.totalAmount = (changesVal * multVal) + profitVal;
      }
      if (field === 'account') {
        updatedItem.accountName = value === '1100' ? 'Direct Labor' : value === '2200' ? 'Project Materials' : 'Other Account';
      }
      return updatedItem;
    });
  };

  // Master Actions
  const handleAddCo = () => {
    const tempId = `CO_${Date.now()}`;
    const newCo = {
      id: tempId,
      project: '',
      projectName: '',
      coNumber: '',
      customerCO: '',
      coStatus: '',
      description: '',
      coTotal: 0.00,
      totals: 0.00,
      unallocated: 0.00,
      user: '',
      date: '',
      modifyContract: false,
      modifyFunding: false,
      updateBudgetOption: 'total_only',
      startDate: '',
      endDate: '',
      notes: '',
      approverId: '',
      dateApproved: '',
      modNumber: '',
      lineItems: [],
      isDirty: true
    };
    
    setCoList([...coList, newCo]);
    setSelectedCoIndex(coList.length);
    setIsMasterFormView(true);
    toast.success("New Change Order created");
  };

  const handleCopyCo = () => {
    if (!currentCo) return toast.warn("Select a Change Order to copy");
    setCoClipboard([currentCo]);
    toast.success("Change Order copied to clipboard");
  };

  const handlePasteCo = () => {
    if (coClipboard.length === 0) return toast.warn("Nothing to paste");
    const pasted = coClipboard.map((co, idx) => {
      const tempId = `CO_PASTE_${Date.now()}_${idx}`;
      return {
        ...co,
        id: tempId,
        coNumber: `${co.coNumber} (Copy)`,
        isDirty: true
      };
    });
    setCoList([...coList, ...pasted]);
    setSelectedCoIndex(coList.length);
    toast.success("Change Order pasted successfully");
  };

  const handleDeleteCo = () => {
    if (coList.length === 0) return toast.warn("No Change Orders to delete");
    const updated = coList.filter((_, idx) => idx !== selectedCoIndex);
    setCoList(updated);
    setSelectedCoIndex(Math.max(0, selectedCoIndex - 1));
    toast.success("Change Order deleted");
  };

  const handleSaveCo = () => {
    if (!currentCo) return toast.error("No record to save");
    if (!currentCo.project) {
      return toast.error("Project is required");
    }
    if (!currentCo.customerCO || !currentCo.coStatus || !currentCo.description) {
      return toast.error("Please fill in all required * CO Details fields");
    }
    setCoList(prev => prev.map((co, idx) => {
      if (idx === selectedCoIndex) {
        return { ...co, isDirty: false };
      }
      return co;
    }));
    toast.success("Change Order saved successfully");
  };

  const handleDiscardCo = () => {
    setCoList(prev => prev.map((co, idx) => {
      if (idx === selectedCoIndex) {
        return { ...co, isDirty: false };
      }
      return co;
    }));
    toast.info("Unsaved changes discarded");
  };

  // Line Item Actions
  const handleAddLine = () => {
    if (!currentCo) return toast.error("Create or select a Change Order first");
    const tempId = `L_NEW_${Date.now()}`;
    const newLine = {
      id: tempId,
      lineType: 'Labor',
      account: '',
      org: '',
      ref1: '',
      changes: 0.00,
      multiplier: 1.0,
      profitAmount: 0.00,
      totalAmount: 0.00,
      accountName: ''
    };
    
    setCoList(prev => prev.map((co, idx) => {
      if (idx === selectedCoIndex) {
        return { ...co, lineItems: [newLine, ...(co.lineItems || [])], isDirty: true };
      }
      return co;
    }));
    setSelectedLineRow(newLine);
    toast.success("New Line Item added");
  };

  const handleCopyLine = () => {
    if (!selectedLineRow) return toast.warn("Select a line item to copy");
    setLineClipboard([selectedLineRow]);
    toast.success("Line Item copied to clipboard");
  };

  const handlePasteLine = () => {
    if (lineClipboard.length === 0) return toast.warn("Nothing to paste");
    const pasted = lineClipboard.map((line, idx) => {
      const tempId = `L_PASTE_${Date.now()}_${idx}`;
      return {
        ...line,
        id: tempId
      };
    });

    setCoList(prev => prev.map((co, idx) => {
      if (idx === selectedCoIndex) {
        return { ...co, lineItems: [...pasted, ...(co.lineItems || [])], isDirty: true };
      }
      return co;
    }));
    setSelectedLineRow(pasted[0]);
    toast.success("Line Item pasted");
  };

  const handleDeleteLine = () => {
    if (!selectedLineRow && selectedLineIds.size === 0) {
      return toast.warn("Select line item(s) to delete");
    }
    const idsToDelete = selectedLineIds.size > 0 ? selectedLineIds : new Set([selectedLineRow.id]);
    
    setCoList(prev => prev.map((co, idx) => {
      if (idx === selectedCoIndex) {
        return {
          ...co,
          lineItems: (co.lineItems || []).filter(item => !idsToDelete.has(item.id)),
          isDirty: true
        };
      }
      return co;
    }));
    setSelectedLineIds(new Set());
    setSelectedLineRow(null);
    toast.success("Line Item(s) deleted");
  };

  // Master Columns: Ordered Project, Project Name, CO Number, CO Description (description) first!
  const masterColumns = [
    {
      id: 'project',
      key: 'project',
      label: 'Project *',
      type: 'search-select',
      options: projectOptions,
      displayKey: 'value',
      secondaryKey: 'name',
      required: true
    },
    { id: 'projectName', key: 'projectName', label: 'Project Name', type: 'readOnly-text' },
    { id: 'coNumber', key: 'coNumber', label: 'CO Number', type: 'readOnly-text' },
    { id: 'description', key: 'description', label: 'CO Description *', type: 'text', required: true },
    { id: 'totals', key: 'totals', label: 'Totals', type: 'readOnly-number' },
    { id: 'unallocated', key: 'unallocated', label: 'Unallocated Amount', type: 'readOnly-number' },
    { id: 'customerCO', key: 'customerCO', label: 'Customer CO *', type: 'text', required: true },
    { id: 'coStatus', key: 'coStatus', label: 'CO Status *', type: 'text', required: true },
    { id: 'coTotal', key: 'coTotal', label: 'CO Total *', type: 'readOnly-number', required: true },
    { id: 'user', key: 'user', label: 'User', type: 'readOnly-text' },
    { id: 'date', key: 'date', label: 'Date', type: 'readOnly-text' },
    { id: 'modifyContract', key: 'modifyContract', label: 'Contract', type: 'checkbox' },
    { id: 'modifyFunding', key: 'modifyFunding', label: 'Funding', type: 'checkbox' },
    {
      id: 'updateBudgetOption',
      key: 'updateBudgetOption',
      label: 'Update Budget Option',
      type: 'select',
      options: updateBudgetOptions,
      optionValue: 'optionValue',
      optionLabel: 'optionLabel'
    },
    { id: 'startDate', key: 'startDate', label: 'Start Date', type: 'date' },
    { id: 'endDate', key: 'endDate', label: 'End Date', type: 'date' },
    { id: 'notes', key: 'notes', label: 'Notes', type: 'text' },
    { id: 'approverId', key: 'approverId', label: 'Approver ID', type: 'text' },
    { id: 'dateApproved', key: 'dateApproved', label: 'Date Approved', type: 'date' },
    { id: 'modNumber', key: 'modNumber', label: 'Mod Number', type: 'text' }
  ];

  const lineColumns = [
    {
      id: 'lineType',
      key: 'lineType',
      label: 'Line Type *',
      type: 'select',
      options: lineTypeOptions,
      optionValue: 'optionValue',
      optionLabel: 'optionLabel',
      required: true
    },
    { id: 'account', key: 'account', label: 'Account *', type: 'text', required: true },
    { id: 'org', key: 'org', label: 'Organization *', type: 'text', required: true },
    { id: 'ref1', key: 'ref1', label: 'Ref No 1', type: 'text' },
    { id: 'changes', key: 'changes', label: 'Changes(+ -)', type: 'number' },
    { id: 'multiplier', key: 'multiplier', label: 'Multiplier', type: 'number' },
    { id: 'profitAmount', key: 'profitAmount', label: 'Profit amount', type: 'number' },
    { id: 'totalAmount', key: 'totalAmount', label: 'Total Amount', type: 'readOnly-number' },
    { id: 'accountName', key: 'accountName', label: 'Account Name', type: 'readOnly-text' }
  ];

  const activeLineItems = currentCo ? (currentCo.lineItems || []) : [];
  const activeLineIndex = currentCo ? activeLineItems.findIndex(item => item.id === selectedLineRow?.id) : -1;
  const activeLineCount = activeLineItems.length;

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Layers} title="Manage Change Orders">
        
        {/* TOP LEVEL NAVIGATION TOOLBAR */}
        <Toolbar
          isFormView={isMasterFormView}
          columns={masterColumns}
          currentIndex={selectedCoIndex}
          totalRecords={coList.length}
          handleNavigate={(dir) => {
            if (dir === 'start') setSelectedCoIndex(0);
            else if (dir === 'prev' && selectedCoIndex > 0) setSelectedCoIndex(selectedCoIndex - 1);
            else if (dir === 'next' && selectedCoIndex < coList.length - 1) setSelectedCoIndex(selectedCoIndex + 1);
            else if (dir === 'end') setSelectedCoIndex(coList.length - 1);
          }}
          actions={{
            onAdd: handleAddCo,
            onCopy: handleCopyCo,
            onPaste: handlePasteCo,
            onClear: handleDiscardCo,
            onDelete: handleDeleteCo,
            onSave: handleSaveCo,
            onToggleView: () => setIsMasterFormView(!isMasterFormView)
          }}
          selectedRow={currentCo}
          isDirty={currentCo?.isDirty}
          clipboardCount={coClipboard.length}
          clipboard={coClipboard}
          searchValue={masterSearchValue}
          setSearchValue={setMasterSearchValue}
          jumpToCode={(code) => {
            const foundIdx = coList.findIndex(co => co.coNumber.toLowerCase().includes(code.toLowerCase()));
            if (foundIdx !== -1) {
              setSelectedCoIndex(foundIdx);
              toast.info(`Jumped to Change Order ${coList[foundIdx].coNumber}`);
            } else {
              toast.warn("Change Order not found");
            }
          }}
        />

        {/* MASTER LIST TABLE VIEW */}
        {!isMasterFormView ? (
          <div className="bg-white border border-gray-200 p-2 mt-2 overflow-x-auto">
            <ReusableTable
              data={coList}
              columns={masterColumns}
              selectedRows={new Set([currentCo?.id])}
              onRowSelect={(row) => {
                const idx = coList.findIndex(co => co.id === row.id);
                if (idx !== -1) setSelectedCoIndex(idx);
              }}
              onFieldChange={handleMasterFieldChangeByRow}
              showCheckboxesHeader={true}
              showCheckboxesTable={true}
              showCheckboxesHeaderTop={true}
            />
          </div>
        ) : (
          /* MASTER FORM VIEW - ALWAYS RENDERED WITHOUT HIDING FIELD NAMES */
          <div className="space-y-4 mt-2">
            {/* CO Project Group Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSection title="CO Project">
                <div className="p-1 space-y-2">
                  <FormSearchSelect
                    label="Project *"
                    value={currentCo?.project || ''}
                    searchTerm={projectSearch}
                    setSearchTerm={setProjectSearch}
                    options={projectOptions}
                    onSelect={(opt) => {
                      handleMasterFieldChange('project', opt.value);
                    }}
                    displayKey="value"
                    secondaryKey="name"
                    placeholder="Select project..."
                    disabled={!currentCo}
                  />
                  <div className="flex items-center m-1 pl-[90px]">
                    <span className="text-[10px] text-gray-500 font-light border border-gray-100 bg-gray-50 px-2 py-0.5 rounded flex-1 min-h-[20px]">
                      {currentCo?.projectName || ''}
                    </span>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Cumulative Amounts">
                <div className="p-1 grid grid-cols-2 gap-2">
                  <FormInput
                    label="Totals"
                    value={currentCo ? currentCo.totals.toFixed(2) : ''}
                    readOnly={true}
                    disabled={true}
                  />
                  <FormInput
                    label="Unallocated amount"
                    value={currentCo ? currentCo.unallocated.toFixed(2) : ''}
                    readOnly={true}
                    disabled={true}
                  />
                </div>
              </FormSection>
            </div>

            {/* TABS CONTAINER */}
            <div className="border border-gray-200 rounded-sm bg-white overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setActiveTab('project-info')}
                  className={`px-4 py-1.5 text-xs font-semibold border-r border-gray-200 cursor-pointer transition-all ${
                    activeTab === 'project-info'
                      ? 'bg-[#17414d] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Project Info
                </button>
                <button
                  onClick={() => setActiveTab('project-detail')}
                  className={`px-4 py-1.5 text-xs font-semibold border-r border-gray-200 cursor-pointer transition-all ${
                    activeTab === 'project-detail'
                      ? 'bg-[#17414d] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Project Detail
                </button>
              </div>

              {/* TAB 1: PROJECT INFO */}
              {activeTab === 'project-info' && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#e5f3fb]/20">
                  <div className="col-span-2">
                    <FormSection title="CO Details">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <div className="space-y-2">
                          <FormInput
                            label="CO Number"
                            value={currentCo?.coNumber || ''}
                            readOnly={true}
                            disabled={true}
                          />
                          <FormInput
                            label="Customer CO *"
                            value={currentCo?.customerCO || ''}
                            onChange={(e) => handleMasterFieldChange('customerCO', e.target.value)}
                            required={true}
                            disabled={!currentCo}
                          />
                          <FormInput
                            label="CO Status *"
                            value={currentCo?.coStatus || ''}
                            onChange={(e) => handleMasterFieldChange('coStatus', e.target.value)}
                            required={true}
                            disabled={!currentCo}
                          />
                        </div>
                        <div className="space-y-2">
                          <FormInput
                            label="Description *"
                            value={currentCo?.description || ''}
                            onChange={(e) => handleMasterFieldChange('description', e.target.value)}
                            required={true}
                            disabled={!currentCo}
                          />
                          <FormInput
                            label="CO Total *"
                            value={currentCo ? currentCo.coTotal.toFixed(2) : ''}
                            readOnly={true}
                            disabled={true}
                            required={true}
                          />
                        </div>
                      </div>
                    </FormSection>
                  </div>

                  <div className="space-y-4">
                    <FormSection title="Entry Info">
                      <div className="space-y-2 p-2">
                        <FormInput
                          label="User"
                          value={currentCo?.user || ''}
                          readOnly={true}
                          disabled={true}
                        />
                        <FormInput
                          label="Date"
                          value={currentCo?.date || ''}
                          readOnly={true}
                          disabled={true}
                        />
                      </div>
                    </FormSection>

                    <FormSection title="Modify Project Value">
                      <div className="flex items-center gap-6 p-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="co-modify-contract"
                            checked={!!currentCo?.modifyContract}
                            onChange={(e) => handleMasterFieldChange('modifyContract', e.target.checked)}
                            className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
                            disabled={!currentCo}
                          />
                          <label htmlFor="co-modify-contract" className="text-[10px] text-black cursor-pointer select-none">
                            Contract
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="co-modify-funding"
                            checked={!!currentCo?.modifyFunding}
                            onChange={(e) => handleMasterFieldChange('modifyFunding', e.target.checked)}
                            className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
                            disabled={!currentCo}
                          />
                          <label htmlFor="co-modify-funding" className="text-[10px] text-black cursor-pointer select-none">
                            Funding
                          </label>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECT DETAIL */}
              {activeTab === 'project-detail' && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#e5f3fb]/20">
                  <div className="space-y-4">
                    <FormSection title="Update Budget">
                      <div className="p-2 space-y-2">
                        {updateBudgetOptions.map((opt) => (
                          <div key={opt.optionValue} className="flex items-start gap-2">
                            <input
                              type="radio"
                              name="updateBudgetOption"
                              id={`opt-${opt.optionValue}`}
                              checked={currentCo?.updateBudgetOption === opt.optionValue}
                              onChange={() => handleMasterFieldChange('updateBudgetOption', opt.optionValue)}
                              className="mt-0.5 w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
                              disabled={!currentCo}
                            />
                            <label htmlFor={`opt-${opt.optionValue}`} className="text-[10px] text-gray-800 cursor-pointer select-none">
                              {opt.optionLabel}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormSection>

                    <FormSection title="Period Of Performance">
                      <div className="grid grid-cols-2 gap-2 p-2">
                        <FormInput
                          label="Start Date"
                          type="date"
                          value={currentCo?.startDate || ''}
                          onChange={(e) => handleMasterFieldChange('startDate', e.target.value)}
                          disabled={!currentCo}
                        />
                        <FormInput
                          label="End Date"
                          type="date"
                          value={currentCo?.endDate || ''}
                          onChange={(e) => handleMasterFieldChange('endDate', e.target.value)}
                          disabled={!currentCo}
                        />
                      </div>
                    </FormSection>
                  </div>

                  <div className="space-y-4">
                    <FormSection title="Notes">
                      <div className="p-1">
                        <textarea
                          value={currentCo?.notes || ''}
                          onChange={(e) => handleMasterFieldChange('notes', e.target.value)}
                          rows={3}
                          placeholder="Enter notes..."
                          className="w-full border border-gray-300 rounded p-1.5 outline-none text-[10px] focus:border-[#17414d]"
                          disabled={!currentCo}
                        />
                      </div>
                    </FormSection>

                    <div className="grid grid-cols-3 gap-2">
                      <FormInput
                        label="Approver ID"
                        value={currentCo?.approverId || ''}
                        onChange={(e) => handleMasterFieldChange('approverId', e.target.value)}
                        disabled={!currentCo}
                      />
                      <FormInput
                        label="Date Approved"
                        type="date"
                        value={currentCo?.dateApproved || ''}
                        onChange={(e) => handleMasterFieldChange('dateApproved', e.target.value)}
                        disabled={!currentCo}
                      />
                      <FormInput
                        label="Mod Number"
                        value={currentCo?.modNumber || ''}
                        onChange={(e) => handleMasterFieldChange('modNumber', e.target.value)}
                        disabled={!currentCo}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: LINE ITEM DETAIL - ALWAYS VISIBLE TO PREVENT HIDDEN UI */}
        <div className="mt-4">
          <SecondaryContainer title="Line Item Detail">
            <div className="space-y-2">
              {/* Line Item Toolbar with ALL Actions */}
              <Toolbar
                isFormView={isLineFormView}
                columns={lineColumns}
                currentIndex={activeLineIndex}
                totalRecords={activeLineCount}
                handleNavigate={(dir) => {
                  if (activeLineCount === 0) return;
                  if (dir === 'start') setSelectedLineRow(activeLineItems[0]);
                  else if (dir === 'prev' && activeLineIndex > 0) setSelectedLineRow(activeLineItems[activeLineIndex - 1]);
                  else if (dir === 'next' && activeLineIndex < activeLineCount - 1) setSelectedLineRow(activeLineItems[activeLineIndex + 1]);
                  else if (dir === 'end') setSelectedLineRow(activeLineItems[activeLineCount - 1]);
                }}
                actions={{
                  onAdd: () => {
                    handleAddLine();
                    setIsLineFormView(true);
                  },
                  onCopy: handleCopyLine,
                  onPaste: handlePasteLine,
                  onClear: () => {
                    toast.info("Line Item changes discarded");
                  },
                  onDelete: handleDeleteLine,
                  onSave: () => {
                    toast.success("Line Items saved successfully");
                  },
                  onToggleView: () => {
                    if (!isLineFormView && !selectedLineRow && activeLineCount > 0) {
                      setSelectedLineRow(activeLineItems[0]);
                    }
                    setIsLineFormView(!isLineFormView);
                  }
                }}
                selectedRow={selectedLineRow}
                isDirty={false}
                clipboardCount={lineClipboard.length}
                clipboard={lineClipboard}
                searchValue={lineSearchValue}
                setSearchValue={setLineSearchValue}
                jumpToCode={(code) => {
                  const foundIdx = activeLineItems.findIndex(item => item.account.toLowerCase().includes(code.toLowerCase()) || item.org.toLowerCase().includes(code.toLowerCase()));
                  if (foundIdx !== -1) {
                    setSelectedLineRow(activeLineItems[foundIdx]);
                    toast.info(`Jumped to Line Item for Account ${activeLineItems[foundIdx].account}`);
                  } else {
                    toast.warn("Line Item not found");
                  }
                }}
              />

              {/* Line Item Data Grid/Form View */}
              {!isLineFormView ? (
                <div className="bg-white border border-gray-200 p-2 overflow-x-auto">
                  <ReusableTable
                    data={activeLineItems}
                    columns={lineColumns}
                    selectedRows={selectedLineIds}
                    onSelectAll={(e) => {
                      if (e.target.checked) {
                        setSelectedLineIds(new Set(activeLineItems.map(i => i.id)));
                      } else {
                        setSelectedLineIds(new Set());
                      }
                    }}
                    onRowSelect={(row) => {
                      const newIds = new Set(selectedLineIds);
                      if (newIds.has(row.id)) newIds.delete(row.id);
                      else newIds.add(row.id);
                      setSelectedLineIds(newIds);
                      setSelectedLineRow(row);
                    }}
                    onFieldChange={handleLineFieldChange}
                  />
                </div>
              ) : (
                /* Line Item Form View */
                <div className="p-4 bg-white border border-gray-200 rounded-sm">
                  <FormSection title="Line Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 m-1">
                          <label className="text-[10px] text-black min-w-[90px]">Line Type *</label>
                          <select
                            value={selectedLineRow?.lineType || ''}
                            onChange={(e) => handleLineFieldChange(selectedLineRow?.id, 'lineType', e.target.value)}
                            className="flex-1 border border-gray-300 rounded p-1 text-[10px] bg-white outline-none focus:border-[#17414d]"
                            disabled={!selectedLineRow}
                          >
                            {lineTypeOptions.map((opt, i) => (
                              <option key={i} value={opt.optionValue}>{opt.optionLabel}</option>
                            ))}
                          </select>
                        </div>
                        <FormInput
                          label="Account *"
                          value={selectedLineRow?.account || ''}
                          onChange={(e) => handleLineFieldChange(selectedLineRow?.id, 'account', e.target.value)}
                          required={true}
                          disabled={!selectedLineRow}
                        />
                        <FormInput
                          label="Organization *"
                          value={selectedLineRow?.org || ''}
                          onChange={(e) => handleLineFieldChange(selectedLineRow?.id, 'org', e.target.value)}
                          required={true}
                          disabled={!selectedLineRow}
                        />
                        <FormInput
                          label="Ref No 1"
                          value={selectedLineRow?.ref1 || ''}
                          onChange={(e) => handleLineFieldChange(selectedLineRow?.id, 'ref1', e.target.value)}
                          disabled={!selectedLineRow}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormInput
                          label="Changes(+ -)"
                          type="number"
                          value={selectedLineRow?.changes || 0}
                          onChange={(e) => handleLineFieldChange(selectedLineRow?.id, 'changes', parseFloat(e.target.value) || 0)}
                          disabled={!selectedLineRow}
                        />
                        <FormInput
                          label="Multiplier"
                          type="number"
                          value={selectedLineRow?.multiplier || 1.0}
                          onChange={(e) => handleLineFieldChange(selectedLineRow?.id, 'multiplier', parseFloat(e.target.value) || 1.0)}
                          disabled={!selectedLineRow}
                        />
                        <FormInput
                          label="Profit amount"
                          type="number"
                          value={selectedLineRow?.profitAmount || 0}
                          onChange={(e) => handleLineFieldChange(selectedLineRow?.id, 'profitAmount', parseFloat(e.target.value) || 0)}
                          disabled={!selectedLineRow}
                        />
                        <FormInput
                          label="Total Amount"
                          value={selectedLineRow ? selectedLineRow.totalAmount?.toFixed(2) : ''}
                          readOnly={true}
                          disabled={true}
                        />
                        <FormInput
                          label="Account Name"
                          value={selectedLineRow?.accountName || ''}
                          readOnly={true}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </FormSection>
                </div>
              )}
            </div>
          </SecondaryContainer>
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageChangeOrders;
