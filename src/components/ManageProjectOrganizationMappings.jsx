import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Layers } from 'lucide-react';
import { MainContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSection, FormInput, FormSearchSelect } from '../helper/formSection';

// Mock choices for Project Manager and Owning Organization
const projectManagerOptions = [
  { value: 'PM001', name: 'John Doe' },
  { value: 'PM002', name: 'Jane Smith' },
  { value: 'PM003', name: 'Robert Johnson' }
];

const owningOrganizationOptions = [
  { value: 'ORG01', name: 'Finance Department' },
  { value: 'ORG02', name: 'Engineering Operations' },
  { value: 'ORG03', name: 'Human Resources' }
];

const columns = [
  {
    id: "projectManager",
    key: "projectManager",
    label: "Project Manager *",
    type: "search-select",
    required: true,
    options: projectManagerOptions,
    displayKey: "value",
    secondaryKey: "name"
  },
  {
    id: "projectManagerName",
    key: "projectManagerName",
    label: "Project Manager Name",
    type: "readOnly-text",
    readOnly: true
  },
  {
    id: "owningOrganization",
    key: "owningOrganization",
    label: "Owning Organization *",
    type: "search-select",
    required: true,
    options: owningOrganizationOptions,
    displayKey: "value",
    secondaryKey: "name"
  },
  {
    id: "organizationName",
    key: "organizationName",
    label: "Organization Name",
    type: "readOnly-text",
    readOnly: true
  }
];

const ManageProjectOrganizationMappings = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([
    { id: '1', projectManager: 'PM001', projectManagerName: 'John Doe', owningOrganization: 'ORG01', organizationName: 'Finance Department' },
    { id: '2', projectManager: 'PM002', projectManagerName: 'Jane Smith', owningOrganization: 'ORG02', organizationName: 'Engineering Operations' }
  ]);
  
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);
  
  // Search states for FormSearchSelect fields in Form View
  const [pmSearch, setPmSearch] = useState("");
  const [orgSearch, setOrgSearch] = useState("");

  const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

  const handleFieldChange = (rowId, field, value) => {
    let extraFields = {};
    if (field === 'projectManager') {
      const match = projectManagerOptions.find(o => o.value === value);
      extraFields = { projectManagerName: match ? match.name : '' };
    } else if (field === 'owningOrganization') {
      const match = owningOrganizationOptions.find(o => o.value === value);
      extraFields = { organizationName: match ? match.name : '' };
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
      projectManager: '',
      projectManagerName: '',
      owningOrganization: '',
      organizationName: '',
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setSelectedRow(newRecord);
    setSelectedIds(new Set([tempId]));
    toast.success("New project organization mapping added");
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
    const hasInvalid = records.some(r => !r.projectManager?.trim() || !r.owningOrganization?.trim());
    if (hasInvalid) {
      return toast.error("Project Manager and Owning Organization are required!");
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
      <MainContainer icon={Layers} title="Manage Project Organization Mappings">
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
                        label="Project Manager *"
                        value={selectedRow?.projectManager || ""}
                        searchTerm={pmSearch}
                        setSearchTerm={setPmSearch}
                        options={projectManagerOptions}
                        onSelect={(opt) => {
                          handleFieldChange(getRowKey(selectedRow), "projectManager", opt.value);
                        }}
                        displayKey="value"
                        secondaryKey="name"
                        placeholder="Search project managers..."
                      />

                      <FormInput
                        label="Project Manager Name"
                        value={selectedRow?.projectManagerName || ""}
                        readOnly={true}
                        disabled={true}
                      />
                      
                      <FormSearchSelect
                        label="Owning Organization *"
                        value={selectedRow?.owningOrganization || ""}
                        searchTerm={orgSearch}
                        setSearchTerm={setOrgSearch}
                        options={owningOrganizationOptions}
                        onSelect={(opt) => {
                          handleFieldChange(getRowKey(selectedRow), "owningOrganization", opt.value);
                        }}
                        displayKey="value"
                        secondaryKey="name"
                        placeholder="Search owning organizations..."
                      />
                      
                      <FormInput
                        label="Organization Name"
                        value={selectedRow?.organizationName || ""}
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

export default ManageProjectOrganizationMappings;
