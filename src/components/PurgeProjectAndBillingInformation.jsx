import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Layers } from 'lucide-react';
import { MainContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSection, FormInput, FormSearchSelect } from '../helper/formSection';

// Mock Project options
const projectOptions = [
  { value: 'PRJ001', name: 'Acme Web Development' },
  { value: 'PRJ002', name: 'Alpha Infrastructure Setup' },
  { value: 'PRJ003', name: 'Gamma Cloud Integration' },
  { value: 'PRJ004', name: 'Delta Security Audit' }
];

const columns = [
  {
    id: "parameterId",
    key: "parameterId",
    label: "Parameter ID *",
    type: "text",
    required: true
  },
  {
    id: "description",
    key: "description",
    label: "Description *",
    type: "text",
    required: true
  },
  {
    id: "projectId",
    key: "projectId",
    label: "Project *",
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
  }
];

const PurgeProjectAndBillingInformation = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([
    { id: '1', parameterId: 'PURGE_PRJ_01', description: 'Purge Closed Accounts 2025', projectId: 'PRJ001', projectName: 'Acme Web Development' },
    { id: '2', parameterId: 'PURGE_PRJ_02', description: 'Purge Old Billing Records', projectId: 'PRJ002', projectName: 'Alpha Infrastructure Setup' }
  ]);
  
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);
  
  // Search state for FormSearchSelect field in Form View
  const [projectSearch, setProjectSearch] = useState("");

  const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

  const handleFieldChange = (rowId, field, value) => {
    let extraFields = {};
    if (field === 'projectId') {
      const match = projectOptions.find(o => o.value === value);
      extraFields = { projectName: match ? match.name : '' };
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
      parameterId: '',
      description: '',
      projectId: '',
      projectName: '',
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setSelectedRow(newRecord);
    setSelectedIds(new Set([tempId]));
    toast.success("New purge parameter definition added");
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
    const hasInvalid = records.some(r => !r.parameterId?.trim() || !r.description?.trim() || !r.projectId?.trim());
    if (hasInvalid) {
      return toast.error("Parameter ID, Description, and Project are required!");
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

  const isDirty = records.some(r => r.isDirty);

  return (
    <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
      <MainContainer icon={Layers} title="Purge Project and Billing Information">
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
        <div className="mt-2">
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
              <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
                <FormSection title="Identification">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                    <div className="space-y-3">
                      <FormInput
                        label="Parameter ID *"
                        value={selectedRow?.parameterId || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "parameterId", e.target.value)}
                        required={true}
                      />
                      <FormInput
                        label="Description *"
                        value={selectedRow?.description || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "description", e.target.value)}
                        required={true}
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Selection Ranges">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                    <div className="space-y-3">
                      <FormSearchSelect
                        label="Project *"
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
                  </div>
                </FormSection>
              </div>
            </div>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default PurgeProjectAndBillingInformation;
