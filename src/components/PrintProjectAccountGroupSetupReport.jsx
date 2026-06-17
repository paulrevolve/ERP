import React, { useState } from 'react';
import { MainContainer, Toolbar } from '../helper/container';
import { FormSection, FormInput } from '../helper/formSection';
import { ReusableTable } from '../helper/tableSection';

const PrintProjectAccountGroupSetupReport = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([
    {
      id: 1,
      parameterId: '',
      description: '',
      projectSelection: 'All',
      projectStart: '',
      projectEnd: '',
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeRecord = records[currentIndex] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleNavigate = (dir) => {
    if (dir === 'next' && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
    if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    if (dir === 'start') setCurrentIndex(0);
    if (dir === 'end') setCurrentIndex(records.length - 1);
  };

  const columns = [
    { id: 'parameterId', label: 'Parameter ID *', key: 'parameterId' },
    { id: 'description', label: 'Description *', key: 'description' },
  ];

  const selectionRangesCols = [
    { id: 'type', label: '', key: 'type', type: 'readOnly-text' },
    { 
      id: 'projectSelection', label: 'Option', key: 'projectSelection', type: 'select', 
      options: [{value: 'All', label: 'All'}, {value: 'One', label: 'One'}, {value: 'Range', label: 'Range'}], 
      optionValue: 'value', optionLabel: 'label' 
    },
    { id: 'projectStart', label: 'Start', key: 'projectStart', isDisabled: (row) => row.projectSelection === 'All' },
    { id: 'projectEnd', label: 'End', key: 'projectEnd', isDisabled: (row) => row.projectSelection !== 'Range' }
  ];

  const selectionData = activeRecord.id ? [
    { 
      id: activeRecord.id, 
      type: 'Project', 
      projectSelection: activeRecord.projectSelection || 'All', 
      projectStart: activeRecord.projectStart || '', 
      projectEnd: activeRecord.projectEnd || '' 
    }
  ] : [];

  return (
    <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
      <MainContainer title="Identification">
        <Toolbar
          isFormView={isFormView}
          currentIndex={currentIndex}
          totalRecords={records.length}
          handleNavigate={handleNavigate}
          actions={{
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {},
            onDelete: () => {},
            onSave: () => {}
          }}
        />
        <div className="mt-2">
          {isFormView ? (
            <div className="space-y-4 bg-white p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 border border-gray-200">
                <FormInput
                  label="Parameter ID *"
                  value={activeRecord.parameterId || ''}
                  onChange={(e) => handleFieldChange(activeRecord.id, 'parameterId', e.target.value)}
                />
                <FormInput
                  label="Description *"
                  value={activeRecord.description || ''}
                  onChange={(e) => handleFieldChange(activeRecord.id, 'description', e.target.value)}
                />
              </div>

              <div className="border border-gray-200 bg-white">
                <div className="bg-white border-b border-gray-200 text-gray-600 text-[11px] font-bold px-3 py-2 flex justify-between items-center">
                  <span>Selection Ranges</span>
                </div>
                <div className="p-3">
                  <ReusableTable 
                    data={selectionData} 
                    columns={selectionRangesCols} 
                    onFieldChange={handleFieldChange} 
                    showCheckboxesTable={false}
                    showCheckboxesHeader={false}
                    showCheckboxesHeaderTop={false}
                  />
                </div>
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

export default PrintProjectAccountGroupSetupReport;
