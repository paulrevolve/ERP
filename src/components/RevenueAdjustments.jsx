// // import React, { useState } from "react";
// // import { FormSection, FormInput } from "../helper/formSection";
// // import { ReusableTable } from "../helper/tableSection";
// // import { Toolbar } from "../helper/container";

// // const revenueAdjustmentsColumns = [
// //   { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
// //   { id: "period", key: "period", label: "Period *" },
// //   { id: "subperiod", key: "subperiod", label: "Subperiod *" },
// //   { id: "revenueAdjustmentAmount", key: "revenueAdjustmentAmount", label: "Revenue Adjustment Amount *" },
// //   { id: "awardFeeAdjustmentAmount", key: "awardFeeAdjustmentAmount", label: "Award Fee Adjustment Amount" },
// //   { id: "description", key: "description", label: "Description *" }
// // ];

// // const RevenueAdjustments = () => {
// //   const [isFormView, setIsFormView] = useState(false);
// //   const [records, setRecords] = useState([]);
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [selectedRows, setSelectedRows] = useState(new Set());

// //   const handleAdd = () => {
// //     const newRecord = {
// //       id: `NEW_${Date.now()}`,
// //       fiscalYear: "",
// //       period: "",
// //       subperiod: "",
// //       revenueAdjustmentAmount: "",
// //       awardFeeAdjustmentAmount: "",
// //       description: "",
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
// //         columns={revenueAdjustmentsColumns}
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
// //           columns={revenueAdjustmentsColumns} 
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
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //              <div className="flex gap-4">
// //                 <FormInput label="Fiscal Year *" value={activeRecord.fiscalYear} onChange={(e) => handleFieldChange(activeRecord.id, "fiscalYear", e.target.value)} />
// //                 <FormInput label="Period *" value={activeRecord.period} onChange={(e) => handleFieldChange(activeRecord.id, "period", e.target.value)} />
// //                 <FormInput label="Subperiod *" value={activeRecord.subperiod} onChange={(e) => handleFieldChange(activeRecord.id, "subperiod", e.target.value)} />
// //              </div>
// //              <div className="space-y-1">
// //                 <FormInput label="Revenue Adjustment Amount *" value={activeRecord.revenueAdjustmentAmount} onChange={(e) => handleFieldChange(activeRecord.id, "revenueAdjustmentAmount", e.target.value)} />
// //                 <FormInput label="Award Fee Adjustment Amount" value={activeRecord.awardFeeAdjustmentAmount} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeAdjustmentAmount", e.target.value)} />
// //              </div>
// //           </div>
// //           <div className="mt-4">
// //               <FormInput label="Description *" value={activeRecord.description} onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} />
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default RevenueAdjustments;

// import React, { useState } from "react";
// import { FormSection, FormInput } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { Toolbar } from "../helper/container";

// const revenueAdjustmentsColumns = [
//   { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
//   { id: "period", key: "period", label: "Period *" },
//   { id: "subperiod", key: "subperiod", label: "Subperiod *" },
//   { id: "revenueAdjustmentAmount", key: "revenueAdjustmentAmount", label: "Revenue Adjustment Amount *" },
//   { id: "awardFeeAdjustmentAmount", key: "awardFeeAdjustmentAmount", label: "Award Fee Adjustment Amount" },
//   { id: "description", key: "description", label: "Description *" }
// ];

// const RevenueAdjustments = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [records, setRecords] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedRows, setSelectedRows] = useState(new Set());

//   const handleAdd = () => {
//     const newRecord = {
//       id: `NEW_${Date.now()}`,
//       fiscalYear: "",
//       period: "",
//       subperiod: "",
//       revenueAdjustmentAmount: "",
//       awardFeeAdjustmentAmount: "",
//       description: "",
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
//         columns={revenueAdjustmentsColumns}
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
//           columns={revenueAdjustmentsColumns} 
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
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                 <FormInput label="Fiscal Year *" value={activeRecord.fiscalYear} onChange={(e) => handleFieldChange(activeRecord.id, "fiscalYear", e.target.value)} />
//                 <FormInput label="Period *" value={activeRecord.period} onChange={(e) => handleFieldChange(activeRecord.id, "period", e.target.value)} />
//                 <FormInput label="Subperiod *" value={activeRecord.subperiod} onChange={(e) => handleFieldChange(activeRecord.id, "subperiod", e.target.value)} />
//              </div>
//              <div className="space-y-1">
//                 <FormInput label="Revenue Adjustment Amount *" value={activeRecord.revenueAdjustmentAmount} onChange={(e) => handleFieldChange(activeRecord.id, "revenueAdjustmentAmount", e.target.value)} />
//                 <FormInput label="Award Fee Adjustment Amount" value={activeRecord.awardFeeAdjustmentAmount} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeAdjustmentAmount", e.target.value)} />
//              </div>
//           </div>
//           <div className="mt-4">
//               <FormInput label="Description *" value={activeRecord.description} onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RevenueAdjustments;

import React, { useState } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Toolbar } from "../helper/container";

const revenueAdjustmentsColumns = [
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
  { id: "period", key: "period", label: "Period *" },
  { id: "subperiod", key: "subperiod", label: "Subperiod *" },
  { id: "revenueAdjustmentAmount", key: "revenueAdjustmentAmount", label: "Revenue Adjustment Amount *" },
  { id: "awardFeeAdjustmentAmount", key: "awardFeeAdjustmentAmount", label: "Award Fee Adjustment Amount" },
  { id: "description", key: "description", label: "Description *" }
];

const RevenueAdjustments = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleAdd = () => {
    const newRecord = {
      id: `NEW_${Date.now()}`,
      fiscalYear: "",
      period: "",
      subperiod: "",
      revenueAdjustmentAmount: "",
      awardFeeAdjustmentAmount: "",
      description: "",
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
        columns={revenueAdjustmentsColumns}
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
          columns={revenueAdjustmentsColumns} 
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-1">
                <FormInput label="Fiscal Year *" value={activeRecord.fiscalYear} onChange={(e) => handleFieldChange(activeRecord.id, "fiscalYear", e.target.value)} />
                <FormInput label="Period *" value={activeRecord.period} onChange={(e) => handleFieldChange(activeRecord.id, "period", e.target.value)} />
                <FormInput label="Subperiod *" value={activeRecord.subperiod} onChange={(e) => handleFieldChange(activeRecord.id, "subperiod", e.target.value)} />
             </div>
             <div className="space-y-1">
                <FormInput label="Revenue Adjustment Amount *" value={activeRecord.revenueAdjustmentAmount} onChange={(e) => handleFieldChange(activeRecord.id, "revenueAdjustmentAmount", e.target.value)} />
                <FormInput label="Award Fee Adjustment Amount" value={activeRecord.awardFeeAdjustmentAmount} onChange={(e) => handleFieldChange(activeRecord.id, "awardFeeAdjustmentAmount", e.target.value)} />
             </div>
          </div>
          <div className="mt-4">
              <FormInput label="Description *" value={activeRecord.description} onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueAdjustments;
