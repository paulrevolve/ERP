import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput, ActionDetailButton } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Layers } from "lucide-react";

const columnsAccounts = [
  { id: "account", key: "account", label: "Account" },
  { id: "accountName", key: "accountName", label: "Account Name" }
];

const columnsOrgs = [
  { id: "organization", key: "organization", label: "Organization" },
  { id: "organizationName", key: "organizationName", label: "Organization Name" }
];

const columnsSelected = [
  { id: "account", key: "account", label: "Account *" },
  { id: "organization", key: "organization", label: "Organization *" },
  { id: "active", key: "active", label: "Active", type: "checkbox" },
  { id: "refNo1", key: "refNo1", label: "Ref No 1" },
  { id: "refNo2", key: "refNo2", label: "Ref No 2" },
  { id: "accountName", key: "accountName", label: "Account Name" },
  { id: "organizationName", key: "organizationName", label: "Organization Name" }
];

const MassLinkProjectsAccountsOrganizations = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [formData, setFormData] = useState({ project: "", level: "", accountGroup: "" });
  
  const [accounts] = useState([
    { id: "a1", account: "600-01", accountName: "Labor Expense" },
    { id: "a2", account: "600-02", accountName: "Travel Expense" }
  ]);
  
  const [organizations] = useState([
    { id: "o1", organization: "ORG-001", organizationName: "North Division" },
    { id: "o2", organization: "ORG-002", organizationName: "South Division" }
  ]);
  
  const [selectedLinks, setSelectedLinks] = useState([]);

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Layers} title="Mass Link Projects/Accounts/Organizations">
        <Toolbar 
          isFormView={isFormView}
          actions={{
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: () => {},
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {}
          }}
        />

        <div className="mt-2 space-y-4">
          <FormSection title="Identification">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormInput 
                label="Project" 
                value={formData.project} 
                onChange={(e) => setFormData({ ...formData, project: e.target.value })} 
              />
              <FormInput 
                label="Level" 
                value={formData.level} 
                onChange={(e) => setFormData({ ...formData, level: e.target.value })} 
              />
              <FormInput 
                label="Account Group" 
                value={formData.accountGroup} 
                onChange={(e) => setFormData({ ...formData, accountGroup: e.target.value })} 
              />
            </div>
          </FormSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SecondaryContainer title="Mass Link Proj/Acct/Org">
              <div className="flex justify-between items-center mb-2 px-2">
                <Toolbar isTableOnly actions={{ onAdd: () => {}, onDelete: () => {}, onQuery: () => {} }} />
                <ActionDetailButton label="Select" onClick={() => {}} />
              </div>
              <ReusableTable 
                data={accounts} 
                columns={columnsAccounts} 
                onFieldChange={() => {}} 
              />
            </SecondaryContainer>

            <SecondaryContainer title="Organizations">
              <Toolbar isTableOnly actions={{ onQuery: () => {} }} />
              <ReusableTable 
                data={organizations} 
                columns={columnsOrgs} 
                onFieldChange={() => {}} 
              />
            </SecondaryContainer>
          </div>

          <SecondaryContainer title="Selected Accounts/Organizations">
            <Toolbar isTableOnly actions={{ onNew: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
            <ReusableTable 
              data={selectedLinks} 
              columns={columnsSelected} 
              onFieldChange={() => {}} 
            />
          </SecondaryContainer>
        </div>
      </MainContainer>
    </div>
  );
};

export default MassLinkProjectsAccountsOrganizations;
