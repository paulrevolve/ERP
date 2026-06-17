// // import React, { useState } from "react";
// // import { FormSection, FormInput } from "../helper/formSection";
// // import { ReusableTable } from "../helper/tableSection";
// // import { Toolbar } from "../helper/container";

// // const awardFeeColumns = [
// //   { id: "modId", key: "modId", label: "Mod ID" },
// //   { id: "description", key: "description", label: "Description *" },
// //   { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year" },
// //   { id: "period", key: "period", label: "Period" },
// //   { id: "subperiod", key: "subperiod", label: "Subperiod" },
// //   { id: "accrualMethod", key: "accrualMethod", label: "Accrual Method *" },
// //   { id: "awardFeeAccrualPct", key: "awardFeeAccrualPct", label: "Award Fee Accrual Pct" },
// //   { id: "contractAwardFee", key: "contractAwardFee", label: "Contract Award Fee" },
// //   { id: "fundedAwardFee", key: "fundedAwardFee", label: "Funded Award Fee" },
// //   { id: "awardFeeAccrualAmt", key: "awardFeeAccrualAmt", label: "Award Fee Accrual Amt" },
// //   { id: "awardFeeTgtAmt", key: "awardFeeTgtAmt", label: "Award Fee Tgt Amt" },
// //   { id: "awardFeeActAmt", key: "awardFeeActAmt", label: "Award Fee Act Amt" },
// //   { id: "start", key: "start", label: "Start", type: "date" },
// //   { id: "end", key: "end", label: "End", type: "date" }
// // ];

// // const AwardFee = () => {
// //   const [isFormView, setIsFormView] = useState(false);
// //   const [records, setRecords] = useState([]);
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [selectedRows, setSelectedRows] = useState(new Set());

// //   const handleAdd = () => {
// //     const newRecord = {
// //       id: `NEW_${Date.now()}`,
// //       modId: "",
// //       description: "",
// //       fiscalYear: "",
// //       period: "",
// //       subperiod: "",
// //       accrualMethod: "",
// //       awardFeeAccrualPct: "",
// //       contractAwardFee: "",
// //       fundedAwardFee: "",
// //       awardFeeAccrualAmt: "",
// //       awardFeeTgtAmt: "",
// //       awardFeeActAmt: "",
// //       start: "",
// //       end: "",
// //       isDirty: true
// //     };
// //     setRecords([newRecord, ...records]);
// //     setCurrentIndex(0);
// //     setIsFormView(true);
// //   };

// //   const handleFieldChange = (id, field, value) => {
// //     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
// //   };

// //   const activeRecord = records[currentIndex] || {};

// //   return (
// //     <div className="flex flex-col gap-4">
// //       <Toolbar 
// //         isFormView={isFormView}
// //         columns={awardFeeColumns}
// //         totalRecords={records.length}
// //         currentIndex={currentIndex}
// //         handleNavigate={(dir) => {
// //           if (dir === 'next') setCurrentIndex(i => Math.min(i + 1, records.length - 1));
// //           if (dir === 'prev') setCurrentIndex(i => Math.max(i - 1, 0));
// //         }}
// //         actions={{
// //           onToggleView: () => setIsFormView(!isFormView),
// //           onAdd: handleAdd,
// //           onSave: () => {},
// //           onDelete: () => {},
// //           onCopy: () => {},
// //           onPaste: () => {},
// //           onClear: () => {}
// //         }}
// //       />
      
// //       {!isFormView ? (
// //         <ReusableTable 
// //           data={records} 
// //           columns={awardFeeColumns} 
// //           selectedRows={selectedRows}
// //           onRowSelect={(row) => {
// //             const newSet = new Set(selectedRows);
// //             if (newSet.has(row.id)) newSet.delete(row.id);
// //             else newSet.add(row.id);
// //             setSelectedRows(newSet);
// //           }}
// //           onSelectAll={(e) => {
// //             if (e.target.checked) setSelectedRows(new Set(records.map(r => r.id)));
// //             else setSelectedRows(new Set());
// //           }}
// //           onFieldChange={handleFieldChange}
// //           rowKey="id"
// //         />
// //       ) : (
// //         <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             <div className="space-y-1">
// //               <FormInput label="Mod ID" value={activeRecord.modId} onChange={(e) => handleFieldChange(activeRecord.id, "modId", e.target.value)} />
// //               <FormInput label="Fiscal Year" value={activeRecord.fiscalYear} onChange={(e) => handleFieldChange(activeRecord.id, "fiscalYear", e.target.value)} />
// //               <FormInput label="Accrual Method *" value={activeRecord.accrualMethod} onChange={(e) => handleFieldChange(activeRecord.id, "accrualMethod", e.target.value)} />
// //               <FormInput label="Contract Award Fee" value={activeRecord.contractAwardFee} onChange={(e) => handleFieldChange(activeRecord.id, "contractAwardFee", e.target.value)} />
// //               <FormInput label="Award Fee Tgt Amt" value={activeRecord.awardFeeTgtAmt} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeTgtAmt", e.target.value)} />
// //             </div>
// //             <div className="space-y-1">
// //               <FormInput label="Description *" value={activeRecord.description} onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} />
// //               <FormInput label="Period" value={activeRecord.period} onChange={(e) => handleFieldChange(activeRecord.id, "period", e.target.value)} />
// //               <FormInput label="Subperiod" value={activeRecord.subperiod} onChange={(e) => handleFieldChange(activeRecord.id, "subperiod", e.target.value)} />
// //               <FormInput label="Award Fee Accrual Pct" value={activeRecord.awardFeeAccrualPct} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeAccrualPct", e.target.value)} />
// //               <FormInput label="Funded Award Fee" value={activeRecord.fundedAwardFee} onChange={(e) => handleFieldChange(activeRecord.id, "fundedAwardFee", e.target.value)} />
// //               <FormInput label="Award Fee Act Amt" value={activeRecord.awardFeeActAmt} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeActAmt", e.target.value)} />
// //             </div>
// //             <div className="space-y-1">
// //                <div className="flex gap-2">
// //                  <FormInput label="Start" type="date" value={activeRecord.start} onChange={(e) => handleFieldChange(activeRecord.id, "start", e.target.value)} />
// //                  <FormInput label="End" type="date" value={activeRecord.end} onChange={(e) => handleFieldChange(activeRecord.id, "end", e.target.value)} />
// //                </div>
// //                <FormInput label="Award Fee Accrual Amt" value={activeRecord.awardFeeAccrualAmt} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeAccrualAmt", e.target.value)} />
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AwardFee;

// import React, { useState } from "react";
// import { FormSection, FormInput } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { Toolbar } from "../helper/container";

// const awardFeeColumns = [
//   { id: "modId", key: "modId", label: "Mod ID" },
//   { id: "description", key: "description", label: "Description *" },
//   { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year" },
//   { id: "period", key: "period", label: "Period" },
//   { id: "subperiod", key: "subperiod", label: "Subperiod" },
//   { id: "accrualMethod", key: "accrualMethod", label: "Accrual Method *" },
//   { id: "awardFeeAccrualPct", key: "awardFeeAccrualPct", label: "Award Fee Accrual Pct" },
//   { id: "contractAwardFee", key: "contractAwardFee", label: "Contract Award Fee" },
//   { id: "fundedAwardFee", key: "fundedAwardFee", label: "Funded Award Fee" },
//   { id: "awardFeeAccrualAmt", key: "awardFeeAccrualAmt", label: "Award Fee Accrual Amt" },
//   { id: "awardFeeTgtAmt", key: "awardFeeTgtAmt", label: "Award Fee Tgt Amt" },
//   { id: "awardFeeActAmt", key: "awardFeeActAmt", label: "Award Fee Act Amt" },
//   { id: "start", key: "start", label: "Start", type: "date" },
//   { id: "end", key: "end", label: "End", type: "date" }
// ];

// const AwardFee = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [records, setRecords] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedRows, setSelectedRows] = useState(new Set());

//   const handleAdd = () => {
//     const newRecord = {
//       id: `NEW_${Date.now()}`,
//       modId: "",
//       description: "",
//       fiscalYear: "",
//       period: "",
//       subperiod: "",
//       accrualMethod: "",
//       awardFeeAccrualPct: "",
//       contractAwardFee: "",
//       fundedAwardFee: "",
//       awardFeeAccrualAmt: "",
//       awardFeeTgtAmt: "",
//       awardFeeActAmt: "",
//       start: "",
//       end: "",
//       isDirty: true
//     };
//     setRecords([newRecord, ...records]);
//     setCurrentIndex(0);
//   };

//   const handleFieldChange = (id, field, value) => {
//     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
//   };

//   const activeRecord = records[currentIndex] || {};

//   return (
//     <div className="flex flex-col gap-4">
//       <Toolbar 
//         isFormView={isFormView}
//         columns={awardFeeColumns}
//         totalRecords={records.length}
//         currentIndex={currentIndex}
//         handleNavigate={(dir) => {
//           if (dir === 'next') setCurrentIndex(i => Math.min(i + 1, records.length - 1));
//           if (dir === 'prev') setCurrentIndex(i => Math.max(i - 1, 0));
//         }}
//         actions={{
//           onToggleView: () => setIsFormView(!isFormView),
//           onAdd: handleAdd,
//           onSave: () => {},
//           onDelete: () => {},
//           onCopy: () => {},
//           onPaste: () => {},
//           onClear: () => {}
//         }}
//       />
      
//       {!isFormView ? (
//         <ReusableTable 
//           data={records} 
//           columns={awardFeeColumns} 
//           selectedRows={selectedRows}
//           onRowSelect={(row) => {
//             const newSet = new Set(selectedRows);
//             if (newSet.has(row.id)) newSet.delete(row.id);
//             else newSet.add(row.id);
//             setSelectedRows(newSet);
//           }}
//           onSelectAll={(e) => {
//             if (e.target.checked) setSelectedRows(new Set(records.map(r => r.id)));
//             else setSelectedRows(new Set());
//           }}
//           onFieldChange={handleFieldChange}
//           rowKey="id"
//         />
//       ) : (
//         <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="space-y-1">
//               <FormInput label="Mod ID" value={activeRecord.modId} onChange={(e) => handleFieldChange(activeRecord.id, "modId", e.target.value)} />
//               <FormInput label="Fiscal Year" value={activeRecord.fiscalYear} onChange={(e) => handleFieldChange(activeRecord.id, "fiscalYear", e.target.value)} />
//               <FormInput label="Accrual Method *" value={activeRecord.accrualMethod} onChange={(e) => handleFieldChange(activeRecord.id, "accrualMethod", e.target.value)} />
//               <FormInput label="Contract Award Fee" value={activeRecord.contractAwardFee} onChange={(e) => handleFieldChange(activeRecord.id, "contractAwardFee", e.target.value)} />
//               <FormInput label="Award Fee Tgt Amt" value={activeRecord.awardFeeTgtAmt} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeTgtAmt", e.target.value)} />
//             </div>
//             <div className="space-y-1">
//               <FormInput label="Description *" value={activeRecord.description} onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} />
//               <FormInput label="Period" value={activeRecord.period} onChange={(e) => handleFieldChange(activeRecord.id, "period", e.target.value)} />
//               <FormInput label="Subperiod" value={activeRecord.subperiod} onChange={(e) => handleFieldChange(activeRecord.id, "subperiod", e.target.value)} />
//               <FormInput label="Award Fee Accrual Pct" value={activeRecord.awardFeeAccrualPct} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeAccrualPct", e.target.value)} />
//               <FormInput label="Funded Award Fee" value={activeRecord.fundedAwardFee} onChange={(e) => handleFieldChange(activeRecord.id, "fundedAwardFee", e.target.value)} />
//               <FormInput label="Award Fee Act Amt" value={activeRecord.awardFeeActAmt} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeActAmt", e.target.value)} />
//             </div>
//             <div className="space-y-1">
//                <div className="grid grid-cols-2 gap-4">
//                  <FormInput label="Start" type="date" value={activeRecord.start} onChange={(e) => handleFieldChange(activeRecord.id, "start", e.target.value)} />
//                  <FormInput label="End" type="date" value={activeRecord.end} onChange={(e) => handleFieldChange(activeRecord.id, "end", e.target.value)} />
//                </div>
//                <FormInput label="Award Fee Accrual Amt" value={activeRecord.awardFeeAccrualAmt} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeAccrualAmt", e.target.value)} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AwardFee;

import React, { useState } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Toolbar } from "../helper/container";

const awardFeeColumns = [
  { id: "modId", key: "modId", label: "Mod ID" },
  { id: "description", key: "description", label: "Description *" },
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year" },
  { id: "period", key: "period", label: "Period" },
  { id: "subperiod", key: "subperiod", label: "Subperiod" },
  { id: "accrualMethod", key: "accrualMethod", label: "Accrual Method *" },
  { id: "awardFeeAccrualPct", key: "awardFeeAccrualPct", label: "Award Fee Accrual Pct" },
  { id: "contractAwardFee", key: "contractAwardFee", label: "Contract Award Fee" },
  { id: "fundedAwardFee", key: "fundedAwardFee", label: "Funded Award Fee" },
  { id: "awardFeeAccrualAmt", key: "awardFeeAccrualAmt", label: "Award Fee Accrual Amt" },
  { id: "awardFeeTgtAmt", key: "awardFeeTgtAmt", label: "Award Fee Tgt Amt" },
  { id: "awardFeeActAmt", key: "awardFeeActAmt", label: "Award Fee Act Amt" },
  { id: "start", key: "start", label: "Start Date", type: "date" },
  { id: "end", key: "end", label: "End Date", type: "date" }
];

const AwardFee = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleAdd = () => {
    const newRecord = {
      id: `NEW_${Date.now()}`,
      modId: "",
      description: "",
      fiscalYear: "",
      period: "",
      subperiod: "",
      accrualMethod: "",
      awardFeeAccrualPct: "",
      contractAwardFee: "",
      fundedAwardFee: "",
      awardFeeAccrualAmt: "",
      awardFeeTgtAmt: "",
      awardFeeActAmt: "",
      start: "",
      end: "",
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const activeRecord = records[currentIndex] || {};

  return (
    <div className="flex flex-col gap-4">
      <Toolbar 
        isFormView={isFormView}
        columns={awardFeeColumns}
        totalRecords={records.length}
        currentIndex={currentIndex}
        handleNavigate={(dir) => {
          if (dir === 'next') setCurrentIndex(i => Math.min(i + 1, records.length - 1));
          if (dir === 'prev') setCurrentIndex(i => Math.max(i - 1, 0));
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
      
      {!isFormView ? (
        <ReusableTable 
          data={records} 
          columns={awardFeeColumns} 
          selectedRows={selectedRows}
          onRowSelect={(row) => {
            const newSet = new Set(selectedRows);
            if (newSet.has(row.id)) newSet.delete(row.id);
            else newSet.add(row.id);
            setSelectedRows(newSet);
          }}
          onSelectAll={(e) => {
            if (e.target.checked) setSelectedRows(new Set(records.map(r => r.id)));
            else setSelectedRows(new Set());
          }}
          onFieldChange={handleFieldChange}
          rowKey="id"
        />
      ) : (
        <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <FormInput label="Mod ID" value={activeRecord.modId} onChange={(e) => handleFieldChange(activeRecord.id, "modId", e.target.value)} />
              <FormInput label="Fiscal Year" value={activeRecord.fiscalYear} onChange={(e) => handleFieldChange(activeRecord.id, "fiscalYear", e.target.value)} />
              <FormInput label="Accrual Method *" value={activeRecord.accrualMethod} onChange={(e) => handleFieldChange(activeRecord.id, "accrualMethod", e.target.value)} />
              <FormInput label="Contract Award Fee" value={activeRecord.contractAwardFee} onChange={(e) => handleFieldChange(activeRecord.id, "contractAwardFee", e.target.value)} />
              <FormInput label="Award Fee Tgt Amt" value={activeRecord.awardFeeTgtAmt} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeTgtAmt", e.target.value)} />
            </div>
            <div className="space-y-1">
              <FormInput label="Description *" value={activeRecord.description} onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} />
              <FormInput label="Period" value={activeRecord.period} onChange={(e) => handleFieldChange(activeRecord.id, "period", e.target.value)} />
              <FormInput label="Subperiod" value={activeRecord.subperiod} onChange={(e) => handleFieldChange(activeRecord.id, "subperiod", e.target.value)} />
              <FormInput label="Award Fee Accrual Pct" value={activeRecord.awardFeeAccrualPct} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeAccrualPct", e.target.value)} />
              <FormInput label="Funded Award Fee" value={activeRecord.fundedAwardFee} onChange={(e) => handleFieldChange(activeRecord.id, "fundedAwardFee", e.target.value)} />
              <FormInput label="Award Fee Act Amt" value={activeRecord.awardFeeActAmt} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeActAmt", e.target.value)} />
            </div>
            <div className="space-y-1">
               <FormInput label="Start Date" type="date" value={activeRecord.start} onChange={(e) => handleFieldChange(activeRecord.id, "start", e.target.value)} />
               <FormInput label="End Date" type="date" value={activeRecord.end} onChange={(e) => handleFieldChange(activeRecord.id, "end", e.target.value)} />
               <FormInput label="Award Fee Accrual Amt" value={activeRecord.awardFeeAccrualAmt} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeAccrualAmt", e.target.value)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardFee;
