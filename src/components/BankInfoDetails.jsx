// import React, { useState, useEffect } from "react";
// import { FormInput, FormSection } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";

// export const bankInfoColumns = [
//   { value: "rank", label: "Rank *", key: "rank", id: "rank" },
//   { value: "bank", label: "Bank", key: "bank", id: "bank" },
//   { value: "bankName", label: "Bank Name", key: "bankName", id: "bankName" },
//   { value: "bankAccountNumber", label: "Bank Account Number", key: "bankAccountNumber", id: "bankAccountNumber" },
//   { value: "achTransCode", label: "ACH Trans Code", key: "achTransCode", id: "achTransCode" },
//   { value: "accountType", label: "Account Type *", key: "accountType", id: "accountType", type: "select" },
//   { value: "method", label: "Method *", key: "method", id: "method", type: "select" },
//   { value: "percentOrAmount", label: "Percent or Amount *", key: "percentOrAmount", id: "percentOrAmount" },
// ];

// const BankInfoDetailsTab = ({ data, onChange, isFormView, setConfig, filteredData, currentIndex = 0 }) => {
//   const [activeSubTab, setActiveSubTab] = useState("Pending Bank Acct");
//   const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  
//   // Distinguish between active and pending records if needed, 
//   // but for now following the pattern of one list per tab
//   const records = filteredData || (data.bankInfoRecords || []);
//   const activeRecord = records[currentIndex] || {};

//   useEffect(() => {
//     if (setConfig) {
//       setConfig({ 
//         key: "bankInfoRecords", 
//         cols: bankInfoColumns 
//       });
//     }
//   }, [setConfig]);

//   if (!isFormView) {
//     return (
//       <div className="p-2 space-y-4">
//         <div className="flex border-b border-gray-200 mb-2">
//           {["Pending Bank Acct", "Active Bank Acct"].map(tab => (
//             <button
//               key={tab}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setActiveSubTab(tab);
//               }}
//               className={`px-4 py-1 text-[10px] font-bold uppercase transition-all ${activeSubTab === tab ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-500 hover:text-[#17414d]"}`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//         <ReusableTable 
//           data={records.filter(r => activeSubTab === "Active Bank Acct" ? r.isActive : !r.isActive)} 
//           columns={bankInfoColumns} 
//           onFieldChange={(rowId, field, value) => {
//             const updated = records.map(r => 
//               (r.tempId || r.id || r.rank) === rowId ? { ...r, [field]: value, isDirty: true } : r
//             );
//             onChange(currentKey, 'bankInfoRecords', updated);
//           }} 
//           maxHeight="max-h-48" 
//         />
//       </div>
//     );
//   }

//   const handleFieldChange = (field, value) => {
//     const updated = [...records];
//     if (updated.length === 0) {
//       updated.push({ [field]: value, isDirty: true });
//     } else {
//       updated[currentIndex] = { ...updated[currentIndex], [field]: value, isDirty: true };
//     }
//     onChange(currentKey, 'bankInfoRecords', updated);
//   };

//   return (
//     <div className="p-2 space-y-4">
//       {/* Top Form Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <FormSection title="Active Bank Accounts">
//           <div className="space-y-1">
//             <FormInput 
//               label="Active" 
//               type="checkbox" 
//               checked={!!data.bankActiveFl} 
//               onChange={(e) => onChange(currentKey, 'bankActiveFl', e.target.checked)} 
//             />
//             <FormInput 
//               label="Mail Direct Deposit Advice" 
//               type="checkbox" 
//               checked={!!data.mailDirectDepositAdviceFl} 
//               onChange={(e) => onChange(currentKey, 'mailDirectDepositAdviceFl', e.target.checked)} 
//             />
//             <FormInput 
//               label="Active Residual Account Rank Number *" 
//               type="select" 
//               value={data.activeResidualRank || "1"} 
//               onChange={(e) => onChange(currentKey, 'activeResidualRank', e.target.value)} 
//               options={[{value: "1", label: "1"}]}
//             />
//           </div>
//         </FormSection>

//         <FormSection title="Pending Bank Accounts">
//           <div className="space-y-1">
//             <FormInput 
//               label="Direct Deposit File Created" 
//               type="checkbox" 
//               checked={!!data.directDepositFileCreatedFl} 
//               onChange={(e) => onChange(currentKey, 'directDepositFileCreatedFl', e.target.checked)} 
//             />
//             <FormInput 
//               label="Pending Residual Account Rank Number" 
//               type="select" 
//               value={data.pendingResidualRank || "-None-"} 
//               onChange={(e) => onChange(currentKey, 'pendingResidualRank', e.target.value)} 
//               options={[{value: "-None-", label: "-None-"}]}
//             />
//           </div>
//         </FormSection>
//       </div>

//       {/* Sub Tabs */}
//       <div className="mt-4">
//         <div className="flex border-b border-gray-200 mb-2">
//           {["Pending Bank Acct", "Active Bank Acct"].map(tab => (
//             <button
//               key={tab}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setActiveSubTab(tab);
//               }}
//               className={`px-4 py-1 text-[10px] font-bold uppercase transition-all ${activeSubTab === tab ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-500 hover:text-[#17414d]"}`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
//           <FormInput label="Rank *" value={activeRecord.rank || ""} onChange={(e) => handleFieldChange('rank', e.target.value)} />
//           <FormInput label="Bank" value={activeRecord.bank || ""} onChange={(e) => handleFieldChange('bank', e.target.value)} />
//           <FormInput label="Bank Name" value={activeRecord.bankName || ""} onChange={(e) => handleFieldChange('bankName', e.target.value)} />
//           <FormInput label="Bank Account Number" value={activeRecord.bankAccountNumber || ""} onChange={(e) => handleFieldChange('bankAccountNumber', e.target.value)} />
//           <FormInput label="ACH Trans Code" value={activeRecord.achTransCode || ""} onChange={(e) => handleFieldChange('achTransCode', e.target.value)} />
//           <FormInput label="Account Type *" type="select" value={activeRecord.accountType || ""} onChange={(e) => handleFieldChange('accountType', e.target.value)} options={[]} />
//           <FormInput label="Method *" type="select" value={activeRecord.method || ""} onChange={(e) => handleFieldChange('method', e.target.value)} options={[]} />
//           <FormInput label="Percent or Amount *" value={activeRecord.percentOrAmount || ""} onChange={(e) => handleFieldChange('percentOrAmount', e.target.value)} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BankInfoDetailsTab;

import React, { useState, useEffect } from "react";
import { FormInput, FormSection } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { SecondaryContainer } from "../helper/container";

import PendingBankAcct from "./PendingBankAcct";
import ActiveBankAcct from "./ActiveBankAcct";

export const bankInfoColumns = [
  { value: "rank", label: "Rank *", key: "rank", id: "rank" },
  { value: "bank", label: "Bank", key: "bank", id: "bank" },
  { value: "bankName", label: "Bank Name", key: "bankName", id: "bankName" },
  { value: "bankAccountNumber", label: "Bank Account Number", key: "bankAccountNumber", id: "bankAccountNumber" },
  { value: "achTransCode", label: "ACH Trans Code", key: "achTransCode", id: "achTransCode" },
  { value: "accountType", label: "Account Type *", key: "accountType", id: "accountType", type: "select" },
  { value: "method", label: "Method *", key: "method", id: "method", type: "select" },
  { value: "percentOrAmount", label: "Percent or Amount *", key: "percentOrAmount", id: "percentOrAmount" },
];

const BankInfoDetailsTab = ({ data, onChange, isFormView, setConfig, filteredData, currentIndex = 0, selectedRows, setSelectedRows }) => {
  const [showPending, setShowPending] = useState(false);
  const [showActive, setShowActive] = useState(false);

  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = filteredData || (data.bankInfoRecords || []);

  useEffect(() => {
    if (setConfig) {
      setConfig({ 
        key: "bankInfoRecords", 
        cols: bankInfoColumns 
      });
    }
  }, [setConfig]);

  if (!isFormView) {
    return (
      <div className="flex flex-col gap-4">
        <div className="p-2">
          <ReusableTable 
            data={records} 
            columns={bankInfoColumns} 
            onFieldChange={(rowId, field, value) => {
              const updated = records.map(r => 
                (r.tempId || r.id || r.rank) === rowId ? { ...r, [field]: value, isDirty: true } : r
              );
              onChange(currentKey, 'bankInfoRecords', updated);
            }} 
            maxHeight="max-h-48"
            selectedRows={selectedRows}
            onRowSelect={(item) => {
              const rowKey = String(item?.tempId || item?.id || item?.rank || "");
              const newSelected = new Set(selectedRows);
              if (newSelected.has(rowKey)) newSelected.delete(rowKey);
              else newSelected.add(rowKey);
              if (setSelectedRows) setSelectedRows(newSelected);
            }}
            onSelectAll={(e) => {
              if (e.target.checked) {
                if (setSelectedRows) setSelectedRows(new Set(records.map(r => String(r?.tempId || r?.id || r?.rank || ""))));
              } else {
                if (setSelectedRows) setSelectedRows(new Set());
              }
            }}
          />
          <div className="flex mt-4 gap-2">
            {!showPending && (
              <button 
                onClick={() => setShowPending(true)}
                className="px-3 py-1 bg-[#eef6fc] text-[#17414d] border border-[#c5d9eb] rounded text-[10px] font-bold hover:bg-[#dbeafe] transition-colors whitespace-nowrap"
              >
                Pending Bank Acct
              </button>
            )}
            {!showActive && (
              <button 
                onClick={() => setShowActive(true)}
                className="px-3 py-1 bg-[#eef6fc] text-[#17414d] border border-[#c5d9eb] rounded text-[10px] font-bold hover:bg-[#dbeafe] transition-colors whitespace-nowrap"
              >
                Active Bank Acct
              </button>
            )}
          </div>
        </div>
        {showPending && (
          <SecondaryContainer title="Pending Bank Acct" handleClose={() => setShowPending(false)}>
            <PendingBankAcct 
              data={data} 
              onChange={onChange} 
              currentKey={currentKey} 
            />
          </SecondaryContainer>
        )}
        {showActive && (
          <SecondaryContainer title="Active Bank Acct" handleClose={() => setShowActive(false)}>
            <ActiveBankAcct 
              data={data} 
              onChange={onChange} 
              currentKey={currentKey} 
            />
          </SecondaryContainer>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="p-2 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm">
        {/* Top Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSection title="Active Bank Accounts">
            <div className="space-y-1">
              <FormInput 
                label="Active" 
                type="checkbox" 
                checked={!!data.bankActiveFl} 
                onChange={(e) => onChange(currentKey, 'bankActiveFl', e.target.checked)} 
              />
              <FormInput 
                label="Mail Direct Deposit Advice" 
                type="checkbox" 
                checked={!!data.mailDirectDepositAdviceFl} 
                onChange={(e) => onChange(currentKey, 'mailDirectDepositAdviceFl', e.target.checked)} 
              />
              <FormInput 
                label="Active Residual Account Rank Number *" 
                type="select" 
                value={data.activeResidualRank || "1"} 
                onChange={(e) => onChange(currentKey, 'activeResidualRank', e.target.value)} 
                options={[{value: "1", label: "1"}]}
              />
            </div>
          </FormSection>

          <FormSection title="Pending Bank Accounts">
            <div className="space-y-1">
              <FormInput 
                label="Direct Deposit File Created" 
                type="checkbox" 
                checked={!!data.directDepositFileCreatedFl} 
                onChange={(e) => onChange(currentKey, 'directDepositFileCreatedFl', e.target.checked)} 
              />
              <FormInput 
                label="Pending Residual Account Rank Number" 
                type="select" 
                value={data.pendingResidualRank || "-None-"} 
                onChange={(e) => onChange(currentKey, 'pendingResidualRank', e.target.value)} 
                options={[{value: "-None-", label: "-None-"}]}
              />
            </div>
          </FormSection>
        </div>

        <div className="flex mt-2 px-1 pb-2 gap-2">
          {!showPending && (
            <button 
              onClick={() => setShowPending(true)}
              className="px-3 py-1 bg-[#eef6fc] text-[#17414d] border border-[#c5d9eb] rounded text-[10px] font-bold hover:bg-[#dbeafe] transition-colors whitespace-nowrap"
            >
              Pending Bank Acct
            </button>
          )}
          {!showActive && (
            <button 
              onClick={() => setShowActive(true)}
              className="px-3 py-1 bg-[#eef6fc] text-[#17414d] border border-[#c5d9eb] rounded text-[10px] font-bold hover:bg-[#dbeafe] transition-colors whitespace-nowrap"
            >
              Active Bank Acct
            </button>
          )}
        </div>
      </div>
      
      {showPending && (
        <SecondaryContainer title="Pending Bank Acct" handleClose={() => setShowPending(false)}>
          <PendingBankAcct 
            data={data} 
            onChange={onChange} 
            currentKey={currentKey} 
          />
        </SecondaryContainer>
      )}
      {showActive && (
        <SecondaryContainer title="Active Bank Acct" handleClose={() => setShowActive(false)}>
          <ActiveBankAcct 
            data={data} 
            onChange={onChange} 
            currentKey={currentKey} 
          />
        </SecondaryContainer>
      )}
    </div>
  );
};

export default BankInfoDetailsTab;
