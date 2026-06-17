// import React, { useState } from "react";
// import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { Link2 } from "lucide-react";

// const columns = [
//   { id: "project", key: "project", label: "Project" },
//   { id: "account", key: "account", label: "Account *" },
//   { id: "organization", key: "organization", label: "Organization *" },
//   { id: "refNo1", key: "refNo1", label: "Ref No 1" },
//   { id: "refNo2", key: "refNo2", label: "Ref No 2" },
//   { id: "active", key: "active", label: "Active", type: "checkbox" },
//   { id: "projectName", key: "projectName", label: "Project Name" },
//   { id: "accountName", key: "accountName", label: "Account Name" }
// ];

// const LinkProjectsAccountsOrganizations = () => {
//   const [isFormView, setIsFormView] = useState(false); // Mostly table view
//   const [records, setRecords] = useState([
//     { 
//       id: "1", 
//       project: "PRJ001", 
//       account: "600-01", 
//       organization: "ORG-A", 
//       refNo1: "REF01", 
//       refNo2: "", 
//       active: true, 
//       projectName: "Project Alpha", 
//       accountName: "Labor Expense" 
//     }
//   ]);

//   const handleAdd = () => {
//     const newId = `NEW_${Date.now()}`;
//     setRecords([{ id: newId, project: "", account: "", organization: "", refNo1: "", refNo2: "", active: true, projectName: "", accountName: "" }, ...records]);
//   };

//   const handleFieldChange = (id, field, value) => {
//     setRecords(records.map(r => r.id === id ? { ...r, [field]: value } : r));
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={Link2} title="Link Projects/Accounts/Organizations">
//         <Toolbar 
//           isFormView={isFormView}
//           actions={{
//             onToggleView: () => setIsFormView(!isFormView),
//             onAdd: handleAdd,
//             onSave: () => {},
//             onDelete: () => {},
//             onCopy: () => {},
//             onPaste: () => {},
//             onClear: () => {},
//             onQuery: () => {}
//           }}
//         />

//         <div className="mt-2">
//           <SecondaryContainer title="Link Projects/Accounts/Organizations">
//             <ReusableTable 
//               data={records} 
//               columns={columns} 
//               onFieldChange={handleFieldChange} 
//             />
//           </SecondaryContainer>
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default LinkProjectsAccountsOrganizations;

import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { Link2 } from "lucide-react";
import { FormSection, FormInput } from "../helper/formSection";

const columns = [
  { id: "project", key: "project", label: "Project" },
  { id: "account", key: "account", label: "Account *" },
  { id: "organization", key: "organization", label: "Organization *" },
  { id: "refNo1", key: "refNo1", label: "Ref No 1" },
  { id: "refNo2", key: "refNo2", label: "Ref No 2" },
  { id: "active", key: "active", label: "Active", type: "checkbox" },
  { id: "projectName", key: "projectName", label: "Project Name" },
  { id: "accountName", key: "accountName", label: "Account Name" }
];

const LinkProjectsAccountsOrganizations = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    { 
      id: "1", 
      project: "PRJ001", 
      account: "600-01", 
      organization: "ORG-A", 
      refNo1: "REF01", 
      refNo2: "", 
      active: true, 
      projectName: "Project Alpha", 
      accountName: "Labor Expense" 
    }
  ]);

  const activeRecord = records[currentIndex] || {};

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    const newRecord = { id: newId, project: "", account: "", organization: "", refNo1: "", refNo2: "", active: true, projectName: "", accountName: "" };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleNavigate = (dir) => {
    if (dir === "next" && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
    if (dir === "prev" && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    if (dir === "start") setCurrentIndex(0);
    if (dir === "end") setCurrentIndex(records.length - 1);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Link2} title="Link Projects/Accounts/Organizations">
        <Toolbar 
          isFormView={isFormView}
          currentIndex={currentIndex}
          totalRecords={records.length}
          handleNavigate={handleNavigate}
          actions={{
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: handleAdd,
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {},
            onQuery: () => {}
          }}
        />

        <div className="mt-2">
          {isFormView ? (
            <FormSection title="Identification">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                <FormInput 
                  label="Project" 
                  value={activeRecord.project || ""} 
                  onChange={(e) => handleFieldChange(activeRecord.id, "project", e.target.value)} 
                />
                <FormInput 
                  label="Account *" 
                  value={activeRecord.account || ""} 
                  onChange={(e) => handleFieldChange(activeRecord.id, "account", e.target.value)} 
                />
                <FormInput 
                  label="Organization *" 
                  value={activeRecord.organization || ""} 
                  onChange={(e) => handleFieldChange(activeRecord.id, "organization", e.target.value)} 
                />
                <FormInput 
                  label="Ref No 1" 
                  value={activeRecord.refNo1 || ""} 
                  onChange={(e) => handleFieldChange(activeRecord.id, "refNo1", e.target.value)} 
                />
                <FormInput 
                  label="Ref No 2" 
                  value={activeRecord.refNo2 || ""} 
                  onChange={(e) => handleFieldChange(activeRecord.id, "refNo2", e.target.value)} 
                />
                <FormInput 
                  label="Active" 
                  type="checkbox"
                  checked={activeRecord.active} 
                  onChange={(e) => handleFieldChange(activeRecord.id, "active", e.target.checked)} 
                />
                <FormInput 
                  label="Project Name" 
                  value={activeRecord.projectName || ""} 
                  onChange={(e) => handleFieldChange(activeRecord.id, "projectName", e.target.value)} 
                />
                <FormInput 
                  label="Account Name" 
                  value={activeRecord.accountName || ""} 
                  onChange={(e) => handleFieldChange(activeRecord.id, "accountName", e.target.value)} 
                />
              </div>
            </FormSection>
          ) : (
            <SecondaryContainer title="">
              <ReusableTable 
                data={records} 
                columns={columns} 
                onFieldChange={handleFieldChange} 
              />
            </SecondaryContainer>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default LinkProjectsAccountsOrganizations;
