import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FileText } from 'lucide-react';
import { MainContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSection, FormInput } from '../helper/formSection';

const columns = [
  { id: "modDescription", key: "modDescription", label: "Modification Description *", type: "text" },
  { id: "useAllCompanies", key: "useAllCompanies", label: "Use for All Companies", type: "checkbox" },
  { id: "active", key: "active", label: "Active", type: "checkbox" }
];

const ManageModificationDescriptions = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([
    { id: '1', modDescription: 'Contract Initial Award', useAllCompanies: 'Y', active: 'Y' },
    { id: '2', modDescription: 'Funding De-obligation', useAllCompanies: 'N', active: 'Y' },
    { id: '3', modDescription: 'Period of Performance Extension', useAllCompanies: 'Y', active: 'Y' },
    { id: '4', modDescription: 'Scope Alignment Revision', useAllCompanies: 'N', active: 'N' }
  ]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);

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
      modDescription: '',
      useAllCompanies: 'N',
      active: 'Y',
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setSelectedRow(newRecord);
    setSelectedIds(new Set([tempId]));
    toast.success("New modification description added");
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
    const hasInvalid = records.some(r => !r.modDescription?.trim());
    if (hasInvalid) {
      return toast.error("Modification Description is required!");
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
      <MainContainer icon={FileText} title="Manage Modification Descriptions">
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
            onAdd: handleAdd,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleDiscard,
            onDelete: handleDelete,
            onSave: handleSave,
            onToggleView: () => setIsFormView(!isFormView)
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
                <FormSection title="Modification Description Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                    <div className="space-y-2">
                      <FormInput
                        label="Modification Description *"
                        required
                        value={selectedRow?.modDescription || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "modDescription", e.target.value)}
                      />
                      <FormInput
                        label="Use for All Companies"
                        type="checkbox"
                        checked={selectedRow?.useAllCompanies === 'Y'}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "useAllCompanies", e.target.checked ? "Y" : "N")}
                      />
                      <FormInput
                        label="Active"
                        type="checkbox"
                        checked={selectedRow?.active === 'Y'}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "active", e.target.checked ? "Y" : "N")}
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

export default ManageModificationDescriptions;
