import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Layers, RefreshCw, Save } from 'lucide-react';
import { MainContainer, SecondaryContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSection, FormInput, FormSearchSelect, ActionDetailButton } from '../helper/formSection';

// Mock Project options
const projectOptions = [
  { value: 'PRJ001', name: 'Acme Web Development' },
  { value: 'PRJ002', name: 'Alpha Infrastructure Setup' },
  { value: 'PRJ003', name: 'Gamma Cloud Integration' },
  { value: 'PRJ004', name: 'Delta Security Audit' },
  { value: 'PRJ005', name: 'Epsilon IoT Platform' }
];

const columns = [
  {
    id: "pmProject",
    key: "pmProject",
    label: "PM Project *",
    type: "search-select",
    required: true,
    options: projectOptions,
    displayKey: "value",
    secondaryKey: "name"
  },
  {
    id: "pmProjectName",
    key: "pmProjectName",
    label: "PM Project Name",
    type: "text"
  },
  {
    id: "peProjectName",
    key: "peProjectName",
    label: "PE Project Name",
    type: "text"
  },
  {
    id: "pmOrgId",
    key: "pmOrgId",
    label: "PM Org ID",
    type: "text"
  },
  {
    id: "peOrgId",
    key: "peOrgId",
    label: "PE Org ID",
    type: "text"
  },
  {
    id: "pmAbbrCode",
    key: "pmAbbrCode",
    label: "PM Abbr Code",
    type: "text"
  },
  {
    id: "peAbbrCode",
    key: "peAbbrCode",
    label: "PE Abbr Code",
    type: "text"
  },
  {
    id: "pmAccountGroup",
    key: "pmAccountGroup",
    label: "PM Account Group",
    type: "text"
  },
  {
    id: "peAccountGroup",
    key: "peAccountGroup",
    label: "PE Account Group",
    type: "text"
  },
  {
    id: "pmStartDate",
    key: "pmStartDate",
    label: "PM Start Date",
    type: "text"
  }
];

const SynchronizeProjectMasterDataAndProjectEditData = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([
    {
      id: '1',
      pmProject: 'PRJ001',
      pmProjectName: 'Acme Web Development',
      peProjectName: 'Acme Web Dev Inc',
      pmOrgId: 'ORG_NORTH',
      peOrgId: 'ORG_NORTH_DEV',
      pmAbbrCode: 'AWD',
      peAbbrCode: 'AWD-INC',
      pmAccountGroup: 'AG_CORP',
      peAccountGroup: 'AG_CORP',
      pmStartDate: '2025-01-15'
    },
    {
      id: '2',
      pmProject: 'PRJ003',
      pmProjectName: 'Gamma Cloud Integration',
      peProjectName: 'Gamma Cloud Integration',
      pmOrgId: 'ORG_EAST',
      peOrgId: 'ORG_WEST',
      pmAbbrCode: 'GCI',
      peAbbrCode: 'GCI',
      pmAccountGroup: 'AG_FED',
      peAccountGroup: 'AG_FED_2',
      pmStartDate: '2025-02-10'
    }
  ]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);

  // Criteria panel states
  const [projectRange, setProjectRange] = useState('All');
  const [startProject, setStartProject] = useState('');
  const [endProject, setEndProject] = useState('');
  const [syncDirection, setSyncDirection] = useState('PM_TO_PE'); // PM_TO_PE or PE_TO_PM
  
  // Search selects searchTerms
  const [startSearchTerm, setStartSearchTerm] = useState('');
  const [endSearchTerm, setEndSearchTerm] = useState('');

  const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

  const handleFieldChange = (rowId, field, value) => {
    let extraFields = {};
    if (field === 'pmProject') {
      const match = projectOptions.find(o => o.value === value);
      extraFields = { pmProjectName: match ? match.name : '' };
    }

    setRecords(prev => prev.map(r => getRowKey(r) === String(rowId) ? { ...r, [field]: value, ...extraFields, isDirty: true } : r));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== String(rowId)) return prev;
      return { ...prev, [field]: value, ...extraFields, isDirty: true };
    });
  };

  const handleAdd = () => {
    const tempId = `NEW_${Date.now()}`;
    const newRecord = {
      id: tempId,
      tempId,
      pmProject: '',
      pmProjectName: '',
      peProjectName: '',
      pmOrgId: '',
      peOrgId: '',
      pmAbbrCode: '',
      peAbbrCode: '',
      pmAccountGroup: '',
      peAccountGroup: '',
      pmStartDate: '',
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setSelectedRow(newRecord);
    setSelectedIds(new Set([tempId]));
    toast.success("New synchronization discrepancy record added");
  };

  const handleCopy = () => {
    if (!selectedRow) return toast.warn("Select a record to copy");
    setClipboard([selectedRow]);
    toast.success("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Nothing to paste");
    const pasted = clipboard.map((item, idx) => {
      const tempId = `PASTE_${Date.now()}_${idx}`;
      return {
        ...item,
        id: tempId,
        tempId,
        isDirty: true
      };
    });
    setRecords([...pasted, ...records]);
    setSelectedRow(pasted[0]);
    setSelectedIds(new Set([pasted[0].id]));
    toast.success("Record pasted successfully");
  };

  const handleDelete = () => {
    if (selectedIds.size === 0 && !selectedRow) {
      return toast.warn("Select record(s) to delete");
    }
    const idsToDelete = selectedIds.size > 0 ? selectedIds : new Set([getRowKey(selectedRow)]);
    setRecords(prev => prev.filter(r => !idsToDelete.has(getRowKey(r))));
    setSelectedIds(new Set());
    setSelectedRow(null);
    toast.success("Record(s) deleted");
  };

  const handleSave = () => {
    const hasInvalid = records.some(r => !r.pmProject?.trim());
    if (hasInvalid) {
      return toast.error("PM Project is required!");
    }
    setRecords(prev => prev.map(r => ({ ...r, isDirty: false })));
    setSelectedRow(prev => prev ? { ...prev, isDirty: false } : null);
    toast.success("Changes saved successfully!");
  };

  const handleDiscard = () => {
    setRecords(prev => prev.map(r => ({ ...r, isDirty: false })));
    setSelectedRow(prev => prev ? { ...prev, isDirty: false } : null);
    toast.info("Unsaved changes discarded");
  };

  const handleSaveCriteria = () => {
    toast.success("Synchronization criteria saved successfully!");
  };

  const handleRunSync = () => {
    if (projectRange === 'Range' && (!startProject || !endProject)) {
      return toast.error("Please specify both Start and End projects for range selection!");
    }

    toast.info(`Running synchronization ${syncDirection === 'PM_TO_PE' ? 'from Project Master to Project Edit' : 'from Project Edit to Project Master'}...`);
    
    setTimeout(() => {
      setRecords(prev => prev.map(r => {
        if (syncDirection === 'PM_TO_PE') {
          // Sync PE fields to PM values
          return {
            ...r,
            peProjectName: r.pmProjectName,
            peOrgId: r.pmOrgId,
            peAbbrCode: r.pmAbbrCode,
            peAccountGroup: r.pmAccountGroup,
            isDirty: true
          };
        } else {
          // Sync PM fields to PE values
          return {
            ...r,
            pmProjectName: r.peProjectName,
            pmOrgId: r.peOrgId,
            pmAbbrCode: r.peAbbrCode,
            pmAccountGroup: r.peAccountGroup,
            isDirty: true
          };
        }
      }));
      toast.success("Project Master and Project Edit tables synchronized successfully!");
    }, 500);
  };

  const isDirty = records.some(r => r.isDirty);

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Layers} title="Synchronize Project Master Data and Project Edit Data">
        
        {/* Action Toolbar */}
        <Toolbar
          isFormView={isFormView}
          columns={columns}
          currentIndex={records.findIndex(r => getRowKey(r) === getRowKey(selectedRow))}
          totalRecords={records.length}
          handleNavigate={(dir) => {
            const idx = records.findIndex(r => getRowKey(r) === getRowKey(selectedRow));
            if (dir === 'start' && records.length > 0) {
              setSelectedRow(records[0]);
            } else if (dir === 'prev' && idx > 0) {
              setSelectedRow(records[idx - 1]);
            } else if (dir === 'next' && idx < records.length - 1) {
              setSelectedRow(records[idx + 1]);
            } else if (dir === 'end' && records.length > 0) {
              setSelectedRow(records[records.length - 1]);
            }
          }}
          actions={{
            onAdd: () => {
              handleAdd();
              setIsFormView(true);
            },
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleDiscard,
            onDelete: handleDelete,
            onSave: handleSave,
            onToggleView: () => {
              if (!isFormView && !selectedRow && records.length > 0) {
                setSelectedRow(records[0]);
                setSelectedIds(new Set([getRowKey(records[0])]));
              }
              setIsFormView(!isFormView);
            }
          }}
          selectedRow={selectedRow}
          isDirty={isDirty}
          clipboardCount={clipboard.length}
          clipboard={clipboard}
        />

        <div className="space-y-6 mt-2">
          
          {/* SECTION 1: Criteria Selection Panel */}
          <SecondaryContainer 
            title="Synchronization Parameters & Options"
            headerRight={
              <button 
                onClick={handleSaveCriteria}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded bg-[#17414d] text-white border border-[#17414d] hover:bg-[#11313a] transition-all cursor-pointer active:scale-95"
              >
                <Save size={12} />
                Save Criteria
              </button>
            }
          >
            <div className="p-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-1">
                  <label className="block text-[10px] font-medium text-black">
                    Project Range <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={projectRange}
                    onChange={(e) => {
                      setProjectRange(e.target.value);
                      if (e.target.value !== 'Range') {
                        setStartProject('');
                        setEndProject('');
                      }
                    }}
                    className="w-full border border-gray-300 rounded p-0.5 text-[10px] outline-none focus:border-[#17414d] bg-white cursor-pointer transition-all duration-200"
                  >
                    <option value="All">All</option>
                    <option value="Range">Range</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <FormSearchSelect
                    label="Start Project"
                    value={startProject}
                    searchTerm={startSearchTerm}
                    setSearchTerm={setStartSearchTerm}
                    options={projectOptions}
                    onSelect={(opt) => setStartProject(opt.value)}
                    displayKey="value"
                    secondaryKey="name"
                    disabled={projectRange !== 'Range'}
                    placeholder="Search start..."
                  />
                </div>

                <div className="space-y-1">
                  <FormSearchSelect
                    label="End Project"
                    value={endProject}
                    searchTerm={endSearchTerm}
                    setSearchTerm={setEndSearchTerm}
                    options={projectOptions}
                    onSelect={(opt) => setEndProject(opt.value)}
                    displayKey="value"
                    secondaryKey="name"
                    disabled={projectRange !== 'Range'}
                    placeholder="Search end..."
                  />
                </div>

                <div className="flex justify-center md:justify-end">
                  <ActionDetailButton
                    label="Synchronize Data"
                    onClick={handleRunSync}
                    icon={RefreshCw}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <span className="block text-[10px] font-semibold text-[#17414d] mb-2">
                  Options  Direction of Synchronization:
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-[10px] font-medium text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="syncDirection"
                      value="PM_TO_PE"
                      checked={syncDirection === 'PM_TO_PE'}
                      onChange={() => setSyncDirection('PM_TO_PE')}
                      className="accent-[#17414d] w-3.5 h-3.5"
                    />
                    From Project Master to Project Edit
                  </label>
                  <label className="flex items-center gap-2 text-[10px] font-medium text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="syncDirection"
                      value="PE_TO_PM"
                      checked={syncDirection === 'PE_TO_PM'}
                      onChange={() => setSyncDirection('PE_TO_PM')}
                      className="accent-[#17414d] w-3.5 h-3.5"
                    />
                    From Project Edit to Project Master
                  </label>
                </div>
              </div>
            </div>
          </SecondaryContainer>

          {/* SECTION 2: Discrepancies Grid / Form view */}
          <SecondaryContainer title="Synchronization Discrepancy & Verification Grid">
            <div className="p-2">
              {!isFormView ? (
                <div className="bg-white border border-gray-200 p-2 overflow-x-auto">
                  <ReusableTable
                    data={records}
                    columns={columns}
                    selectedRows={selectedIds}
                    onSelectAll={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(records.map(getRowKey)));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                    onRowSelect={(item) => {
                      const key = getRowKey(item);
                      const newIds = new Set(selectedIds);
                      if (newIds.has(key)) {
                        newIds.delete(key);
                      } else {
                        newIds.add(key);
                      }
                      setSelectedIds(newIds);
                      setSelectedRow(item);
                    }}
                    onFieldChange={handleFieldChange}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-gray-200 rounded-sm">
                    <FormSection title="Synchronization Details">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                        <div className="space-y-3">
                          <FormSearchSelect
                            label="PM Project *"
                            value={selectedRow?.pmProject || ""}
                            searchTerm={startSearchTerm}
                            setSearchTerm={setStartSearchTerm}
                            options={projectOptions}
                            onSelect={(opt) => {
                              handleFieldChange(getRowKey(selectedRow), "pmProject", opt.value);
                            }}
                            displayKey="value"
                            secondaryKey="name"
                            placeholder="Select project..."
                          />
                          <FormInput
                            label="PM Project Name"
                            value={selectedRow?.pmProjectName || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "pmProjectName", e.target.value)}
                          />
                          <FormInput
                            label="PE Project Name"
                            value={selectedRow?.peProjectName || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "peProjectName", e.target.value)}
                          />
                          <FormInput
                            label="PM Organization ID"
                            value={selectedRow?.pmOrgId || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "pmOrgId", e.target.value)}
                          />
                          <FormInput
                            label="PE Organization ID"
                            value={selectedRow?.peOrgId || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "peOrgId", e.target.value)}
                          />
                        </div>

                        <div className="space-y-3">
                          <FormInput
                            label="PM Abbr Code"
                            value={selectedRow?.pmAbbrCode || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "pmAbbrCode", e.target.value)}
                          />
                          <FormInput
                            label="PE Abbr Code"
                            value={selectedRow?.peAbbrCode || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "peAbbrCode", e.target.value)}
                          />
                          <FormInput
                            label="PM Account Group"
                            value={selectedRow?.pmAccountGroup || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "pmAccountGroup", e.target.value)}
                          />
                          <FormInput
                            label="PE Account Group"
                            value={selectedRow?.peAccountGroup || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "peAccountGroup", e.target.value)}
                          />
                          <FormInput
                            label="PM Start Date"
                            value={selectedRow?.pmStartDate || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "pmStartDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </FormSection>
                  </div>
                </div>
              )}
            </div>
          </SecondaryContainer>
        </div>
      </MainContainer>
    </div>
  );
};

export default SynchronizeProjectMasterDataAndProjectEditData;
