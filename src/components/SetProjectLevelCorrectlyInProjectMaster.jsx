import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Layers, RefreshCw, Check } from 'lucide-react';
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
    id: "projectId",
    key: "projectId",
    label: "Project ID *",
    type: "search-select",
    required: true,
    options: projectOptions,
    displayKey: "value",
    secondaryKey: "name"
  },
  {
    id: "projectName",
    key: "projectName",
    label: "Project Name",
    type: "readOnly-text",
    readOnly: true
  },
  {
    id: "currentLevel",
    key: "currentLevel",
    label: "Current Level *",
    type: "text",
    required: true
  },
  {
    id: "correctLevel",
    key: "correctLevel",
    label: "Correct Level *",
    type: "text",
    required: true
  },
  {
    id: "status",
    key: "status",
    label: "Status",
    type: "readOnly-text",
    readOnly: true
  }
];

const SetProjectLevelCorrectlyInProjectMaster = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([
    { id: '1', projectId: 'PRJ001', projectName: 'Acme Web Development', currentLevel: '3', correctLevel: '2', status: 'Discrepancy' },
    { id: '2', projectId: 'PRJ003', projectName: 'Gamma Cloud Integration', currentLevel: '2', correctLevel: '2', status: 'Correct' },
    { id: '3', projectId: 'PRJ004', projectName: 'Delta Security Audit', currentLevel: '4', correctLevel: '3', status: 'Discrepancy' }
  ]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);
  
  // Search state for project search selects
  const [projectSearch, setProjectSearch] = useState("");

  const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

  const handleFieldChange = (rowId, field, value) => {
    let extraFields = {};
    if (field === 'projectId') {
      const match = projectOptions.find(o => o.value === value);
      extraFields = { projectName: match ? match.name : '' };
    }

    let currentRec = records.find(r => getRowKey(r) === String(rowId));
    let curLevel = field === 'currentLevel' ? value : (currentRec?.currentLevel || "");
    let corLevel = field === 'correctLevel' ? value : (currentRec?.correctLevel || "");
    
    if (field === 'currentLevel' || field === 'correctLevel') {
      extraFields.status = String(curLevel).trim() === String(corLevel).trim() ? 'Correct' : 'Discrepancy';
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
      projectId: '',
      projectName: '',
      currentLevel: '1',
      correctLevel: '1',
      status: 'Correct',
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setSelectedRow(newRecord);
    setSelectedIds(new Set([tempId]));
    toast.success("New level tracking record added");
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
    const hasInvalid = records.some(r => !r.projectId?.trim() || !r.currentLevel?.trim() || !r.correctLevel?.trim());
    if (hasInvalid) {
      return toast.error("Project ID, Current Level, and Correct Level are required!");
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

  // Level Reset Action: Resets level discrepant records back to correct state
  const handleLevelReset = () => {
    toast.info("Running level alignment routine...");
    setTimeout(() => {
      setRecords(prev => prev.map(r => {
        if (r.status === 'Discrepancy') {
          return {
            ...r,
            currentLevel: r.correctLevel,
            status: 'Correct',
            isDirty: true
          };
        }
        return r;
      }));
      toast.success("All project levels aligned successfully in Project Master!");
    }, 400);
  };

  const isDirty = records.some(r => r.isDirty);

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Layers} title="Set Level In Project Master">
        
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
          
          {/* SECTION 1: Control & Reset Action */}
          <SecondaryContainer title="Level Reset Parameters">
            <div className="p-2 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                This utility checks for project level discrepancies where the current levels in the project database do not match correct levels determined by standard segment definition lengths. Click below to align current levels to correct levels.
              </p>
              <div className="flex justify-center mt-2">
                <ActionDetailButton
                  label="Reset Levels"
                  onClick={handleLevelReset}
                  icon={RefreshCw}
                />
              </div>
            </div>
          </SecondaryContainer>

          {/* SECTION 2: Grid / Form View container */}
          <SecondaryContainer title="Project Levels Verification List">
            <div className="p-2">
              {!isFormView ? (
                <div className="bg-white border border-gray-200 p-2">
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
                    <FormSection title="Project Details">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                        <div className="space-y-3">
                          <FormSearchSelect
                            label="Project ID *"
                            value={selectedRow?.projectId || ""}
                            searchTerm={projectSearch}
                            setSearchTerm={setProjectSearch}
                            options={projectOptions}
                            onSelect={(opt) => {
                              handleFieldChange(getRowKey(selectedRow), "projectId", opt.value);
                            }}
                            displayKey="value"
                            secondaryKey="name"
                            placeholder="Search projects..."
                          />
                          <FormInput
                            label="Project Name"
                            value={selectedRow?.projectName || ""}
                            readOnly={true}
                            disabled={true}
                          />
                        </div>
                        <div className="space-y-3">
                          <FormInput
                            label="Current Level *"
                            value={selectedRow?.currentLevel || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "currentLevel", e.target.value)}
                            required={true}
                          />
                          <FormInput
                            label="Correct Level *"
                            value={selectedRow?.correctLevel || ""}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "correctLevel", e.target.value)}
                            required={true}
                          />
                          <FormInput
                            label="Status"
                            value={selectedRow?.status || ""}
                            readOnly={true}
                            disabled={true}
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

export default SetProjectLevelCorrectlyInProjectMaster;
