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

const UpdatePOATableWithValidLinksReferenceNumbers = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([
    {
      id: '1',
      poaCombination: 'PRJ001-ORG_NORTH-1100',
      project: 'PRJ001',
      org: 'ORG_NORTH',
      account: '1100',
      ref1: 'REF-A90',
      ref2: 'REF-B44',
      poaExist: false,
      insertLink: true
    },
    {
      id: '2',
      poaCombination: 'PRJ003-ORG_EAST-2200',
      project: 'PRJ003',
      org: 'ORG_EAST',
      account: '2200',
      ref1: 'REF-C12',
      ref2: '',
      poaExist: true,
      insertLink: false
    }
  ]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);
  
  // Search selects searchTerms
  const [projectSearch, setProjectSearch] = useState('');

  const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

  const handleFieldChange = (rowId, field, value) => {
    let extraFields = {};
    if (field === 'project') {
      const match = projectOptions.find(o => o.value === value);
      extraFields = { projectName: match ? match.name : '' };
    }

    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === String(rowId)) {
        const updated = { ...r, [field]: value, ...extraFields, isDirty: true };
        
        // Auto-generate poaCombination when project, org, or account changes
        if (field === 'project' || field === 'org' || field === 'account') {
          const projVal = field === 'project' ? value : r.project;
          const orgVal = field === 'org' ? value : r.org;
          const accVal = field === 'account' ? value : r.account;
          updated.poaCombination = `${projVal || '?'}-${orgVal || '?'}-${accVal || '?'}`;
        }
        return updated;
      }
      return r;
    }));

    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== String(rowId)) return prev;
      const updated = { ...prev, [field]: value, ...extraFields, isDirty: true };
      if (field === 'project' || field === 'org' || field === 'account') {
        const projVal = field === 'project' ? value : prev.project;
        const orgVal = field === 'org' ? value : prev.org;
        const accVal = field === 'account' ? value : prev.account;
        updated.poaCombination = `${projVal || '?'}-${orgVal || '?'}-${accVal || '?'}`;
      }
      return updated;
    });
  };

  const handleAdd = () => {
    const tempId = `NEW_${Date.now()}`;
    const newRecord = {
      id: tempId,
      tempId,
      poaCombination: '',
      project: '',
      org: '',
      account: '',
      ref1: '',
      ref2: '',
      poaExist: false,
      insertLink: false,
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setSelectedRow(newRecord);
    setSelectedIds(new Set([tempId]));
    toast.success("New POA record added");
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
    const hasInvalid = records.some(r => !r.project?.trim() || !r.org?.trim() || !r.account?.trim());
    if (hasInvalid) {
      return toast.error("Project, Org, and Account are required!");
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

  const handleAutoload = () => {
    toast.info("Autoloading missing or discrepant POA linkages...");
    setTimeout(() => {
      const loadedRecords = [
        {
          id: 'L1',
          poaCombination: 'PRJ002-ORG_NORTH-1200',
          project: 'PRJ002',
          org: 'ORG_NORTH',
          account: '1200',
          ref1: 'REF-X29',
          ref2: 'REF-Y30',
          poaExist: false,
          insertLink: true,
          isDirty: true
        },
        {
          id: 'L2',
          poaCombination: 'PRJ004-ORG_WEST-3100',
          project: 'PRJ004',
          org: 'ORG_WEST',
          account: '3100',
          ref1: 'REF-Z55',
          ref2: '',
          poaExist: false,
          insertLink: true,
          isDirty: true
        }
      ];
      setRecords(prev => [...prev, ...loadedRecords]);
      toast.success("Autoload complete. Found 2 new discrepancies.");
    }, 450);
  };

  const isDirty = records.some(r => r.isDirty);

  // Column definitions inside to reference getRowKey and handleFieldChange
  const columns = [
    {
      id: "poaCombination",
      key: "poaCombination",
      label: "POA Combination",
      type: "readOnly-text",
      readOnly: true
    },
    {
      id: "project",
      key: "project",
      label: "Project *",
      type: "search-select",
      required: true,
      options: projectOptions,
      displayKey: "value",
      secondaryKey: "name"
    },
    {
      id: "org",
      key: "org",
      label: "Org *",
      type: "text",
      required: true
    },
    {
      id: "account",
      key: "account",
      label: "Account *",
      type: "text",
      required: true
    },
    {
      id: "ref1",
      key: "ref1",
      label: "Ref 1",
      type: "text"
    },
    {
      id: "ref2",
      key: "ref2",
      label: "Ref 2",
      type: "text"
    },
    {
      id: "poaExist",
      key: "poaExist",
      label: "POA Combination Exist",
      render: (item) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={!!item.poaExist}
            onChange={(e) => handleFieldChange(getRowKey(item), "poaExist", e.target.checked)}
            className="w-3 h-3 accent-[#17414d] cursor-pointer"
          />
        </div>
      )
    },
    {
      id: "insertLink",
      key: "insertLink",
      label: "Insert Link",
      render: (item) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={!!item.insertLink}
            onChange={(e) => handleFieldChange(getRowKey(item), "insertLink", e.target.checked)}
            className="w-3 h-3 accent-[#17414d] cursor-pointer"
          />
        </div>
      )
    }
  ];

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Layers} title="Update POA Table with Valid Links/Reference Numbers">
        
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
          
          {/* SECTION 1: Control & Guidance Panel */}
          <SecondaryContainer 
            title="POA Combinations Evaluation Parameters"
            headerRight={
              <div className="flex gap-2">
                <button 
                  onClick={handleAutoload}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded bg-[#17414d] text-white border border-[#17414d] hover:bg-[#11313a] transition-all cursor-pointer active:scale-95"
                >
                  <RefreshCw size={12} />
                  Autoload Discrepancies
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded bg-white text-[#17414d] border border-[#17414d] hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
                >
                  <Save size={12} />
                  Save Combinations
                </button>
              </div>
            }
          >
            <div className="p-2 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                This utility parses Project/Org/Account (POA) configurations required for transaction routing and revenue posting. Click "Autoload Discrepancies" to fetch missing linkages, verify reference metrics, and specify required links to build the active POA matrix.
              </p>
            </div>
          </SecondaryContainer>

          {/* SECTION 2: POA Combination Grid / Form view */}
          <SecondaryContainer title="POA Validation Grid">
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
                    <FormSection title="POA Details">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                        <div className="space-y-3">
                          <FormInput
                            label="POA Combination"
                            value={selectedRow?.poaCombination || ""}
                            readOnly={true}
                            disabled={true}
                          />
                          <FormSearchSelect
                            label="Project *"
                            value={selectedRow?.project || ""}
                            searchTerm={projectSearch}
                            setSearchTerm={setProjectSearch}
                            options={projectOptions}
                            onSelect={(opt) => {
                              handleFieldChange(getRowKey(selectedRow), "project", opt.value);
                            }}
                            displayKey="value"
                            secondaryKey="name"
                            placeholder="Select project..."
                          />
                          <FormInput
                            label="Org *"
                            value={selectedRow?.org || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "org", e.target.value)}
                            required={true}
                          />
                          <FormInput
                            label="Account *"
                            value={selectedRow?.account || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "account", e.target.value)}
                            required={true}
                          />
                        </div>

                        <div className="space-y-3">
                          <FormInput
                            label="Ref 1"
                            value={selectedRow?.ref1 || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "ref1", e.target.value)}
                          />
                          <FormInput
                            label="Ref 2"
                            value={selectedRow?.ref2 || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "ref2", e.target.value)}
                          />
                          <div className="flex items-center gap-4 m-1 min-h-[24px]">
                            <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
                              POA Exist
                            </label>
                            <input
                              type="checkbox"
                              checked={!!selectedRow?.poaExist}
                              onChange={(e) => handleFieldChange(getRowKey(selectedRow), "poaExist", e.target.checked)}
                              className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
                            />
                          </div>
                          <div className="flex items-center gap-4 m-1 min-h-[24px]">
                            <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
                              Insert Link
                            </label>
                            <input
                              type="checkbox"
                              checked={!!selectedRow?.insertLink}
                              onChange={(e) => handleFieldChange(getRowKey(selectedRow), "insertLink", e.target.checked)}
                              className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
                            />
                          </div>
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

export default UpdatePOATableWithValidLinksReferenceNumbers;
