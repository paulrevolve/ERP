import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput, ActionDetailButton } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { FileText, Search } from "lucide-react";

const columnsMain = [
  { id: "reportName", key: "reportName", label: "Project Report Name *" },
  { id: "description", key: "description", label: "Description *" },
  { id: "level", key: "level", label: "Level" }
];

const columnsAlternateReporting = [
  { id: "level", key: "level", label: "Level *" },
  { id: "length", key: "length", label: "Length *" },
  { id: "levelName", key: "levelName", label: "Level Name *" }
];

const columnsProjects = [
  { id: "project", key: "project", label: "Project" },
  { id: "projectName", key: "projectName", label: "Project Name" },
  { id: "levelNo", key: "levelNo", label: "Level No" },
  { id: "projectManager", key: "projectManager", label: "Project Manager" }
];

const columnsSelectedProjects = [
  { id: "project", key: "project", label: "Project *" },
  { id: "projectName", key: "projectName", label: "Project Name" },
  { id: "lowLev", key: "lowLev", label: "Low Lev" }
];

const ManageAlternateReportingLevels = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([
    { 
      id: "1", 
      reportName: "RPT001", 
      description: "Standard Project Report", 
      level: "3",
      altReporting: [
        { id: "101", level: "1", length: "4", levelName: "Division" },
        { id: "102", level: "2", length: "4", levelName: "Department" }
      ],
      projects: [
        { id: "p1", project: "PRJ001", projectName: "Website Redesign", levelNo: "1", projectManager: "John Doe" }
      ],
      selectedProjects: [
        { id: "sp1", project: "PRJ001", projectName: "Website Redesign", lowLev: "Y" }
      ]
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeRecord = records[currentIndex] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    const newRecord = {
      id: newId,
      reportName: "",
      description: "",
      level: "",
      altReporting: [],
      projects: [],
      selectedProjects: []
    };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={FileText} title="Manage Alternate Reporting Levels">
        <Toolbar 
          isFormView={isFormView}
          columns={columnsMain}
          currentIndex={currentIndex}
          totalRecords={records.length}
          handleNavigate={(dir) => {
            if (dir === 'next' && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
            if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
            if (dir === 'start') setCurrentIndex(0);
            if (dir === 'end') setCurrentIndex(records.length - 1);
          }}
          actions={{
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: handleAdd,
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {}
          }}
        />

        <div className="mt-2">
          {isFormView ? (
            <div className="space-y-4">
              <FormSection title="Identification">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormInput 
                    label="Project Report Name *" 
                    value={activeRecord.reportName || ""} 
                    onChange={(e) => handleFieldChange(activeRecord.id, "reportName", e.target.value)} 
                  />
                  <FormInput 
                    label="Description *" 
                    value={activeRecord.description || ""} 
                    onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} 
                  />
                  <FormInput 
                    label="Level" 
                    value={activeRecord.level || ""} 
                    onChange={(e) => handleFieldChange(activeRecord.id, "level", e.target.value)} 
                  />
                </div>
              </FormSection>

              <SecondaryContainer title="Alternate Reporting - Top level report">
                <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {} }} />
                <ReusableTable 
                  data={activeRecord.altReporting || []} 
                  columns={columnsAlternateReporting} 
                  onFieldChange={() => {}} 
                />
              </SecondaryContainer>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SecondaryContainer title="Projects">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <Toolbar isTableOnly actions={{ onQuery: () => {} }} />
                    <ActionDetailButton label="Select" onClick={() => {}} />
                  </div>
                  <ReusableTable 
                    data={activeRecord.projects || []} 
                    columns={columnsProjects} 
                    onFieldChange={() => {}} 
                  />
                </SecondaryContainer>

                <SecondaryContainer title="Selected Projects">
                  <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
                  <ReusableTable 
                    data={activeRecord.selectedProjects || []} 
                    columns={columnsSelectedProjects} 
                    onFieldChange={() => {}} 
                  />
                </SecondaryContainer>
              </div>
            </div>
          ) : (
            <SecondaryContainer title="Alternate Reporting Levels List">
              <ReusableTable 
                data={records} 
                columns={columnsMain} 
                onFieldChange={handleFieldChange} 
              />
            </SecondaryContainer>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageAlternateReportingLevels;
