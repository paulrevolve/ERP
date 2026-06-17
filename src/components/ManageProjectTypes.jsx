import React, { useState } from 'react';
import { MainContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';

const ManageProjectTypes = () => {
  const [records, setRecords] = useState([
    { id: 1, projectType: 'CPFF', defaultOwningOrg: false, active: true },
    { id: 2, projectType: 'FIXED PRICE', defaultOwningOrg: false, active: true },
    { id: 3, projectType: 'INVENTORY', defaultOwningOrg: false, active: true },
    { id: 4, projectType: 'MANF', defaultOwningOrg: false, active: true },
    { id: 5, projectType: 'T&M', defaultOwningOrg: false, active: true },
  ]);

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const columns = [
    { id: 'projectType', label: 'Project Type *', key: 'projectType' },
    { id: 'defaultOwningOrg', label: 'Default to Owning Org', key: 'defaultOwningOrg', type: 'checkbox' },
    { id: 'active', label: 'Active', key: 'active', type: 'checkbox' }
  ];

  return (
    <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
      <MainContainer title="Project Types">
        <Toolbar
          isFormView={false} // Table only view
          actions={{
            onAdd: () => setRecords([{ id: Date.now(), projectType: '', defaultOwningOrg: false, active: true }, ...records]),
            onToggleView: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {},
            onDelete: () => {},
            onSave: () => {}
          }}
        />
        <div className="mt-2 bg-white border border-gray-200 p-2">
          <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageProjectTypes;
