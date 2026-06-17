import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Layers } from 'lucide-react';
import { MainContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSection, FormInput, FormSearchSelect } from '../helper/formSection';

// Mock choices for Project Type and Project Account Group
const projectTypeOptions = [
  { value: 'CPFF', name: 'CPFF' },
  { value: 'FIXED PRICE', name: 'FIXED PRICE' },
  { value: 'INVENTORY', name: 'INVENTORY' },
  { value: 'MANF', name: 'MANF' },
  { value: 'T&M', name: 'T&M' }
];

const projectAccountGroupOptions = [
  { value: 'DEFAULT', name: 'DEFAULT' },
  { value: 'COMMERCIAL', name: 'COMMERCIAL' },
  { value: 'GOVERNMENT', name: 'GOVERNMENT' },
  { value: 'INTERNAL', name: 'INTERNAL' }
];

const columns = [
  {
    id: "projectType",
    key: "projectType",
    label: "Project Type *",
    type: "search-select",
    required: true,
    options: projectTypeOptions,
    displayKey: "value",
    secondaryKey: "name"
  },
  {
    id: "projectAccountGroup",
    key: "projectAccountGroup",
    label: "Project Account Group *",
    type: "search-select",
    required: true,
    options: projectAccountGroupOptions,
    displayKey: "value",
    secondaryKey: "name"
  },
  {
    id: "description",
    key: "description",
    label: "Description",
    type: "text"
  }
];

const ManageProjectAccountGroupMappings = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([
    { id: '1', projectType: 'CPFF', projectAccountGroup: 'GOVERNMENT', description: 'Cost Plus Fixed Fee Government Accounts' },
    { id: '2', projectType: 'FIXED PRICE', projectAccountGroup: 'COMMERCIAL', description: 'Fixed Price Commercial Mappings' },
    { id: '3', projectType: 'T&M', projectAccountGroup: 'DEFAULT', description: 'Time & Materials Default Accounts' }
  ]);
  
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);
  
  // Search states for FormSearchSelect fields in Form View
  const [projTypeSearch, setProjTypeSearch] = useState("");
  const [accGroupSearch, setAccGroupSearch] = useState("");

  const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

  const handleFieldChange = (rowId, field, value) => {
    setRecords(prev => prev.map(r => getRowKey(r) === String(rowId) ? { ...r, [field]: value, isDirty: true } : r));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== String(rowId)) return prev;
      return { ...prev, [field]: value, isDirty: true };
    });
  };

  const handleAdd = () => {
    const tempId = `NEW_${Date.now()}`;
    const newRecord = {
      id: tempId,
      tempId,
      projectType: '',
      projectAccountGroup: '',
      description: '',
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setSelectedRow(newRecord);
    setSelectedIds(new Set([tempId]));
    toast.success("New project account group mapping added");
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
    const hasInvalid = records.some(r => !r.projectType?.trim() || !r.projectAccountGroup?.trim());
    if (hasInvalid) {
      return toast.error("Project Type and Project Account Group are required!");
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
      <MainContainer icon={Layers} title="Manage Project Account Group Mappings">
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
                <FormSection title="Mapping Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                    <div className="space-y-3">
                      <FormSearchSelect
                        label="Project Type *"
                        value={selectedRow?.projectType || ""}
                        searchTerm={projTypeSearch}
                        setSearchTerm={setProjTypeSearch}
                        options={projectTypeOptions}
                        onSelect={(opt) => handleFieldChange(getRowKey(selectedRow), "projectType", opt.value)}
                        displayKey="value"
                        secondaryKey="name"
                        placeholder="Search project types..."
                      />
                      
                      <FormSearchSelect
                        label="Project Account Group *"
                        value={selectedRow?.projectAccountGroup || ""}
                        searchTerm={accGroupSearch}
                        setSearchTerm={setAccGroupSearch}
                        options={projectAccountGroupOptions}
                        onSelect={(opt) => handleFieldChange(getRowKey(selectedRow), "projectAccountGroup", opt.value)}
                        displayKey="value"
                        secondaryKey="name"
                        placeholder="Search account groups..."
                      />
                      
                      <FormInput
                        label="Description"
                        value={selectedRow?.description || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "description", e.target.value)}
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

export default ManageProjectAccountGroupMappings;
