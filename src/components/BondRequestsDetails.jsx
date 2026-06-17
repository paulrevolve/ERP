// // // // // import React, { useState } from "react";
// // // // // import { FormSection, FormInput } from "../helper/formSection";
// // // // // import { ReusableTable } from "../helper/tableSection";
// // // // // import { SecondaryContainer, Toolbar } from "../helper/container";
// // // // // import api from "../utils/api";
// // // // // import { backendUrl } from "./config";
// // // // // import { toast } from "react-toastify";

// // // // // export const bondRequestColumns = [
// // // // //   { value: "seqNum", label: "Sequence Number *", key: "seqNum", id: "seqNum" },
// // // // //   { value: "nextPurchaseFl", label: "Next Purchase", key: "nextPurchaseFl", id: "nextPurchaseFl", type: "checkbox" },
// // // // //   { value: "regType", label: "Registration Type *", key: "regType", id: "regType" },
// // // // //   { value: "bondSeries", label: "Bond Series *", key: "bondSeries", id: "bondSeries" },
// // // // //   { value: "faceValue", label: "Face Value *", key: "faceValue", id: "faceValue" },
// // // // //   { value: "purchasePrice", label: "Purchase Price", key: "purchasePrice", id: "purchasePrice" },
// // // // // ];

// // // // // const BondRequestsSection = ({ data, onChange, currentKey }) => {
// // // // //   const [isFormView, setIsFormView] = useState(false);
// // // // //   const [localIndex, setLocalIndex] = useState(0);
// // // // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // // // //   const [activeTab, setActiveTab] = useState("Bond Information");

// // // // //   const bondRequests = data.bondRequestRecords || [];
// // // // //   const activeRecord = bondRequests[localIndex] || {};

// // // // //   const handleToggleView = () => setIsFormView(!isFormView);

// // // // //   const handleAdd = () => {
// // // // //     const newRecord = { seqNum: "", isDirty: true, tempId: `NEW_BOND_REQ_${Date.now()}` };
// // // // //     const updated = [...bondRequests, newRecord];
// // // // //     onChange(currentKey, 'bondRequestRecords', updated);
// // // // //     setLocalIndex(updated.length - 1);
// // // // //     setIsFormView(true);
// // // // //   };

// // // // //   const handleDelete = () => {
// // // // //     if (selectedRows.size > 0) {
// // // // //       if (window.confirm("Are you sure you want to delete selected bond requests?")) {
// // // // //         const updated = bondRequests.filter(r => {
// // // // //           const id = r.tempId || r.id || r.seqNum;
// // // // //           return !selectedRows.has(id);
// // // // //         });
// // // // //         onChange(currentKey, 'bondRequestRecords', updated);
// // // // //         setSelectedRows(new Set());
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   const handleClear = () => {
// // // // //     if (window.confirm("Discard changes?")) {
// // // // //       // Clear logic handled by parent typically
// // // // //     }
// // // // //   };

// // // // //   const handleFieldChange = (field, value) => {
// // // // //     const updated = [...bondRequests];
// // // // //     if (updated.length === 0) {
// // // // //       updated.push({ [field]: value, isDirty: true });
// // // // //       setLocalIndex(0);
// // // // //     } else {
// // // // //       updated[localIndex] = { ...updated[localIndex], [field]: value, isDirty: true };
// // // // //     }
// // // // //     onChange(currentKey, 'bondRequestRecords', updated);
// // // // //   };

// // // // //   const handleRowSelect = (item) => {
// // // // //     const newSelected = new Set(selectedRows);
// // // // //     const id = item.tempId || item.id || item.seqNum;
// // // // //     if (newSelected.has(id)) newSelected.delete(id);
// // // // //     else newSelected.add(id);
// // // // //     setSelectedRows(newSelected);
// // // // //   };

// // // // //   const handleSelectAll = (isSelectAll, currentData) => {
// // // // //     if (isSelectAll) {
// // // // //       const newSelected = new Set(currentData.map(item => item.tempId || item.id || item.seqNum));
// // // // //       setSelectedRows(newSelected);
// // // // //     } else {
// // // // //       setSelectedRows(new Set());
// // // // //     }
// // // // //   };
  
// // // // //   const handleRecordChange = (rowId, field, value) => {
// // // // //     if (field === "DELETE_ROW") {
// // // // //       const updated = bondRequests.filter(r => (r.tempId || r.id || r.seqNum) !== rowId);
// // // // //       onChange(currentKey, 'bondRequestRecords', updated);
// // // // //       return;
// // // // //     }
// // // // //     const updated = bondRequests.map(r => 
// // // // //       (r.tempId || r.id || r.seqNum) === rowId ? { ...r, [field]: value, isDirty: true } : r
// // // // //     );
// // // // //     onChange(currentKey, 'bondRequestRecords', updated);
// // // // //   };

// // // // //   const renderTabContent = () => {
// // // // //     switch (activeTab) {
// // // // //       case "Bond Information":
// // // // //         return (
// // // // //           <div className="p-4 border border-gray-200 rounded-b-lg bg-white">
// // // // //             <FormSection title="Bond Information">
// // // // //               <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-2">
// // // // //                 <div className="flex items-center gap-2 h-6 mt-1 self-end">
// // // // //                   <input 
// // // // //                     type="checkbox" 
// // // // //                     checked={!!activeRecord.nextPurchaseFl} 
// // // // //                     onChange={(e) => handleFieldChange('nextPurchaseFl', e.target.checked)}
// // // // //                     className="h-4 w-4 accent-[#17414d] cursor-pointer"
// // // // //                   />
// // // // //                   <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Next Purchase</label>
// // // // //                 </div>
// // // // //                 <FormInput 
// // // // //                   label="Registration Type *" 
// // // // //                   value={activeRecord.regType || ""} 
// // // // //                   onChange={(e) => handleFieldChange('regType', e.target.value)} 
// // // // //                 />
// // // // //                 <FormInput 
// // // // //                   label="Face Value *" 
// // // // //                   value={activeRecord.faceValue || ""} 
// // // // //                   onChange={(e) => handleFieldChange('faceValue', e.target.value)} 
// // // // //                 />

// // // // //                 <div className="hidden md:block"></div>
// // // // //                 <FormInput 
// // // // //                   label="Bond Series *" 
// // // // //                   value={activeRecord.bondSeries || ""} 
// // // // //                   onChange={(e) => handleFieldChange('bondSeries', e.target.value)} 
// // // // //                 />
// // // // //                 <FormInput 
// // // // //                   label="Purchase Price" 
// // // // //                   value={activeRecord.purchasePrice || ""} 
// // // // //                   onChange={(e) => handleFieldChange('purchasePrice', e.target.value)} 
// // // // //                 />
// // // // //               </div>
// // // // //             </FormSection>
// // // // //           </div>
// // // // //         );
// // // // //       case "Mailing Address":
// // // // //         return (
// // // // //           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
// // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
// // // // //               <FormInput label="Name" value={activeRecord.mailName || ""} onChange={(e) => handleFieldChange('mailName', e.target.value)} />
// // // // //               <FormInput label="Line 1" value={activeRecord.mailLn1 || ""} onChange={(e) => handleFieldChange('mailLn1', e.target.value)} />
// // // // //               <FormInput label="Line 2" value={activeRecord.mailLn2 || ""} onChange={(e) => handleFieldChange('mailLn2', e.target.value)} />
// // // // //               <FormInput label="Line 3" value={activeRecord.mailLn3 || ""} onChange={(e) => handleFieldChange('mailLn3', e.target.value)} />
// // // // //               <FormInput label="City" value={activeRecord.mailCity || ""} onChange={(e) => handleFieldChange('mailCity', e.target.value)} />
// // // // //               <FormInput label="State" value={activeRecord.mailState || ""} onChange={(e) => handleFieldChange('mailState', e.target.value)} />
// // // // //               <FormInput label="Postal Code" value={activeRecord.mailZip || ""} onChange={(e) => handleFieldChange('mailZip', e.target.value)} />
// // // // //               <FormInput label="Country" value={activeRecord.mailCountry || ""} onChange={(e) => handleFieldChange('mailCountry', e.target.value)} />
// // // // //             </div>
// // // // //           </div>
// // // // //         );
// // // // //       case "Owner/Beneficiary":
// // // // //         return (
// // // // //           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
// // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
// // // // //               <FormInput label="Name" value={activeRecord.obName || ""} onChange={(e) => handleFieldChange('obName', e.target.value)} />
// // // // //               <FormInput label="SSN" value={activeRecord.obSsn || ""} onChange={(e) => handleFieldChange('obSsn', e.target.value)} />
// // // // //               <FormInput label="Relationship" value={activeRecord.obRel || ""} onChange={(e) => handleFieldChange('obRel', e.target.value)} />
// // // // //             </div>
// // // // //           </div>
// // // // //         );
// // // // //       default:
// // // // //         return null;
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="space-y-2">
// // // // //       <Toolbar 
// // // // //         title=" "
// // // // //         actions={{
// // // // //           onAdd: handleAdd,
// // // // //           onCopy: () => {},
// // // // //           onPaste: () => {},
// // // // //           onClear: handleClear,
// // // // //           onDelete: handleDelete,
// // // // //           onSave: () => {},
// // // // //           onToggleView: handleToggleView
// // // // //         }}
// // // // //         isFormView={isFormView}
// // // // //         isDirty={bondRequests.some(r => r.isDirty)}
// // // // //       />

// // // // //       {!isFormView ? (
// // // // //         <div className="p-2 border border-gray-100 rounded-b-lg bg-white">
// // // // //           <ReusableTable 
// // // // //             data={bondRequests} 
// // // // //             columns={bondRequestColumns} 
// // // // //             onFieldChange={handleRecordChange} 
// // // // //             selectedRows={selectedRows}
// // // // //             onRowSelect={handleRowSelect}
// // // // //             onSelectAll={handleSelectAll}
// // // // //             maxHeight="max-h-48" 
// // // // //           />
// // // // //         </div>
// // // // //       ) : (
// // // // //         <div className="p-2 space-y-4 bg-white border border-gray-100 rounded-b-lg">
// // // // //           <div className="px-1 mb-6 mt-2">
// // // // //             <FormInput 
// // // // //               label="Sequence Number *" 
// // // // //               value={activeRecord.seqNum || ""} 
// // // // //               onChange={(e) => handleFieldChange('seqNum', e.target.value)} 
// // // // //               className="w-1/4 bg-gray-100"
// // // // //             />
// // // // //           </div>

// // // // //           <div className="mt-4">
// // // // //             <div className="flex border-b border-gray-200 bg-gray-50/50">
// // // // //               {["Bond Information", "Mailing Address", "Owner/Beneficiary"].map((tab) => (
// // // // //                 <button
// // // // //                   key={tab}
// // // // //                   onClick={() => setActiveTab(tab)}
// // // // //                   className={`px-4 py-2 text-[10px] font-bold transition-all ${
// // // // //                     activeTab === tab ? "border-b-2 border-[#17414d] text-[#17414d] bg-white" : "text-gray-500 hover:text-[#17414d]"
// // // // //                   }`}
// // // // //                 >
// // // // //                   {tab}
// // // // //                 </button>
// // // // //               ))}
// // // // //             </div>
// // // // //             {renderTabContent()}
// // // // //           </div>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default BondRequestsSection;

// // // // import React, { useState } from "react";
// // // // import { FormSection, FormInput } from "../helper/formSection";
// // // // import { ReusableTable } from "../helper/tableSection";
// // // // import { SecondaryContainer, Toolbar } from "../helper/container";
// // // // import api from "../utils/api";
// // // // import { backendUrl } from "./config";
// // // // import { toast } from "react-toastify";

// // // // export const bondRequestColumns = [
// // // //   { value: "seqNum", label: "Sequence Number *", key: "seqNum", id: "seqNum" },
// // // //   { value: "nextPurchaseFl", label: "Next Purchase", key: "nextPurchaseFl", id: "nextPurchaseFl", type: "checkbox" },
// // // //   { value: "regType", label: "Registration Type *", key: "regType", id: "regType" },
// // // //   { value: "bondSeries", label: "Bond Series *", key: "bondSeries", id: "bondSeries" },
// // // //   { value: "faceValue", label: "Face Value *", key: "faceValue", id: "faceValue" },
// // // //   { value: "purchasePrice", label: "Purchase Price", key: "purchasePrice", id: "purchasePrice" },
// // // // ];

// // // // const BondRequestsSection = ({ data, onChange, currentKey, activeSavingBond }) => {
// // // //   const [isFormView, setIsFormView] = useState(false);
// // // //   const [localIndex, setLocalIndex] = useState(0);
// // // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // // //   const [activeTab, setActiveTab] = useState("Bond Information");

// // // //   const bondRequests = data.bondRequestRecords || [];
// // // //   const activeRecord = bondRequests[localIndex] || {};

// // // //   const fetchBondRequests = async () => {
// // // //     const emplId = data?.emplId;
// // // //     if (!emplId) return;
// // // //     try {
// // // //       const res = await api.get(`${backendUrl}/api/empl-bond-ln2`);
// // // //       const fetched = Array.isArray(res.data) ? res.data.filter(r => String(r.emplId) === String(emplId)) : [];
// // // //       onChange(currentKey, 'bondRequestRecords', fetched.map(item => ({
// // // //          ...item,
// // // //          isDirty: false,
// // // //          seqNum: item.seqNo,
// // // //          nextPurchaseFl: item.nextPurchFl,
// // // //          regType: item.regType,
// // // //          bondSeries: item.bondSeries,
// // // //          faceValue: item.bondFaceAmt,
// // // //          purchasePrice: item.bondCostAmt,
// // // //          mailName: item.designeeName,
// // // //          mailLn1: item.ln1Adr,
// // // //          mailLn2: item.ln2Adr,
// // // //          mailLn3: item.ln3Adr,
// // // //          mailCity: item.cityName,
// // // //          mailState: item.mailStDc,
// // // //          mailZip: item.postalCd,
// // // //          obName: item.bondOwnerNm,
// // // //          obSsn: item.bondOwnerSsn,
// // // //          obRel: item.beneficiaryNm
// // // //       })));
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       toast.error("Failed to fetch bond requests.");
// // // //     }
// // // //   };

// // // //   React.useEffect(() => {
// // // //     fetchBondRequests();
// // // //   }, [data?.emplId]);

// // // //   const handleToggleView = () => setIsFormView(!isFormView);

// // // //   const handleAdd = () => {
// // // //     const newRecord = { seqNum: "", isDirty: true, tempId: `NEW_BOND_REQ_${Date.now()}` };
// // // //     const updated = [...bondRequests, newRecord];
// // // //     onChange(currentKey, 'bondRequestRecords', updated);
// // // //     setLocalIndex(updated.length - 1);
// // // //     setIsFormView(true);
// // // //   };

// // // //   const handleDelete = async () => {
// // // //     if (selectedRows.size > 0) {
// // // //       if (window.confirm("Are you sure you want to delete selected bond requests?")) {
// // // //         const emplId = data?.emplId;
// // // //         const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
// // // //         if (!emplId || !dedCd) {
// // // //           toast.error("Please select a Saving Bond first.");
// // // //           return;
// // // //         }
// // // //         try {
// // // //           for (const id of selectedRows) {
// // // //             const record = bondRequests.find(r => (r.tempId || r.id || r.seqNum) === id);
// // // //             if (record && !String(id).startsWith("NEW_")) {
// // // //               await api.delete(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${record.bondLnKey || 0}`);
// // // //             }
// // // //           }
// // // //           toast.success("Bond requests deleted successfully.");
// // // //           fetchBondRequests();
// // // //           setSelectedRows(new Set());
// // // //         } catch (err) {
// // // //           toast.error("Failed to delete bond requests.");
// // // //         }
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleClear = () => {
// // // //     if (window.confirm("Discard changes?")) {
// // // //       fetchBondRequests();
// // // //     }
// // // //   };

// // // //   const handleSave = async () => {
// // // //     const emplId = data?.emplId;
// // // //     const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
// // // //     if (!emplId || !dedCd) {
// // // //       toast.error("Please select a valid Saving Bond to add requests to.");
// // // //       return;
// // // //     }
// // // //     const dirtyRecords = bondRequests.filter(r => r.isDirty);
// // // //     if(dirtyRecords.length === 0) {
// // // //        toast.info("No changes to save");
// // // //        return;
// // // //     }

// // // //     try {
// // // //       for (const record of dirtyRecords) {
// // // //         const payload = {
// // // //           emplId: String(emplId),
// // // //           dedCd: String(dedCd),
// // // //           bondLnKey: record.bondLnKey || 0,
// // // //           seqNo: Number(record.seqNum) || 0,
// // // //           nextPurchFl: record.nextPurchaseFl === 'Y' ? 'Y' : 'N',
// // // //           emplIsOwnerFl: record.emplIsOwnerFl || "N",
// // // //           regType: record.regType || "",
// // // //           bondOwnerNm: record.obName || "",
// // // //           bondOwnerSsn: record.obSsn || "",
// // // //           coownerNm: record.coownerNm || "",
// // // //           emplIsBenFl: record.emplIsBenFl || "N",
// // // //           beneficiaryNm: record.obRel || "",
// // // //           bondSeries: record.bondSeries || "",
// // // //           bondFaceAmt: Number(record.faceValue) || 0,
// // // //           bondCostAmt: Number(record.purchasePrice) || 0,
// // // //           useEmplAddrFl: record.useEmplAddrFl || "N",
// // // //           designeeName: record.mailName || "",
// // // //           ln1Adr: record.mailLn1 || "",
// // // //           ln2Adr: record.mailLn2 || "",
// // // //           ln3Adr: record.mailLn3 || "",
// // // //           cityName: record.mailCity || "",
// // // //           mailStDc: record.mailState || "",
// // // //           postalCd: record.mailZip || "",
// // // //           modifiedBy: "SystemUser",
// // // //           timeStamp: new Date().toISOString(),
// // // //           rowVersion: record.rowVersion || 0,
// // // //           header: {
// // // //             emplId: String(emplId),
// // // //             dedCd: String(dedCd),
// // // //             emplBondEffDt: activeSavingBond?.effDate || activeSavingBond?.emplBondEffDt || new Date().toISOString(),
// // // //             bondBegBal: Number(activeSavingBond?.begBalance || activeSavingBond?.bondBegBal) || 0,
// // // //             modifiedBy: "SystemUser",
// // // //             timeStamp: new Date().toISOString(),
// // // //             rowVersion: activeSavingBond?.rowVersion || 0
// // // //           }
// // // //         };

// // // //         if (record.tempId && String(record.tempId).startsWith("NEW_")) {
// // // //           await api.post(`${backendUrl}/api/empl-bond-ln2`, payload);
// // // //         } else {
// // // //           await api.put(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${payload.bondLnKey}`, payload);
// // // //         }
// // // //       }
// // // //       toast.success("Bond requests saved successfully.");
// // // //       fetchBondRequests();
// // // //     } catch (err) {
// // // //       toast.error(err.response?.data?.title || "Failed to save bond requests.");
// // // //     }
// // // //   };

// // // //   const handleFieldChange = (field, value) => {
// // // //     const updated = [...bondRequests];
// // // //     if (updated.length === 0) {
// // // //       updated.push({ [field]: value, isDirty: true });
// // // //       setLocalIndex(0);
// // // //     } else {
// // // //       updated[localIndex] = { ...updated[localIndex], [field]: value, isDirty: true };
// // // //     }
// // // //     onChange(currentKey, 'bondRequestRecords', updated);
// // // //   };

// // // //   const handleRowSelect = (item) => {
// // // //     const newSelected = new Set(selectedRows);
// // // //     const id = item.tempId || item.id || item.seqNum;
// // // //     if (newSelected.has(id)) newSelected.delete(id);
// // // //     else newSelected.add(id);
// // // //     setSelectedRows(newSelected);
// // // //   };

// // // //   const handleSelectAll = (isSelectAll, currentData) => {
// // // //     if (isSelectAll) {
// // // //       const newSelected = new Set(currentData.map(item => item.tempId || item.id || item.seqNum));
// // // //       setSelectedRows(newSelected);
// // // //     } else {
// // // //       setSelectedRows(new Set());
// // // //     }
// // // //   };
  
// // // //   const handleRecordChange = (rowId, field, value) => {
// // // //     if (field === "DELETE_ROW") {
// // // //       const updated = bondRequests.filter(r => (r.tempId || r.id || r.seqNum) !== rowId);
// // // //       onChange(currentKey, 'bondRequestRecords', updated);
// // // //       return;
// // // //     }
// // // //     const updated = bondRequests.map(r => 
// // // //       (r.tempId || r.id || r.seqNum) === rowId ? { ...r, [field]: value, isDirty: true } : r
// // // //     );
// // // //     onChange(currentKey, 'bondRequestRecords', updated);
// // // //   };

// // // //   const renderTabContent = () => {
// // // //     switch (activeTab) {
// // // //       case "Bond Information":
// // // //         return (
// // // //           <div className="p-4 border border-gray-200 rounded-b-lg bg-white">
// // // //             <FormSection title="Bond Information">
// // // //               <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-2">
// // // //                 <div className="flex items-center gap-2 h-6 mt-1 self-end">
// // // //                   <input 
// // // //                     type="checkbox" 
// // // //                     checked={activeRecord.nextPurchaseFl === 'Y'} 
// // // //                     onChange={(e) => handleFieldChange('nextPurchaseFl', e.target.checked ? 'Y' : 'N')}
// // // //                     className="h-4 w-4 accent-[#17414d] cursor-pointer"
// // // //                   />
// // // //                   <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Next Purchase</label>
// // // //                 </div>
// // // //                 <FormInput 
// // // //                   label="Registration Type *" 
// // // //                   value={activeRecord.regType || ""} 
// // // //                   onChange={(e) => handleFieldChange('regType', e.target.value)} 
// // // //                 />
// // // //                 <FormInput 
// // // //                   label="Face Value *" 
// // // //                   value={activeRecord.faceValue || ""} 
// // // //                   onChange={(e) => handleFieldChange('faceValue', e.target.value)} 
// // // //                 />

// // // //                 <div className="hidden md:block"></div>
// // // //                 <FormInput 
// // // //                   label="Bond Series *" 
// // // //                   value={activeRecord.bondSeries || ""} 
// // // //                   onChange={(e) => handleFieldChange('bondSeries', e.target.value)} 
// // // //                 />
// // // //                 <FormInput 
// // // //                   label="Purchase Price" 
// // // //                   value={activeRecord.purchasePrice || ""} 
// // // //                   onChange={(e) => handleFieldChange('purchasePrice', e.target.value)} 
// // // //                 />
// // // //               </div>
// // // //             </FormSection>
// // // //           </div>
// // // //         );
// // // //       case "Mailing Address":
// // // //         return (
// // // //           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
// // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
// // // //               <FormInput label="Name" value={activeRecord.mailName || ""} onChange={(e) => handleFieldChange('mailName', e.target.value)} />
// // // //               <FormInput label="Line 1" value={activeRecord.mailLn1 || ""} onChange={(e) => handleFieldChange('mailLn1', e.target.value)} />
// // // //               <FormInput label="Line 2" value={activeRecord.mailLn2 || ""} onChange={(e) => handleFieldChange('mailLn2', e.target.value)} />
// // // //               <FormInput label="Line 3" value={activeRecord.mailLn3 || ""} onChange={(e) => handleFieldChange('mailLn3', e.target.value)} />
// // // //               <FormInput label="City" value={activeRecord.mailCity || ""} onChange={(e) => handleFieldChange('mailCity', e.target.value)} />
// // // //               <FormInput label="State" value={activeRecord.mailState || ""} onChange={(e) => handleFieldChange('mailState', e.target.value)} />
// // // //               <FormInput label="Postal Code" value={activeRecord.mailZip || ""} onChange={(e) => handleFieldChange('mailZip', e.target.value)} />
// // // //               <FormInput label="Country" value={activeRecord.mailCountry || ""} onChange={(e) => handleFieldChange('mailCountry', e.target.value)} />
// // // //             </div>
// // // //           </div>
// // // //         );
// // // //       case "Owner/Beneficiary":
// // // //         return (
// // // //           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
// // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
// // // //               <FormInput label="Name" value={activeRecord.obName || ""} onChange={(e) => handleFieldChange('obName', e.target.value)} />
// // // //               <FormInput label="SSN" value={activeRecord.obSsn || ""} onChange={(e) => handleFieldChange('obSsn', e.target.value)} />
// // // //               <FormInput label="Relationship" value={activeRecord.obRel || ""} onChange={(e) => handleFieldChange('obRel', e.target.value)} />
// // // //             </div>
// // // //           </div>
// // // //         );
// // // //       default:
// // // //         return null;
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="space-y-2">
// // // //       <Toolbar 
// // // //         title=" "
// // // //         actions={{
// // // //           onAdd: handleAdd,
// // // //           onCopy: () => {},
// // // //           onPaste: () => {},
// // // //           onClear: handleClear,
// // // //           onDelete: handleDelete,
// // // //           onSave: handleSave,
// // // //           onToggleView: handleToggleView
// // // //         }}
// // // //         isFormView={isFormView}
// // // //         isDirty={bondRequests.some(r => r.isDirty)}
// // // //       />

// // // //       {!isFormView ? (
// // // //         <div className="p-2 border border-gray-100 rounded-b-lg bg-white">
// // // //           <ReusableTable 
// // // //             data={bondRequests} 
// // // //             columns={bondRequestColumns} 
// // // //             onFieldChange={handleRecordChange} 
// // // //             selectedRows={selectedRows}
// // // //             onRowSelect={handleRowSelect}
// // // //             onSelectAll={handleSelectAll}
// // // //             maxHeight="max-h-48" 
// // // //           />
// // // //         </div>
// // // //       ) : (
// // // //         <div className="p-2 space-y-4 bg-white border border-gray-100 rounded-b-lg">
// // // //           <div className="px-1 mb-6 mt-2">
// // // //             <FormInput 
// // // //               label="Sequence Number *" 
// // // //               value={activeRecord.seqNum || ""} 
// // // //               onChange={(e) => handleFieldChange('seqNum', e.target.value)} 
// // // //               className="w-1/4 bg-gray-100"
// // // //             />
// // // //           </div>

// // // //           <div className="mt-4">
// // // //             <div className="flex border-b border-gray-200 bg-gray-50/50">
// // // //               {["Bond Information", "Mailing Address", "Owner/Beneficiary"].map((tab) => (
// // // //                 <button
// // // //                   key={tab}
// // // //                   onClick={() => setActiveTab(tab)}
// // // //                   className={`px-4 py-2 text-[10px] font-bold transition-all ${
// // // //                     activeTab === tab ? "border-b-2 border-[#17414d] text-[#17414d] bg-white" : "text-gray-500 hover:text-[#17414d]"
// // // //                   }`}
// // // //                 >
// // // //                   {tab}
// // // //                 </button>
// // // //               ))}
// // // //             </div>
// // // //             {renderTabContent()}
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default BondRequestsSection;

// // // import React, { useState } from "react";
// // // import { FormSection, FormInput } from "../helper/formSection";
// // // import { ReusableTable } from "../helper/tableSection";
// // // import { SecondaryContainer, Toolbar } from "../helper/container";
// // // import api from "../utils/api";
// // // import { backendUrl } from "./config";
// // // import { toast } from "react-toastify";

// // // export const bondRequestColumns = [
// // //   { value: "seqNum", label: "Sequence Number *", key: "seqNum", id: "seqNum" },
// // //   { value: "nextPurchaseFl", label: "Next Purchase", key: "nextPurchaseFl", id: "nextPurchaseFl", type: "checkbox" },
// // //   { value: "regType", label: "Registration Type *", key: "regType", id: "regType" },
// // //   { value: "bondSeries", label: "Bond Series *", key: "bondSeries", id: "bondSeries" },
// // //   { value: "faceValue", label: "Face Value *", key: "faceValue", id: "faceValue" },
// // //   { value: "purchasePrice", label: "Purchase Price", key: "purchasePrice", id: "purchasePrice" },
// // // ];

// // // const BondRequestsSection = ({ data, onChange, currentKey, activeSavingBond }) => {
// // //   const [isFormView, setIsFormView] = useState(false);
// // //   const [localIndex, setLocalIndex] = useState(0);
// // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // //   const [activeTab, setActiveTab] = useState("Bond Information");

// // //   const bondRequests = data.bondRequestRecords || [];
// // //   const activeRecord = bondRequests[localIndex] || {};

// // //   const fetchBondRequests = async () => {
// // //     const emplId = data?.emplId;
// // //     if (!emplId) return;
// // //     try {
// // //       const res = await api.get(`${backendUrl}/api/empl-bond-ln2`);
// // //       const fetched = Array.isArray(res.data) ? res.data.filter(r => String(r.emplId) === String(emplId)) : [];
// // //       onChange(currentKey, 'bondRequestRecords', fetched.map(item => ({
// // //          ...item,
// // //          isDirty: false,
// // //          seqNum: item.seqNo,
// // //          nextPurchaseFl: item.nextPurchFl,
// // //          regType: item.regType,
// // //          bondSeries: item.bondSeries,
// // //          faceValue: item.bondFaceAmt,
// // //          purchasePrice: item.bondCostAmt,
// // //          mailName: item.designeeName,
// // //          mailLn1: item.ln1Adr,
// // //          mailLn2: item.ln2Adr,
// // //          mailLn3: item.ln3Adr,
// // //          mailCity: item.cityName,
// // //          mailState: item.mailStDc,
// // //          mailZip: item.postalCd,
// // //          obName: item.bondOwnerNm,
// // //          obSsn: item.bondOwnerSsn,
// // //          obRel: item.beneficiaryNm
// // //       })));
// // //     } catch (err) {
// // //       console.error(err);
// // //       toast.error("Failed to fetch bond requests.");
// // //     }
// // //   };

// // //   React.useEffect(() => {
// // //     fetchBondRequests();
// // //   }, [data?.emplId]);

// // //   const handleToggleView = () => setIsFormView(!isFormView);

// // //   const handleAdd = () => {
// // //     const newRecord = { seqNum: "", isDirty: true, tempId: `NEW_BOND_REQ_${Date.now()}` };
// // //     const updated = [...bondRequests, newRecord];
// // //     onChange(currentKey, 'bondRequestRecords', updated);
// // //     setLocalIndex(updated.length - 1);
// // //     setIsFormView(true);
// // //   };

// // //   const handleDelete = async () => {
// // //     if (selectedRows.size > 0) {
// // //       if (window.confirm("Are you sure you want to delete selected bond requests?")) {
// // //         const emplId = data?.emplId;
// // //         const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
// // //         if (!emplId || !dedCd) {
// // //           toast.error("Please select a Saving Bond first.");
// // //           return;
// // //         }
// // //         try {
// // //           for (const id of selectedRows) {
// // //             const record = bondRequests.find(r => (r.tempId || r.id || r.seqNum) === id);
// // //             if (record && !String(id).startsWith("NEW_")) {
// // //               await api.delete(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${record.bondLnKey || 0}`);
// // //             }
// // //           }
// // //           toast.success("Bond requests deleted successfully.");
// // //           fetchBondRequests();
// // //           setSelectedRows(new Set());
// // //         } catch (err) {
// // //           toast.error("Failed to delete bond requests.");
// // //         }
// // //       }
// // //     }
// // //   };

// // //   const handleClear = () => {
// // //     if (window.confirm("Discard changes?")) {
// // //       fetchBondRequests();
// // //     }
// // //   };

// // //   const handleSave = async () => {
// // //     const emplId = data?.emplId;
// // //     const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
// // //     if (!emplId || !dedCd) {
// // //       toast.error("Please select a valid Saving Bond to add requests to.");
// // //       return;
// // //     }
// // //     const dirtyRecords = bondRequests.filter(r => r.isDirty);
// // //     if(dirtyRecords.length === 0) {
// // //        toast.info("No changes to save");
// // //        return;
// // //     }

// // //     try {
// // //       for (const record of dirtyRecords) {
// // //         const payload = {
// // //           emplId: String(emplId),
// // //           dedCd: String(dedCd),
// // //           bondLnKey: record.bondLnKey || 0,
// // //           seqNo: Number(record.seqNum) || 0,
// // //           nextPurchFl: record.nextPurchaseFl === 'Y' ? 'Y' : 'N',
// // //           emplIsOwnerFl: record.emplIsOwnerFl || "N",
// // //           regType: record.regType || "",
// // //           bondOwnerNm: record.obName || "",
// // //           bondOwnerSsn: record.obSsn || "",
// // //           coownerNm: record.coownerNm || "",
// // //           emplIsBenFl: record.emplIsBenFl || "N",
// // //           beneficiaryNm: record.obRel || "",
// // //           bondSeries: record.bondSeries || "",
// // //           bondFaceAmt: Number(record.faceValue) || 0,
// // //           bondCostAmt: Number(record.purchasePrice) || 0,
// // //           useEmplAddrFl: record.useEmplAddrFl || "N",
// // //           designeeName: record.mailName || "",
// // //           ln1Adr: record.mailLn1 || "",
// // //           ln2Adr: record.mailLn2 || "",
// // //           ln3Adr: record.mailLn3 || "",
// // //           cityName: record.mailCity || "",
// // //           mailStDc: record.mailState || "",
// // //           postalCd: record.mailZip || "",
// // //           modifiedBy: "SystemUser",
// // //           timeStamp: new Date().toISOString(),
// // //           rowVersion: record.rowVersion || 0,
// // //           header: {
// // //             emplId: String(emplId),
// // //             dedCd: String(dedCd),
// // //             emplBondEffDt: activeSavingBond?.effDate || activeSavingBond?.emplBondEffDt || new Date().toISOString(),
// // //             bondBegBal: Number(activeSavingBond?.begBalance || activeSavingBond?.bondBegBal) || 0,
// // //             modifiedBy: "SystemUser",
// // //             timeStamp: new Date().toISOString(),
// // //             rowVersion: activeSavingBond?.rowVersion || 0
// // //           }
// // //         };

// // //         if (record.tempId && String(record.tempId).startsWith("NEW_")) {
// // //           await api.post(`${backendUrl}/api/empl-bond-ln2`, payload);
// // //         } else {
// // //           await api.put(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${payload.bondLnKey}`, payload);
// // //         }
// // //       }
// // //       toast.success("Bond requests saved successfully.");
// // //       fetchBondRequests();
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.title || "Failed to save bond requests.");
// // //     }
// // //   };

// // //   const handleFieldChange = (field, value) => {
// // //     const updated = [...bondRequests];
// // //     if (updated.length === 0) {
// // //       updated.push({ [field]: value, isDirty: true });
// // //       setLocalIndex(0);
// // //     } else {
// // //       updated[localIndex] = { ...updated[localIndex], [field]: value, isDirty: true };
// // //     }
// // //     onChange(currentKey, 'bondRequestRecords', updated);
// // //   };

// // //   const handleRowSelect = (item) => {
// // //     const newSelected = new Set(selectedRows);
// // //     const id = item.tempId || item.id || item.seqNum;
// // //     if (newSelected.has(id)) newSelected.delete(id);
// // //     else newSelected.add(id);
// // //     setSelectedRows(newSelected);
// // //   };

// // //   const handleSelectAll = (isSelectAll, currentData) => {
// // //     if (isSelectAll) {
// // //       const newSelected = new Set(currentData.map(item => item.tempId || item.id || item.seqNum));
// // //       setSelectedRows(newSelected);
// // //     } else {
// // //       setSelectedRows(new Set());
// // //     }
// // //   };
  
// // //   const handleRecordChange = (rowId, field, value) => {
// // //     if (field === "DELETE_ROW") {
// // //       const updated = bondRequests.filter(r => (r.tempId || r.id || r.seqNum) !== rowId);
// // //       onChange(currentKey, 'bondRequestRecords', updated);
// // //       return;
// // //     }
// // //     const updated = bondRequests.map(r => 
// // //       (r.tempId || r.id || r.seqNum) === rowId ? { ...r, [field]: value, isDirty: true } : r
// // //     );
// // //     onChange(currentKey, 'bondRequestRecords', updated);
// // //   };

// // //   const renderTabContent = () => {
// // //     switch (activeTab) {
// // //       case "Bond Information":
// // //         return (
// // //           <div className="p-4 border border-gray-200 rounded-b-lg bg-white">
// // //             <FormSection title="Bond Information">
// // //               <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-2">
// // //                 <div className="flex items-center gap-2 h-6 mt-1 self-end">
// // //                   <input 
// // //                     type="checkbox" 
// // //                     checked={activeRecord.nextPurchaseFl === 'Y'} 
// // //                     onChange={(e) => handleFieldChange('nextPurchaseFl', e.target.checked ? 'Y' : 'N')}
// // //                     className="h-4 w-4 accent-[#17414d] cursor-pointer"
// // //                   />
// // //                   <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Next Purchase</label>
// // //                 </div>
// // //                 <FormInput 
// // //                   label="Registration Type *" 
// // //                   value={activeRecord.regType || ""} 
// // //                   onChange={(e) => handleFieldChange('regType', e.target.value)} 
// // //                 />
// // //                 <FormInput 
// // //                   label="Face Value *" 
// // //                   value={activeRecord.faceValue || ""} 
// // //                   onChange={(e) => handleFieldChange('faceValue', e.target.value)} 
// // //                 />

// // //                 <div className="hidden md:block"></div>
// // //                 <FormInput 
// // //                   label="Bond Series *" 
// // //                   value={activeRecord.bondSeries || ""} 
// // //                   onChange={(e) => handleFieldChange('bondSeries', e.target.value)} 
// // //                 />
// // //                 <FormInput 
// // //                   label="Purchase Price" 
// // //                   value={activeRecord.purchasePrice || ""} 
// // //                   onChange={(e) => handleFieldChange('purchasePrice', e.target.value)} 
// // //                 />
// // //               </div>
// // //             </FormSection>
// // //           </div>
// // //         );
// // //       case "Mailing Address":
// // //         return (
// // //           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
// // //               <FormInput label="Name" value={activeRecord.mailName || ""} onChange={(e) => handleFieldChange('mailName', e.target.value)} />
// // //               <FormInput label="Line 1" value={activeRecord.mailLn1 || ""} onChange={(e) => handleFieldChange('mailLn1', e.target.value)} />
// // //               <FormInput label="Line 2" value={activeRecord.mailLn2 || ""} onChange={(e) => handleFieldChange('mailLn2', e.target.value)} />
// // //               <FormInput label="Line 3" value={activeRecord.mailLn3 || ""} onChange={(e) => handleFieldChange('mailLn3', e.target.value)} />
// // //               <FormInput label="City" value={activeRecord.mailCity || ""} onChange={(e) => handleFieldChange('mailCity', e.target.value)} />
// // //               <FormInput label="State" value={activeRecord.mailState || ""} onChange={(e) => handleFieldChange('mailState', e.target.value)} />
// // //               <FormInput label="Postal Code" value={activeRecord.mailZip || ""} onChange={(e) => handleFieldChange('mailZip', e.target.value)} />
// // //               <FormInput label="Country" value={activeRecord.mailCountry || ""} onChange={(e) => handleFieldChange('mailCountry', e.target.value)} />
// // //             </div>
// // //           </div>
// // //         );
// // //       case "Owner/Beneficiary":
// // //         return (
// // //           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
// // //               <FormInput label="Name" value={activeRecord.obName || ""} onChange={(e) => handleFieldChange('obName', e.target.value)} />
// // //               <FormInput label="SSN" value={activeRecord.obSsn || ""} onChange={(e) => handleFieldChange('obSsn', e.target.value)} />
// // //               <FormInput label="Relationship" value={activeRecord.obRel || ""} onChange={(e) => handleFieldChange('obRel', e.target.value)} />
// // //             </div>
// // //           </div>
// // //         );
// // //       default:
// // //         return null;
// // //     }
// // //   };

// // //   return (
// // //     <div className="space-y-2">
// // //       <Toolbar 
// // //         title=" "
// // //         actions={{
// // //           onAdd: handleAdd,
// // //           onCopy: () => {},
// // //           onPaste: () => {},
// // //           onClear: handleClear,
// // //           onDelete: handleDelete,
// // //           onSave: handleSave,
// // //           onToggleView: handleToggleView
// // //         }}
// // //         isFormView={isFormView}
// // //         isDirty={bondRequests.some(r => r.isDirty)}
// // //       />

// // //       {!isFormView ? (
// // //         <div className="p-2 border border-gray-100 rounded-b-lg bg-white">
// // //           <ReusableTable 
// // //             data={bondRequests} 
// // //             columns={bondRequestColumns} 
// // //             onFieldChange={handleRecordChange} 
// // //             selectedRows={selectedRows}
// // //             onRowSelect={handleRowSelect}
// // //             onSelectAll={handleSelectAll}
// // //             rowKey={(row) => String(row.tempId || row.id || row.seqNum || "")}
// // //             maxHeight="max-h-48" 
// // //           />
// // //         </div>
// // //       ) : (
// // //         <div className="p-2 space-y-4 bg-white border border-gray-100 rounded-b-lg">
// // //           <div className="px-1 mb-6 mt-2">
// // //             <FormInput 
// // //               label="Sequence Number *" 
// // //               value={activeRecord.seqNum || ""} 
// // //               onChange={(e) => handleFieldChange('seqNum', e.target.value)} 
// // //               className="w-1/4 bg-gray-100"
// // //             />
// // //           </div>

// // //           <div className="mt-4">
// // //             <div className="flex border-b border-gray-200 bg-gray-50/50">
// // //               {["Bond Information", "Mailing Address", "Owner/Beneficiary"].map((tab) => (
// // //                 <button
// // //                   key={tab}
// // //                   onClick={() => setActiveTab(tab)}
// // //                   className={`px-4 py-2 text-[10px] font-bold transition-all ${
// // //                     activeTab === tab ? "border-b-2 border-[#17414d] text-[#17414d] bg-white" : "text-gray-500 hover:text-[#17414d]"
// // //                   }`}
// // //                 >
// // //                   {tab}
// // //                 </button>
// // //               ))}
// // //             </div>
// // //             {renderTabContent()}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default BondRequestsSection;

// // import React, { useState } from "react";
// // import { FormSection, FormInput } from "../helper/formSection";
// // import { ReusableTable } from "../helper/tableSection";
// // import { SecondaryContainer, Toolbar } from "../helper/container";
// // import api from "../utils/api";
// // import { backendUrl } from "./config";
// // import { toast } from "react-toastify";

// // export const bondRequestColumns = [
// //   { value: "seqNum", label: "Sequence Number *", key: "seqNum", id: "seqNum" },
// //   { value: "nextPurchaseFl", label: "Next Purchase", key: "nextPurchaseFl", id: "nextPurchaseFl", type: "checkbox" },
// //   { value: "regType", label: "Registration Type *", key: "regType", id: "regType" },
// //   { value: "bondSeries", label: "Bond Series *", key: "bondSeries", id: "bondSeries" },
// //   { value: "faceValue", label: "Face Value *", key: "faceValue", id: "faceValue" },
// //   { value: "purchasePrice", label: "Purchase Price", key: "purchasePrice", id: "purchasePrice" },
// // ];

// // const BondRequestsSection = ({ data, onChange, currentKey, activeSavingBond }) => {
// //   const [isFormView, setIsFormView] = useState(false);
// //   const [localIndex, setLocalIndex] = useState(0);
// //   const [selectedRows, setSelectedRows] = useState(new Set());
// //   const [activeTab, setActiveTab] = useState("Bond Information");

// //   const bondRequests = data.bondRequestRecords || [];
// //   const activeRecord = bondRequests[localIndex] || {};

// //   const fetchBondRequests = async () => {
// //     const emplId = data?.emplId;
// //     if (!emplId) return;
// //     try {
// //       const res = await api.get(`${backendUrl}/api/empl-bond-ln2`);
// //       const fetched = Array.isArray(res.data) ? res.data.filter(r => String(r.emplId) === String(emplId)) : [];
// //       onChange(currentKey, 'bondRequestRecords', fetched.map(item => ({
// //          ...item,
// //          isDirty: false,
// //          seqNum: item.seqNo,
// //          nextPurchaseFl: item.nextPurchFl,
// //          regType: item.regType,
// //          bondSeries: item.bondSeries,
// //          faceValue: item.bondFaceAmt,
// //          purchasePrice: item.bondCostAmt,
// //          mailName: item.designeeName,
// //          mailLn1: item.ln1Adr,
// //          mailLn2: item.ln2Adr,
// //          mailLn3: item.ln3Adr,
// //          mailCity: item.cityName,
// //          mailState: item.mailStDc,
// //          mailZip: item.postalCd,
// //          obName: item.bondOwnerNm,
// //          obSsn: item.bondOwnerSsn,
// //          obRel: item.beneficiaryNm
// //       })));
// //     } catch (err) {
// //       console.error(err);
// //       toast.error("Failed to fetch bond requests.");
// //     }
// //   };

// //   React.useEffect(() => {
// //     fetchBondRequests();
// //   }, [data?.emplId]);

// //   const handleToggleView = () => setIsFormView(!isFormView);

// //   const handleAdd = () => {
// //     const newRecord = { seqNum: "", isDirty: true, tempId: `NEW_BOND_REQ_${Date.now()}` };
// //     const updated = [...bondRequests, newRecord];
// //     onChange(currentKey, 'bondRequestRecords', updated);
// //     setLocalIndex(updated.length - 1);
// //   };

// //   const handleDelete = async () => {
// //     if (selectedRows.size > 0) {
// //       if (window.confirm("Are you sure you want to delete selected bond requests?")) {
// //         const emplId = data?.emplId;
// //         const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
// //         if (!emplId || !dedCd) {
// //           toast.error("Please select a Saving Bond first.");
// //           return;
// //         }
// //         try {
// //           for (const id of selectedRows) {
// //             const record = bondRequests.find(r => (r.tempId || r.id || r.seqNum) === id);
// //             if (record && !String(id).startsWith("NEW_")) {
// //               await api.delete(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${record.bondLnKey || 0}`);
// //             }
// //           }
// //           toast.success("Bond requests deleted successfully.");
// //           fetchBondRequests();
// //           setSelectedRows(new Set());
// //         } catch (err) {
// //           toast.error("Failed to delete bond requests.");
// //         }
// //       }
// //     }
// //   };

// //   const handleClear = () => {
// //     if (window.confirm("Discard changes?")) {
// //       fetchBondRequests();
// //     }
// //   };

// //   const handleSave = async () => {
// //     const emplId = data?.emplId;
// //     const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
// //     if (!emplId || !dedCd) {
// //       toast.error("Please select a valid Saving Bond to add requests to.");
// //       return;
// //     }
// //     const dirtyRecords = bondRequests.filter(r => r.isDirty);
// //     if(dirtyRecords.length === 0) {
// //        toast.info("No changes to save");
// //        return;
// //     }

// //     try {
// //       for (const record of dirtyRecords) {
// //         const payload = {
// //           emplId: String(emplId),
// //           dedCd: String(dedCd),
// //           bondLnKey: record.bondLnKey || 0,
// //           seqNo: Number(record.seqNum) || 0,
// //           nextPurchFl: record.nextPurchaseFl === 'Y' ? 'Y' : 'N',
// //           emplIsOwnerFl: record.emplIsOwnerFl || "N",
// //           regType: record.regType || "",
// //           bondOwnerNm: record.obName || "",
// //           bondOwnerSsn: record.obSsn || "",
// //           coownerNm: record.coownerNm || "",
// //           emplIsBenFl: record.emplIsBenFl || "N",
// //           beneficiaryNm: record.obRel || "",
// //           bondSeries: record.bondSeries || "",
// //           bondFaceAmt: Number(record.faceValue) || 0,
// //           bondCostAmt: Number(record.purchasePrice) || 0,
// //           useEmplAddrFl: record.useEmplAddrFl || "N",
// //           designeeName: record.mailName || "",
// //           ln1Adr: record.mailLn1 || "",
// //           ln2Adr: record.mailLn2 || "",
// //           ln3Adr: record.mailLn3 || "",
// //           cityName: record.mailCity || "",
// //           mailStDc: record.mailState || "",
// //           postalCd: record.mailZip || "",
// //           modifiedBy: "SystemUser",
// //           timeStamp: new Date().toISOString(),
// //           rowVersion: record.rowVersion || 0,
// //           header: {
// //             emplId: String(emplId),
// //             dedCd: String(dedCd),
// //             emplBondEffDt: activeSavingBond?.effDate || activeSavingBond?.emplBondEffDt || new Date().toISOString(),
// //             bondBegBal: Number(activeSavingBond?.begBalance || activeSavingBond?.bondBegBal) || 0,
// //             modifiedBy: "SystemUser",
// //             timeStamp: new Date().toISOString(),
// //             rowVersion: activeSavingBond?.rowVersion || 0
// //           }
// //         };

// //         if (record.tempId && String(record.tempId).startsWith("NEW_")) {
// //           await api.post(`${backendUrl}/api/empl-bond-ln2`, payload);
// //         } else {
// //           await api.put(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${payload.bondLnKey}`, payload);
// //         }
// //       }
// //       toast.success("Bond requests saved successfully.");
// //       fetchBondRequests();
// //     } catch (err) {
// //       toast.error(err.response?.data?.title || "Failed to save bond requests.");
// //     }
// //   };

// //   const handleFieldChange = (field, value) => {
// //     const updated = [...bondRequests];
// //     if (updated.length === 0) {
// //       updated.push({ [field]: value, isDirty: true });
// //       setLocalIndex(0);
// //     } else {
// //       updated[localIndex] = { ...updated[localIndex], [field]: value, isDirty: true };
// //     }
// //     onChange(currentKey, 'bondRequestRecords', updated);
// //   };

// //   const handleRowSelect = (item) => {
// //     const newSelected = new Set(selectedRows);
// //     const id = item.tempId || item.id || item.seqNum;
// //     if (newSelected.has(id)) newSelected.delete(id);
// //     else newSelected.add(id);
// //     setSelectedRows(newSelected);
// //   };

// //   const handleSelectAll = (isSelectAll, currentData) => {
// //     if (isSelectAll) {
// //       const newSelected = new Set(currentData.map(item => item.tempId || item.id || item.seqNum));
// //       setSelectedRows(newSelected);
// //     } else {
// //       setSelectedRows(new Set());
// //     }
// //   };
  
// //   const handleRecordChange = (rowId, field, value) => {
// //     if (field === "DELETE_ROW") {
// //       const updated = bondRequests.filter(r => (r.tempId || r.id || r.seqNum) !== rowId);
// //       onChange(currentKey, 'bondRequestRecords', updated);
// //       return;
// //     }
// //     const updated = bondRequests.map(r => 
// //       (r.tempId || r.id || r.seqNum) === rowId ? { ...r, [field]: value, isDirty: true } : r
// //     );
// //     onChange(currentKey, 'bondRequestRecords', updated);
// //   };

// //   const renderTabContent = () => {
// //     switch (activeTab) {
// //       case "Bond Information":
// //         return (
// //           <div className="p-4 border border-gray-200 rounded-b-lg bg-white">
// //             <FormSection title="Bond Information">
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-2">
// //                 <div className="flex items-center gap-2 h-6 mt-1 self-end">
// //                   <input 
// //                     type="checkbox" 
// //                     checked={activeRecord.nextPurchaseFl === 'Y'} 
// //                     onChange={(e) => handleFieldChange('nextPurchaseFl', e.target.checked ? 'Y' : 'N')}
// //                     className="h-4 w-4 accent-[#17414d] cursor-pointer"
// //                   />
// //                   <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Next Purchase</label>
// //                 </div>
// //                 <FormInput 
// //                   label="Registration Type *" 
// //                   value={activeRecord.regType || ""} 
// //                   onChange={(e) => handleFieldChange('regType', e.target.value)} 
// //                 />
// //                 <FormInput 
// //                   label="Face Value *" 
// //                   value={activeRecord.faceValue || ""} 
// //                   onChange={(e) => handleFieldChange('faceValue', e.target.value)} 
// //                 />

// //                 <div className="hidden md:block"></div>
// //                 <FormInput 
// //                   label="Bond Series *" 
// //                   value={activeRecord.bondSeries || ""} 
// //                   onChange={(e) => handleFieldChange('bondSeries', e.target.value)} 
// //                 />
// //                 <FormInput 
// //                   label="Purchase Price" 
// //                   value={activeRecord.purchasePrice || ""} 
// //                   onChange={(e) => handleFieldChange('purchasePrice', e.target.value)} 
// //                 />
// //               </div>
// //             </FormSection>
// //           </div>
// //         );
// //       case "Mailing Address":
// //         return (
// //           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
// //               <FormInput label="Name" value={activeRecord.mailName || ""} onChange={(e) => handleFieldChange('mailName', e.target.value)} />
// //               <FormInput label="Line 1" value={activeRecord.mailLn1 || ""} onChange={(e) => handleFieldChange('mailLn1', e.target.value)} />
// //               <FormInput label="Line 2" value={activeRecord.mailLn2 || ""} onChange={(e) => handleFieldChange('mailLn2', e.target.value)} />
// //               <FormInput label="Line 3" value={activeRecord.mailLn3 || ""} onChange={(e) => handleFieldChange('mailLn3', e.target.value)} />
// //               <FormInput label="City" value={activeRecord.mailCity || ""} onChange={(e) => handleFieldChange('mailCity', e.target.value)} />
// //               <FormInput label="State" value={activeRecord.mailState || ""} onChange={(e) => handleFieldChange('mailState', e.target.value)} />
// //               <FormInput label="Postal Code" value={activeRecord.mailZip || ""} onChange={(e) => handleFieldChange('mailZip', e.target.value)} />
// //               <FormInput label="Country" value={activeRecord.mailCountry || ""} onChange={(e) => handleFieldChange('mailCountry', e.target.value)} />
// //             </div>
// //           </div>
// //         );
// //       case "Owner/Beneficiary":
// //         return (
// //           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
// //               <FormInput label="Name" value={activeRecord.obName || ""} onChange={(e) => handleFieldChange('obName', e.target.value)} />
// //               <FormInput label="SSN" value={activeRecord.obSsn || ""} onChange={(e) => handleFieldChange('obSsn', e.target.value)} />
// //               <FormInput label="Relationship" value={activeRecord.obRel || ""} onChange={(e) => handleFieldChange('obRel', e.target.value)} />
// //             </div>
// //           </div>
// //         );
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div className="space-y-2">
// //       <Toolbar 
// //         title=" "
// //         actions={{
// //           onAdd: handleAdd,
// //           onCopy: () => {},
// //           onPaste: () => {},
// //           onClear: handleClear,
// //           onDelete: handleDelete,
// //           onSave: handleSave,
// //           onToggleView: handleToggleView
// //         }}
// //         isFormView={isFormView}
// //         isDirty={bondRequests.some(r => r.isDirty)}
// //       />

// //       {!isFormView ? (
// //         <div className="p-2 border border-gray-100 rounded-b-lg bg-white">
// //           <ReusableTable 
// //             data={bondRequests} 
// //             columns={bondRequestColumns} 
// //             onFieldChange={handleRecordChange} 
// //             selectedRows={selectedRows}
// //             onRowSelect={handleRowSelect}
// //             onSelectAll={handleSelectAll}
// //             rowKey={(row) => String(row.tempId || row.id || row.seqNum || "")}
// //             maxHeight="max-h-48" 
// //           />
// //         </div>
// //       ) : (
// //         <div className="p-2 space-y-4 bg-white border border-gray-100 rounded-b-lg">
// //           <div className="px-1 mb-6 mt-2">
// //             <FormInput 
// //               label="Sequence Number *" 
// //               value={activeRecord.seqNum || ""} 
// //               onChange={(e) => handleFieldChange('seqNum', e.target.value)} 
// //               className="w-1/4 bg-gray-100"
// //             />
// //           </div>

// //           <div className="mt-4">
// //             <div className="flex border-b border-gray-200 bg-gray-50/50">
// //               {["Bond Information", "Mailing Address", "Owner/Beneficiary"].map((tab) => (
// //                 <button
// //                   key={tab}
// //                   onClick={() => setActiveTab(tab)}
// //                   className={`px-4 py-2 text-[10px] font-bold transition-all ${
// //                     activeTab === tab ? "border-b-2 border-[#17414d] text-[#17414d] bg-white" : "text-gray-500 hover:text-[#17414d]"
// //                   }`}
// //                 >
// //                   {tab}
// //                 </button>
// //               ))}
// //             </div>
// //             {renderTabContent()}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default BondRequestsSection;

// import React, { useState } from "react";
// import { FormSection, FormInput } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { SecondaryContainer, Toolbar } from "../helper/container";
// import api from "../utils/api";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";

// export const bondRequestColumns = [
//   { value: "seqNum", label: "Sequence Number *", key: "seqNum", id: "seqNum" },
//   { value: "nextPurchaseFl", label: "Next Purchase", key: "nextPurchaseFl", id: "nextPurchaseFl", type: "checkbox" },
//   { value: "regType", label: "Registration Type *", key: "regType", id: "regType" },
//   { value: "bondSeries", label: "Bond Series *", key: "bondSeries", id: "bondSeries" },
//   { value: "faceValue", label: "Face Value *", key: "faceValue", id: "faceValue" },
//   { value: "purchasePrice", label: "Purchase Price", key: "purchasePrice", id: "purchasePrice" },
//   { value: "mailName", label: "Mailing Name", key: "mailName", id: "mailName" },
//   { value: "mailLn1", label: "Line 1", key: "mailLn1", id: "mailLn1" },
//   { value: "mailLn2", label: "Line 2", key: "mailLn2", id: "mailLn2" },
//   { value: "mailLn3", label: "Line 3", key: "mailLn3", id: "mailLn3" },
//   { value: "mailCity", label: "City", key: "mailCity", id: "mailCity" },
//   { value: "mailState", label: "State", key: "mailState", id: "mailState" },
//   { value: "mailZip", label: "Postal Code", key: "mailZip", id: "mailZip" },
//   { value: "mailCountry", label: "Country", key: "mailCountry", id: "mailCountry" },
//   { value: "obName", label: "Owner/Ben Name", key: "obName", id: "obName" },
//   { value: "obSsn", label: "SSN", key: "obSsn", id: "obSsn" },
//   { value: "obRel", label: "Relationship", key: "obRel", id: "obRel" },
// ];

// const BondRequestsSection = ({ data, onChange, currentKey, activeSavingBond }) => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [localIndex, setLocalIndex] = useState(0);
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [activeTab, setActiveTab] = useState("Bond Information");

//   const bondRequests = data.bondRequestRecords || [];
//   const activeRecord = bondRequests[localIndex] || {};

//   const fetchBondRequests = async () => {
//     const emplId = data?.emplId;
//     if (!emplId) return;
//     try {
//       const res = await api.get(`${backendUrl}/api/empl-bond-ln2`);
//       const fetched = Array.isArray(res.data) ? res.data.filter(r => String(r.emplId) === String(emplId)) : [];
//       onChange(currentKey, 'bondRequestRecords', fetched.map(item => ({
//          ...item,
//          isDirty: false,
//          seqNum: item.seqNo,
//          nextPurchaseFl: item.nextPurchFl,
//          regType: item.regType,
//          bondSeries: item.bondSeries,
//          faceValue: item.bondFaceAmt,
//          purchasePrice: item.bondCostAmt,
//          mailName: item.designeeName,
//          mailLn1: item.ln1Adr,
//          mailLn2: item.ln2Adr,
//          mailLn3: item.ln3Adr,
//          mailCity: item.cityName,
//          mailState: item.mailStDc,
//          mailZip: item.postalCd,
//          obName: item.bondOwnerNm,
//          obSsn: item.bondOwnerSsn,
//          obRel: item.beneficiaryNm
//       })));
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch bond requests.");
//     }
//   };

//   React.useEffect(() => {
//     fetchBondRequests();
//   }, [data?.emplId]);

//   const handleToggleView = () => setIsFormView(!isFormView);

//   const handleAdd = () => {
//     const newRecord = { seqNum: "", isDirty: true, tempId: `NEW_BOND_REQ_${Date.now()}` };
//     const updated = [...bondRequests, newRecord];
//     onChange(currentKey, 'bondRequestRecords', updated);
//     setLocalIndex(updated.length - 1);
//   };

//   const handleDelete = async () => {
//     if (selectedRows.size > 0) {
//       if (window.confirm("Are you sure you want to delete selected bond requests?")) {
//         const emplId = data?.emplId;
//         const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
//         if (!emplId || !dedCd) {
//           toast.error("Please select a Saving Bond first.");
//           return;
//         }
//         try {
//           for (const id of selectedRows) {
//             const record = bondRequests.find(r => (r.tempId || r.id || r.seqNum) === id);
//             if (record && !String(id).startsWith("NEW_")) {
//               await api.delete(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${record.bondLnKey || 0}`);
//             }
//           }
//           toast.success("Bond requests deleted successfully.");
//           fetchBondRequests();
//           setSelectedRows(new Set());
//         } catch (err) {
//           toast.error("Failed to delete bond requests.");
//         }
//       }
//     }
//   };

//   const handleClear = () => {
//     if (window.confirm("Discard changes?")) {
//       fetchBondRequests();
//     }
//   };

//   const handleSave = async () => {
//     const emplId = data?.emplId;
//     const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
//     if (!emplId || !dedCd) {
//       toast.error("Please select a valid Saving Bond to add requests to.");
//       return;
//     }
//     const dirtyRecords = bondRequests.filter(r => r.isDirty);
//     if(dirtyRecords.length === 0) {
//        toast.info("No changes to save");
//        return;
//     }

//     try {
//       for (const record of dirtyRecords) {
//         const payload = {
//           emplId: String(emplId),
//           dedCd: String(dedCd),
//           bondLnKey: record.bondLnKey || 0,
//           seqNo: Number(record.seqNum) || 0,
//           nextPurchFl: record.nextPurchaseFl === 'Y' ? 'Y' : 'N',
//           emplIsOwnerFl: record.emplIsOwnerFl || "N",
//           regType: record.regType || "",
//           bondOwnerNm: record.obName || "",
//           bondOwnerSsn: record.obSsn || "",
//           coownerNm: record.coownerNm || "",
//           emplIsBenFl: record.emplIsBenFl || "N",
//           beneficiaryNm: record.obRel || "",
//           bondSeries: record.bondSeries || "",
//           bondFaceAmt: Number(record.faceValue) || 0,
//           bondCostAmt: Number(record.purchasePrice) || 0,
//           useEmplAddrFl: record.useEmplAddrFl || "N",
//           designeeName: record.mailName || "",
//           ln1Adr: record.mailLn1 || "",
//           ln2Adr: record.mailLn2 || "",
//           ln3Adr: record.mailLn3 || "",
//           cityName: record.mailCity || "",
//           mailStDc: record.mailState || "",
//           postalCd: record.mailZip || "",
//           modifiedBy: "SystemUser",
//           timeStamp: new Date().toISOString(),
//           rowVersion: record.rowVersion || 0
//         };

//         if (record.tempId && String(record.tempId).startsWith("NEW_")) {
//           await api.post(`${backendUrl}/api/empl-bond-ln2`, payload);
//         } else {
//           await api.put(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${payload.bondLnKey}`, payload);
//         }
//       }
//       toast.success("Bond requests saved successfully.");
//       fetchBondRequests();
//     } catch (err) {
//       toast.error(err.response?.data?.title || "Failed to save bond requests.");
//     }
//   };

//   const handleFieldChange = (field, value) => {
//     const updated = [...bondRequests];
//     if (updated.length === 0) {
//       updated.push({ [field]: value, isDirty: true });
//       setLocalIndex(0);
//     } else {
//       updated[localIndex] = { ...updated[localIndex], [field]: value, isDirty: true };
//     }
//     onChange(currentKey, 'bondRequestRecords', updated);
//   };

//   const handleRowSelect = (item) => {
//     const newSelected = new Set(selectedRows);
//     const id = item.tempId || item.id || item.seqNum;
//     if (newSelected.has(id)) newSelected.delete(id);
//     else newSelected.add(id);
//     setSelectedRows(newSelected);
//   };

//   const handleSelectAll = (isSelectAll, currentData) => {
//     if (isSelectAll) {
//       const newSelected = new Set(currentData.map(item => item.tempId || item.id || item.seqNum));
//       setSelectedRows(newSelected);
//     } else {
//       setSelectedRows(new Set());
//     }
//   };
  
//   const handleRecordChange = (rowId, field, value) => {
//     if (field === "DELETE_ROW") {
//       const updated = bondRequests.filter(r => (r.tempId || r.id || r.seqNum) !== rowId);
//       onChange(currentKey, 'bondRequestRecords', updated);
//       return;
//     }
//     const updated = bondRequests.map(r => 
//       (r.tempId || r.id || r.seqNum) === rowId ? { ...r, [field]: value, isDirty: true } : r
//     );
//     onChange(currentKey, 'bondRequestRecords', updated);
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "Bond Information":
//         return (
//           <div className="p-4 border border-gray-200 rounded-b-lg bg-white">
//             <FormSection title="Bond Information">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-2">
//                 <div className="flex items-center gap-2 h-6 mt-1 self-end">
//                   <input 
//                     type="checkbox" 
//                     checked={activeRecord.nextPurchaseFl === 'Y'} 
//                     onChange={(e) => handleFieldChange('nextPurchaseFl', e.target.checked ? 'Y' : 'N')}
//                     className="h-4 w-4 accent-[#17414d] cursor-pointer"
//                   />
//                   <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Next Purchase</label>
//                 </div>
//                 <FormInput 
//                   label="Registration Type *" 
//                   value={activeRecord.regType || ""} 
//                   onChange={(e) => handleFieldChange('regType', e.target.value)} 
//                 />
//                 <FormInput 
//                   label="Face Value *" 
//                   value={activeRecord.faceValue || ""} 
//                   onChange={(e) => handleFieldChange('faceValue', e.target.value)} 
//                 />

//                 <div className="hidden md:block"></div>
//                 <FormInput 
//                   label="Bond Series *" 
//                   value={activeRecord.bondSeries || ""} 
//                   onChange={(e) => handleFieldChange('bondSeries', e.target.value)} 
//                 />
//                 <FormInput 
//                   label="Purchase Price" 
//                   value={activeRecord.purchasePrice || ""} 
//                   onChange={(e) => handleFieldChange('purchasePrice', e.target.value)} 
//                 />
//               </div>
//             </FormSection>
//           </div>
//         );
//       case "Mailing Address":
//         return (
//           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
//               <FormInput label="Name" value={activeRecord.mailName || ""} onChange={(e) => handleFieldChange('mailName', e.target.value)} />
//               <FormInput label="Line 1" value={activeRecord.mailLn1 || ""} onChange={(e) => handleFieldChange('mailLn1', e.target.value)} />
//               <FormInput label="Line 2" value={activeRecord.mailLn2 || ""} onChange={(e) => handleFieldChange('mailLn2', e.target.value)} />
//               <FormInput label="Line 3" value={activeRecord.mailLn3 || ""} onChange={(e) => handleFieldChange('mailLn3', e.target.value)} />
//               <FormInput label="City" value={activeRecord.mailCity || ""} onChange={(e) => handleFieldChange('mailCity', e.target.value)} />
//               <FormInput label="State" value={activeRecord.mailState || ""} onChange={(e) => handleFieldChange('mailState', e.target.value)} />
//               <FormInput label="Postal Code" value={activeRecord.mailZip || ""} onChange={(e) => handleFieldChange('mailZip', e.target.value)} />
//               <FormInput label="Country" value={activeRecord.mailCountry || ""} onChange={(e) => handleFieldChange('mailCountry', e.target.value)} />
//             </div>
//           </div>
//         );
//       case "Owner/Beneficiary":
//         return (
//           <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
//               <FormInput label="Name" value={activeRecord.obName || ""} onChange={(e) => handleFieldChange('obName', e.target.value)} />
//               <FormInput label="SSN" value={activeRecord.obSsn || ""} onChange={(e) => handleFieldChange('obSsn', e.target.value)} />
//               <FormInput label="Relationship" value={activeRecord.obRel || ""} onChange={(e) => handleFieldChange('obRel', e.target.value)} />
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <Toolbar 
//         title=" "
//         actions={{
//           onAdd: handleAdd,
//           onCopy: () => {},
//           onPaste: () => {},
//           onClear: handleClear,
//           onDelete: handleDelete,
//           onSave: handleSave,
//           onToggleView: handleToggleView
//         }}
//         isFormView={isFormView}
//         isDirty={bondRequests.some(r => r.isDirty)}
//       />

//       {!isFormView ? (
//         <div className="p-2 border border-gray-100 rounded-b-lg bg-white">
//           <ReusableTable 
//             data={bondRequests} 
//             columns={bondRequestColumns} 
//             onFieldChange={handleRecordChange} 
//             selectedRows={selectedRows}
//             onRowSelect={handleRowSelect}
//             onSelectAll={handleSelectAll}
//             rowKey={(row) => String(row.tempId || row.id || row.seqNum || "")}
//             maxHeight="max-h-48" 
//           />
//         </div>
//       ) : (
//         <div className="p-2 space-y-4 bg-white border border-gray-100 rounded-b-lg">
//           <div className="px-1 mb-6 mt-2">
//             <FormInput 
//               label="Sequence Number *" 
//               value={activeRecord.seqNum || ""} 
//               onChange={(e) => handleFieldChange('seqNum', e.target.value)} 
//               className="w-1/4 bg-gray-100"
//             />
//           </div>

//           <div className="mt-4">
//             <div className="flex border-b border-gray-200 bg-gray-50/50">
//               {["Bond Information", "Mailing Address", "Owner/Beneficiary"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-4 py-2 text-[10px] font-bold transition-all ${
//                     activeTab === tab ? "border-b-2 border-[#17414d] text-[#17414d] bg-white" : "text-gray-500 hover:text-[#17414d]"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//             {renderTabContent()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BondRequestsSection;

import React, { useState } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { SecondaryContainer, Toolbar } from "../helper/container";
import api from "../utils/api";
import { backendUrl } from "./config";
import { toast } from "react-toastify";

export const bondRequestColumns = [
  { value: "seqNum", label: "Sequence Number *", key: "seqNum", id: "seqNum" },
  { value: "nextPurchaseFl", label: "Next Purchase", key: "nextPurchaseFl", id: "nextPurchaseFl", type: "checkbox" },
  { value: "regType", label: "Registration Type *", key: "regType", id: "regType" },
  { value: "bondSeries", label: "Bond Series *", key: "bondSeries", id: "bondSeries" },
  { value: "faceValue", label: "Face Value *", key: "faceValue", id: "faceValue" },
  { value: "purchasePrice", label: "Purchase Price", key: "purchasePrice", id: "purchasePrice" },
  { value: "mailName", label: "Mailing Name", key: "mailName", id: "mailName" },
  { value: "mailLn1", label: "Line 1", key: "mailLn1", id: "mailLn1" },
  { value: "mailLn2", label: "Line 2", key: "mailLn2", id: "mailLn2" },
  { value: "mailLn3", label: "Line 3", key: "mailLn3", id: "mailLn3" },
  { value: "mailCity", label: "City", key: "mailCity", id: "mailCity" },
  { value: "mailState", label: "State", key: "mailState", id: "mailState" },
  { value: "mailZip", label: "Postal Code", key: "mailZip", id: "mailZip" },
  { value: "mailCountry", label: "Country", key: "mailCountry", id: "mailCountry" },
  { value: "obName", label: "Owner/Ben Name", key: "obName", id: "obName" },
  { value: "obSsn", label: "SSN", key: "obSsn", id: "obSsn" },
  { value: "obRel", label: "Relationship", key: "obRel", id: "obRel" },
];

const BondRequestsSection = ({ data, onChange, currentKey, activeSavingBond }) => {
  const [isFormView, setIsFormView] = useState(false);
  const [localIndex, setLocalIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [activeTab, setActiveTab] = useState("Bond Information");

  const bondRequests = data.bondRequestRecords || [];
  const activeRecord = bondRequests[localIndex] || {};

  const fetchBondRequests = async () => {
    const emplId = data?.emplId;
    if (!emplId) return;
    try {
      const res = await api.get(`${backendUrl}/api/empl-bond-ln2`);
      const fetched = Array.isArray(res.data) ? res.data.filter(r => String(r.emplId) === String(emplId)) : [];
      onChange(currentKey, 'bondRequestRecords', fetched.map(item => ({
         ...item,
         isDirty: false,
         seqNum: item.seqNo,
         nextPurchaseFl: item.nextPurchFl,
         regType: item.regType,
         bondSeries: item.bondSeries,
         faceValue: item.bondFaceAmt,
         purchasePrice: item.bondCostAmt,
         mailName: item.designeeName,
         mailLn1: item.ln1Adr,
         mailLn2: item.ln2Adr,
         mailLn3: item.ln3Adr,
         mailCity: item.cityName,
         mailState: item.mailStDc,
         mailZip: item.postalCd,
         obName: item.bondOwnerNm,
         obSsn: item.bondOwnerSsn,
         obRel: item.beneficiaryNm
      })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bond requests.");
    }
  };

  React.useEffect(() => {
    fetchBondRequests();
  }, [data?.emplId]);

  const handleToggleView = () => setIsFormView(!isFormView);

  const handleAdd = () => {
    const newRecord = { seqNum: "", isDirty: true, tempId: `NEW_BOND_REQ_${Date.now()}` };
    const updated = [...bondRequests, newRecord];
    onChange(currentKey, 'bondRequestRecords', updated);
    setLocalIndex(updated.length - 1);
  };

  const handleDelete = async () => {
    if (selectedRows.size > 0) {
      if (window.confirm("Are you sure you want to delete selected bond requests?")) {
        const emplId = data?.emplId;
        const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
        if (!emplId || !dedCd) {
          toast.error("Please select a Saving Bond first.");
          return;
        }
        try {
          for (const id of selectedRows) {
            const record = bondRequests.find(r => String(r.tempId || r.id || r.seqNum) === String(id));
            if (record && !String(id).startsWith("NEW_")) {
              await api.delete(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${record.bondLnKey || 0}`);
            }
          }
          toast.success("Bond requests deleted successfully.");
          fetchBondRequests();
          setSelectedRows(new Set());
        } catch (err) {
          toast.error("Failed to delete bond requests.");
        }
      }
    }
  };

  const handleClear = () => {
    if (window.confirm("Discard changes?")) {
      fetchBondRequests();
    }
  };

  const handleSave = async () => {
    const emplId = data?.emplId;
    const dedCd = activeSavingBond?.deductionCode || activeSavingBond?.dedCd;
    if (!emplId || !dedCd) {
      toast.error("Please select a valid Saving Bond to add requests to.");
      return;
    }
    const dirtyRecords = bondRequests.filter(r => r.isDirty);
    if(dirtyRecords.length === 0) {
       toast.info("No changes to save");
       return;
    }

    try {
      for (const record of dirtyRecords) {
        const payload = {
          emplId: String(emplId),
          dedCd: String(dedCd),
          bondLnKey: record.bondLnKey || 0,
          seqNo: Number(record.seqNum) || 0,
          nextPurchFl: record.nextPurchaseFl === 'Y' ? 'Y' : 'N',
          emplIsOwnerFl: record.emplIsOwnerFl || "N",
          regType: record.regType || "",
          bondOwnerNm: record.obName || "",
          bondOwnerSsn: record.obSsn || "",
          coownerNm: record.coownerNm || "",
          emplIsBenFl: record.emplIsBenFl || "N",
          beneficiaryNm: record.obRel || "",
          bondSeries: record.bondSeries || "",
          bondFaceAmt: Number(record.faceValue) || 0,
          bondCostAmt: Number(record.purchasePrice) || 0,
          useEmplAddrFl: record.useEmplAddrFl || "N",
          designeeName: record.mailName || "",
          ln1Adr: record.mailLn1 || "",
          ln2Adr: record.mailLn2 || "",
          ln3Adr: record.mailLn3 || "",
          cityName: record.mailCity || "",
          mailStDc: record.mailState || "",
          postalCd: record.mailZip || "",
          modifiedBy: "SystemUser",
          timeStamp: new Date().toISOString(),
          rowVersion: record.rowVersion || 0
        };

        if (record.tempId && String(record.tempId).startsWith("NEW_")) {
          await api.post(`${backendUrl}/api/empl-bond-ln2`, payload);
        } else {
          await api.put(`${backendUrl}/api/empl-bond-ln2/${emplId}/${dedCd}/${payload.bondLnKey}`, payload);
        }
      }
      toast.success("Bond requests saved successfully.");
      fetchBondRequests();
    } catch (err) {
      toast.error(err.response?.data?.title || "Failed to save bond requests.");
    }
  };

  const handleFieldChange = (field, value) => {
    const updated = [...bondRequests];
    if (updated.length === 0) {
      updated.push({ [field]: value, isDirty: true });
      setLocalIndex(0);
    } else {
      updated[localIndex] = { ...updated[localIndex], [field]: value, isDirty: true };
    }
    onChange(currentKey, 'bondRequestRecords', updated);
  };

  const handleRowSelect = (item) => {
    const newSelected = new Set(selectedRows);
    const id = String(item.tempId || item.id || item.seqNum);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (isSelectAll, currentData) => {
    if (isSelectAll) {
      const newSelected = new Set(currentData.map(item => String(item.tempId || item.id || item.seqNum)));
      setSelectedRows(newSelected);
    } else {
      setSelectedRows(new Set());
    }
  };
  
  const handleRecordChange = (rowId, field, value) => {
    if (field === "DELETE_ROW") {
      const updated = bondRequests.filter(r => String(r.tempId || r.id || r.seqNum) !== String(rowId));
      onChange(currentKey, 'bondRequestRecords', updated);
      return;
    }
    const updated = bondRequests.map(r => 
      String(r.tempId || r.id || r.seqNum) === String(rowId) ? { ...r, [field]: value, isDirty: true } : r
    );
    onChange(currentKey, 'bondRequestRecords', updated);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bond Information":
        return (
          <div className="p-4 border border-gray-200 rounded-b-lg bg-white">
            <FormSection title="Bond Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-2">
                <div className="flex items-center gap-2 h-6 mt-1 self-end">
                  <input 
                    type="checkbox" 
                    checked={activeRecord.nextPurchaseFl === 'Y'} 
                    onChange={(e) => handleFieldChange('nextPurchaseFl', e.target.checked ? 'Y' : 'N')}
                    className="h-4 w-4 accent-[#17414d] cursor-pointer"
                  />
                  <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Next Purchase</label>
                </div>
                <FormInput 
                  label="Registration Type *" 
                  value={activeRecord.regType || ""} 
                  onChange={(e) => handleFieldChange('regType', e.target.value)} 
                />
                <FormInput 
                  label="Face Value *" 
                  value={activeRecord.faceValue || ""} 
                  onChange={(e) => handleFieldChange('faceValue', e.target.value)} 
                />

                <div className="hidden md:block"></div>
                <FormInput 
                  label="Bond Series *" 
                  value={activeRecord.bondSeries || ""} 
                  onChange={(e) => handleFieldChange('bondSeries', e.target.value)} 
                />
                <FormInput 
                  label="Purchase Price" 
                  value={activeRecord.purchasePrice || ""} 
                  onChange={(e) => handleFieldChange('purchasePrice', e.target.value)} 
                />
              </div>
            </FormSection>
          </div>
        );
      case "Mailing Address":
        return (
          <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <FormInput label="Name" value={activeRecord.mailName || ""} onChange={(e) => handleFieldChange('mailName', e.target.value)} />
              <FormInput label="Line 1" value={activeRecord.mailLn1 || ""} onChange={(e) => handleFieldChange('mailLn1', e.target.value)} />
              <FormInput label="Line 2" value={activeRecord.mailLn2 || ""} onChange={(e) => handleFieldChange('mailLn2', e.target.value)} />
              <FormInput label="Line 3" value={activeRecord.mailLn3 || ""} onChange={(e) => handleFieldChange('mailLn3', e.target.value)} />
              <FormInput label="City" value={activeRecord.mailCity || ""} onChange={(e) => handleFieldChange('mailCity', e.target.value)} />
              <FormInput label="State" value={activeRecord.mailState || ""} onChange={(e) => handleFieldChange('mailState', e.target.value)} />
              <FormInput label="Postal Code" value={activeRecord.mailZip || ""} onChange={(e) => handleFieldChange('mailZip', e.target.value)} />
              <FormInput label="Country" value={activeRecord.mailCountry || ""} onChange={(e) => handleFieldChange('mailCountry', e.target.value)} />
            </div>
          </div>
        );
      case "Owner/Beneficiary":
        return (
          <div className="p-4 border border-gray-200 rounded-b-lg space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <FormInput label="Name" value={activeRecord.obName || ""} onChange={(e) => handleFieldChange('obName', e.target.value)} />
              <FormInput label="SSN" value={activeRecord.obSsn || ""} onChange={(e) => handleFieldChange('obSsn', e.target.value)} />
              <FormInput label="Relationship" value={activeRecord.obRel || ""} onChange={(e) => handleFieldChange('obRel', e.target.value)} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Toolbar 
        title=" "
        actions={{
          onAdd: handleAdd,
          onCopy: () => {},
          onPaste: () => {},
          onClear: handleClear,
          onDelete: handleDelete,
          onSave: handleSave,
          onToggleView: handleToggleView
        }}
        isFormView={isFormView}
        isDirty={bondRequests.some(r => r.isDirty)}
      />

      {!isFormView ? (
        <div className="p-2 border border-gray-100 rounded-b-lg bg-white">
          <ReusableTable 
            data={bondRequests} 
            columns={bondRequestColumns} 
            onFieldChange={handleRecordChange} 
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            rowKey={(row) => String(row.tempId || row.id || row.seqNum || "")}
            maxHeight="max-h-48" 
          />
        </div>
      ) : (
        <div className="p-2 space-y-4 bg-white border border-gray-100 rounded-b-lg">
          <div className="px-1 mb-6 mt-2">
            <FormInput 
              label="Sequence Number *" 
              value={activeRecord.seqNum || ""} 
              onChange={(e) => handleFieldChange('seqNum', e.target.value)} 
              className="w-1/4 bg-gray-100"
            />
          </div>

          <div className="mt-4">
            <div className="flex border-b border-gray-200 bg-gray-50/50">
              {["Bond Information", "Mailing Address", "Owner/Beneficiary"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-[10px] font-bold transition-all ${
                    activeTab === tab ? "border-b-2 border-[#17414d] text-[#17414d] bg-white" : "text-gray-500 hover:text-[#17414d]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BondRequestsSection;
