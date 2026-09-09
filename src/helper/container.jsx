// import React, { useMemo, useState } from "react";
// import {
//   Search,
//   X,
//   ReplaceAll,
//   CircleArrowLeft,
//   CircleArrowRight,
//   Plus,
//   Copy,
//   ClipboardPaste,
//   Trash2,
//   Save,
//   LayoutGrid,
//   FileText,
//   ArrowBigLeftDash,
//   ArrowBigRightDash,
// } from "lucide-react";
// import { FormSearchSelect } from "./formSection";

// export const MainContainer = ({
//   icon: Icon,
//   title,
//   children,
//   handleClose,
//   className = "",
// }) => {
//   return (
//     // We add ${className} at the end of the string
//     <div
//       className={`bg-white w-full rounded-xl border border-[#17414d]/40 shadow-sm relative z-30 overflow-visible ${className}`}
//     >
//       <div className="px-3 py-2 bg-white rounded-t-xl flex items-center justify-between gap-2">
//         <div className="flex items-center gap-x-4">
//           {Icon && <Icon size={20} className="text-gray-600" />}
//           <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
//         </div>
//         <div>
//           {handleClose && (
//             <button
//               onClick={handleClose}
//               className={`p-1.5 rounded-full border transition-colors cursor-pointer bg-white border-gray-400 text-gray-500`}
//             >
//               <X size={12} />
//             </button>
//           )}
//         </div>
//       </div>
//       <div className="h-[1px] w-full mb-2 bg-[#17414d]/40 rounded-full"></div>
//       <div className="p-2 pt-0">{children}</div>
//     </div>
//   );
// };

// export const SecondaryContainer = ({
//   title,
//   children,
//   handleClose,
//   className = "",
// }) => {
//   return (
//     // IMPORTANT: Destructure 'className' above and inject it here
//     <div
//       className={`bg-white relative rounded-xl border border-[#17414d]/40 shadow-sm overflow-hidden ${className}`}
//     >
//       {title && (
//         <div className="py-1 px-3 text-white border-b mb-2 border-[#17414d]/40 flex items-center justify-between">
//           <span className="text-lg font-semibold text-gray-600">{title}</span>
//           {handleClose && (
//             <button
//               onClick={handleClose}
//               className={`p-1.5 rounded-full border transition-colors cursor-pointer bg-white border-gray-400 text-gray-500`}
//             >
//               <X size={12} />
//             </button>
//           )}
//         </div>
//       )}
//       <div className="p-2">{children}</div>
//     </div>
//   );
// };

// export const Toolbar = ({
//   // View States
//   clipboard,
//   rowKey = "id",
//   isFormView,
//   // Search/Replace Props (Table View)
//   columns = [],
//   searchValue,
//   setSearchValue,
//   // Navigation Props (Form View)
//   currentIndex,
//   totalRecords,
//   handleNavigate,
//   jumpToCode,

//   isDiscard,

//   // Action Button Props
//   actions: { onAdd, onCopy, onPaste, onClear, onDelete, onSave, onToggleView },
//   handleFindReplace,
//   // Status Props
//   selectedRow,
//   clipboardCount = 0,
//   isDirty,
//   buttonsDisable = [],
//   loading,
//   hasSelectedRows,
// }) => {
//   const isSavedRecord = selectedRow && selectedRow[rowKey];

//   // console.log(clipboard)
//   return (
//     <div className="flex items-center justify-between gap-1.5 pb-1 px-2 ">
//       {/* LEFT SECTION */}
//       <div className="flex items-center gap-4">
//         {!isFormView ? (
//           /* --- TABLE VIEW SEARCH --- */
//           <>
//             {columns && handleFindReplace && (
//               <BulkActionPanel
//                 columns={columns}
//                 onExecute={handleFindReplace}
//               />
//             )}
//             {/* If you have a Table or other components here, they must also be inside this Fragment */}
//           </>
//         ) : (
//           /* --- FORM VIEW NAVIGATOR --- */
//           <div className="flex items-center gap-3">
//             {/* --- FORM VIEW NAVIGATOR SEARCH --- */}
//             <div className="relative group">
//               <Search
//                 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#17414d] transition-colors"
//                 size={14}
//                 onClick={() => {
//                   // Use the searchValue state to jump
//                   if (searchValue) {
//                     jumpToCode(searchValue);
//                     setSearchValue(""); // Clear after jump
//                   }
//                 }}
//               />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-9 pr-3 py-1 w-48 text-[11px] border border-gray-200 rounded  outline-none"
//                 // Use a state variable to track the value
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     jumpToCode(searchValue);
//                     setSearchValue("");
//                   }
//                 }}
//               />
//             </div>

//             <div className="flex items-center rounded bg-white border border-gray-200">
//               <button
//                 onClick={() => handleNavigate("start")}
//                 disabled={currentIndex <= 0}
//                 className="px-2 py-1 disabled:opacity-50 border-r border-gray-200 bg-[#e5f3fb] cursor-pointer"
//               >
//                 <ArrowBigLeftDash size={18} strokeWidth={1.5} />
//               </button>
//               <button
//                 onClick={() => handleNavigate("prev")}
//                 disabled={currentIndex <= 0}
//                 className="px-2 py-1 disabled:opacity-50 border-r border-gray-200 bg-[#e5f3fb] cursor-pointer"
//               >
//                 <CircleArrowLeft size={18} strokeWidth={1.5} />
//               </button>
//               <span className="text-[10px] font-bold text-[#17414d] px-3">
//                 {totalRecords > 0 ? currentIndex + 1 : 0} / {totalRecords}
//               </span>
//               <button
//                 onClick={() => handleNavigate("next")}
//                 disabled={currentIndex >= totalRecords - 1}
//                 className="px-2 py-1 disabled:opacity-50 border-l border-gray-200 bg-[#e5f3fb] cursor-pointer"
//               >
//                 <CircleArrowRight size={18} strokeWidth={1.5} />
//               </button>
//               <button
//                 onClick={() => handleNavigate("end")}
//                 disabled={currentIndex >= totalRecords - 1}
//                 className="px-2 py-1 disabled:opacity-50 border-l border-gray-200 bg-[#e5f3fb] cursor-pointer"
//               >
//                 <ArrowBigRightDash size={18} strokeWidth={1.5} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* RIGHT SECTION: ACTIONS */}
//       {/* RIGHT SECTION: ACTIONS */}
//       <div className="flex items-center gap-2">
//         {!buttonsDisable.includes("add") && (
//           <ActionButton
//             disabled={loading}
//             icon={Plus}
//             onClick={onAdd}
//             title="Add New"
//           />
//         )}

//         {/* Copy Button: Always show, disable if not a saved record */}
//         {!buttonsDisable.includes("copy") && (
//           <ActionButton
//             disabled={loading}
//             icon={Copy}
//             onClick={onCopy}
//             title="Copy Row"
//             // disabled={!isSavedRecord}
//           />
//         )}

//         {!buttonsDisable.includes("paste") && clipboard?.length !== 0 && (
//           <ActionButton
//             disabled={loading}
//             icon={ClipboardPaste}
//             onClick={onPaste}
//             title={`Paste ${clipboardCount} items`}
//           />
//         )}

//         {/* Delete Button: Always show, disable if no selection and not a saved record */}
//         {!buttonsDisable.includes("delete") && (
//           <ActionButton
//             disabled={loading}
//             icon={Trash2}
//             onClick={onDelete}
//             // loading={loading}
//             title="Delete"
//             // disabled={!(hasSelectedRows || isSavedRecord)}
//           />
//         )}

//         {!buttonsDisable.includes("discard") && (
//           <ActionButton
//             disabled={isDiscard || loading}
//             icon={X}
//             onClick={onClear}
//             // disabled={!isDirty}
//             title="Discard Changes"
//           />
//         )}

//         {!buttonsDisable.includes("save") && (
//           <ActionButton
//             disabled={loading}
//             icon={Save}
//             onClick={onSave}
//             hasBadge={isDirty}
//             // disabled={!isDirty}
//             title="Save Changes"
//           />
//         )}

//         {!buttonsDisable.includes("tableform") && (
//           <ActionButton
//             disabled={loading}
//             icon={isFormView ? LayoutGrid : FileText}
//             onClick={onToggleView}
//             title={isFormView ? "Table View" : "Form View"}
//           />
//         )}
//       </div>
//     </div>
//   );
// };
// // export const Toolbar = ({
// //   // View States
// //   clipboard,
// //   rowKey = "id",
// //   isFormView,
// //   isReplaceMode,
// //   setIsReplaceMode,

// //   // Search/Replace Props (Table View)
// //   columns = [],
// //   searchColumn,
// //   setSearchColumn,
// //   searchValue,
// //   setSearchValue,
// //   replaceValue,
// //   setReplaceValue,
// //   showColumnDropdown,
// //   setShowColumnDropdown,
// //   handleFind,
// //   handleBulkReplace,

// //   // Navigation Props (Form View)
// //   currentIndex,
// //   totalRecords,
// //   handleNavigate,
// //   jumpToCode,

// //   // Action Button Props
// //   actions: { onAdd, onCopy, onPaste, onClear, onDelete, onSave, onToggleView },

// //   // Status Props
// //   selectedRow,
// //   clipboardCount = 0,
// //   isDirty,
// //   loading,
// //   hasSelectedRows,
// // }) => {
// //   const isSavedRecord = selectedRow && selectedRow[rowKey];
// //   return (
// //     <div className="flex items-center justify-between gap-1.5 pb-1 px-2 ">
// //       {/* LEFT SECTION */}
// //       <div className="flex items-center gap-4">
// //         {!isFormView ? (
// //           /* --- TABLE VIEW SEARCH --- */
// //           <div className="flex items-center gap-2 bg-white">
// //             <div className="relative w-40">
// //               {" "}
// //               {/* Fixed width to keep toolbar stable */}
// //               <FormSearchSelectInline
// //                 value={
// //                   columns.find((c) => c.value === searchColumn)?.label ||
// //                   "Select Column"
// //                 }
// //                 options={columns}
// //                 displayKey="label"
// //                 onSelect={(selectedCol) => {
// //                   setSearchColumn(selectedCol.value);
// //                   setSearchValue(""); // Clear search when switching columns
// //                 }}
// //               />
// //             </div>

// //             <input
// //               type={
// //                 columns.find((c) => c.value === searchColumn)?.type || "text"
// //               }
// //               placeholder="Find..."
// //               className="pl-2 pr-3 py-1.5 w-48 text-[11px] border border-gray-200 rounded  outline-none bg-white"
// //               value={searchValue}
// //               onChange={(e) => setSearchValue(e.target.value)}
// //             />

// //             <button
// //               onClick={() => setIsReplaceMode(!isReplaceMode)}
// //               // Disable if the column doesn't allow replacement (unless we are already in replace mode and need to exit)
// //               disabled={
// //                 !isReplaceMode &&
// //                 columns.find((c) => c.value === searchColumn)?.allowReplace ===
// //                   false
// //               }
// //               className={`p-1 rounded border border-gray-200 transition-colors
// //     ${
// //       !isReplaceMode &&
// //       columns.find((c) => c.value === searchColumn)?.allowReplace === false
// //         ? "text-gray-300 cursor-not-allowed bg-gray-50"
// //         : "text-gray-800 cursor-pointer hover:bg-gray-50"
// //     }`}
// //               title={
// //                 !isReplaceMode &&
// //                 columns.find((c) => c.value === searchColumn)?.allowReplace ===
// //                   false
// //                   ? "Bulk Replace not available for this column"
// //                   : isReplaceMode
// //                     ? "Close Replace"
// //                     : "Bulk Replace"
// //               }
// //             >
// //               {isReplaceMode ? <X size={14} /> : <ReplaceAll size={14} />}
// //             </button>

// //             {isReplaceMode && (
// //               <input
// //                 type={
// //                   columns.find((c) => c.value === searchColumn)?.type || "text"
// //                 }
// //                 placeholder="Replace with..."
// //                 className="pl-2 pr-3 py-1.5 w-48 text-[11px] border border-gray-200 rounded  outline-none bg-white"
// //                 value={replaceValue}
// //                 onChange={(e) => setReplaceValue(e.target.value)}
// //                 disabled={
// //                   columns.find((c) => c.value === searchColumn)
// //                     ?.allowReplace === false
// //                 }
// //               />
// //             )}

// //             <button
// //               onClick={isReplaceMode ? handleBulkReplace : handleFind}
// //               className="bg-[#17414d] text-white px-4 py-1 rounded text-[10px] font-bold hover:bg-[#12333d]"
// //             >
// //               {isReplaceMode ? "Replace" : "Search"}
// //             </button>
// //           </div>
// //         ) : (
// //           /* --- FORM VIEW NAVIGATOR --- */
// //           <div className="flex items-center gap-3">
// //             {/* --- FORM VIEW NAVIGATOR SEARCH --- */}
// //             <div className="relative group">
// //               <Search
// //                 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#17414d] transition-colors"
// //                 size={14}
// //                 onClick={() => {
// //                   // Use the searchValue state to jump
// //                   if (searchValue) {
// //                     jumpToCode(searchValue);
// //                     setSearchValue(""); // Clear after jump
// //                   }
// //                 }}
// //               />
// //               <input
// //                 type="text"
// //                 placeholder="Search..."
// //                 className="pl-9 pr-3 py-1.5 w-48 text-[11px] border border-gray-200 rounded  outline-none focus:border-[#17414d]"
// //                 // Use a state variable to track the value
// //                 value={searchValue}
// //                 onChange={(e) => setSearchValue(e.target.value)}
// //                 onKeyDown={(e) => {
// //                   if (e.key === "Enter") {
// //                     jumpToCode(searchValue);
// //                     setSearchValue("");
// //                   }
// //                 }}
// //               />
// //             </div>

// //             <div className="flex items-center rounded bg-white border border-gray-200">
// //               <button
// //                 onClick={() => handleNavigate("prev")}
// //                 disabled={currentIndex <= 0}
// //                 className="px-2 py-1.5 disabled:opacity-50 border-r border-gray-200 bg-[#e5f3fb]"
// //               >
// //                 <CircleArrowLeft size={18} strokeWidth={1.5} />
// //               </button>
// //               <span className="text-[10px] font-bold text-[#17414d] px-3">
// //                 {totalRecords > 0 ? currentIndex + 1 : 0} / {totalRecords}
// //               </span>
// //               <button
// //                 onClick={() => handleNavigate("next")}
// //                 disabled={currentIndex >= totalRecords - 1}
// //                 className="px-2 py-1.5 disabled:opacity-50 border-l border-gray-200 bg-[#e5f3fb]"
// //               >
// //                 <CircleArrowRight size={18} strokeWidth={1.5} />
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* RIGHT SECTION: ACTIONS */}
// //       <div className="flex items-center gap-2">
// //         <ActionButton icon={Plus} onClick={onAdd} title="Add New" />

// //         {isSavedRecord && (
// //           <ActionButton icon={Copy} onClick={onCopy} title="Copy Row" />
// //         )}

// //         {clipboard?.length !== 0 && (
// //           <ActionButton
// //             icon={ClipboardPaste}
// //             onClick={onPaste}
// //             title={`Paste ${clipboardCount} items`}
// //           />
// //         )}

// //         {(hasSelectedRows || isSavedRecord) && (
// //           <ActionButton
// //             icon={Trash2}
// //             onClick={onDelete}
// //             loading={loading}
// //             title="Delete"
// //           />
// //         )}

// //         {isDirty && (
// //           <ActionButton icon={X} onClick={onClear} title="Discard Changes" />
// //         )}

// //         <ActionButton
// //           icon={Save}
// //           onClick={onSave}
// //           hasBadge={isDirty}
// //           disabled={!isDirty}
// //           title="Save Changes"
// //         />

// //         <ActionButton
// //           icon={isFormView ? LayoutGrid : FileText}
// //           onClick={onToggleView}
// //           title={isFormView ? "Table View" : "Form View"}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// export const ActionButton = ({
//   icon: Icon,
//   onClick,
//   loading = false,
//   variant = "default", // default, success, danger, warning
//   title,
//   disabled = false,
//   hasBadge = false, // The "unsaved changes" pulse dot
// }) => {
//   const variants = {
//     default:
//       "text-[#17414d] hover:bg-[#17414d] hover:text-white border-gray-200",
//     success:
//       "text-emerald-600 hover:bg-emerald-600 hover:text-white border-qemerald-100",
//     danger: "text-rose-500 hover:bg-rose-500 hover:text-white border-rose-100",
//     warning:
//       "text-amber-600 hover:bg-amber-600 hover:text-white border-amber-100",
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled || loading}
//       title={title}
//       className={` cursor-pointer
//         relative flex items-center justify-center w-8 h-8 
//         rounded-lg border transition-all duration-200 shadow
//         disabled:opacity-40 disabled:cursor-not-allowed active:scale-90
//         ${variants[variant]}
//       `}
//     >
//       {/* {loading ? (
//         <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//       ) : ( */}
//       <Icon size={18} strokeWidth={1.5} />
//       {/* )} */}

//       {/* Unsaved Changes Pulse Dot */}
//       {hasBadge && !loading && (
//         <span className="absolute -top-1 -right-1 flex h-3 w-3">
//           {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span> */}
//           {/* <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border-2 border-white"></span> */}
//         </span>
//       )}
//     </button>
//   );
// };

// export const FormSearchSelectInline = ({
//   value,
//   options,
//   onSelect,
//   displayKey,
//   disabled,
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [localSearch, setLocalSearch] = useState("");

//   const filtered = options.filter((opt) =>
//     (opt[displayKey] || "").toLowerCase().includes(localSearch.toLowerCase()),
//   );

//   return (
//     <div className="relative w-full">
//       <div className="relative flex items-center">
//         <input
//           type="text"
//           readOnly={!showDropdown} // Toggle readonly to allow typing only when open
//           disabled={disabled}
//           className={`w-full border outline-none border-gray-200 pl-2 pr-8 py-1.5 rounded text-[11px] 
//             ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:border-[#17414d]"}`}
//           value={showDropdown ? localSearch : value || ""}
//           placeholder={showDropdown ? "Search columns..." : ""}
//           onChange={(e) => setLocalSearch(e.target.value)}
//           onFocus={() => !disabled && setShowDropdown(true)}
//         />
//         <div
//           className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
//           onClick={() => !disabled && setShowDropdown(!showDropdown)}
//         >
//           <Search size={12} />
//         </div>
//       </div>

//       {showDropdown && !disabled && (
//         <>
//           <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
//             {filtered.length > 0 ? (
//               filtered.map((opt, idx) => (
//                 <div
//                   key={idx}
//                   className="p-2 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
//                   onClick={() => {
//                     onSelect(opt);
//                     setLocalSearch("");
//                     setShowDropdown(false);
//                   }}
//                 >
//                   <span className="font-medium text-gray-700">
//                     {opt[displayKey]}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="p-3 text-[10px] text-gray-400 italic text-center">
//                 No results
//               </div>
//             )}
//           </div>
//           {/* Backdrop to close */}
//           <div
//             className="fixed inset-0 z-[90]"
//             onClick={() => setShowDropdown(false)}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// // Assuming your icons and FormSearchSelect are imported
// // import { ReplaceAll, Search } from 'lucide-react';

// // const BulkActionPanel = ({ columns = [], onExecute }) => {
// //   const [replaceMode, setReplaceMode] = useState(false);
// //   const [columnSearch, setColumnSearch] = useState("");
// //   const [valueSearch, setValueSearch] = useState("");
// //   const [replaceValueSearch, setReplaceValueSearch] = useState("");

// //   const [config, setConfig] = useState({
// //     column: "",
// //     findYear: "",
// //     findMonth: "",
// //     replaceYear: "",
// //     replaceMonth: "",
// //     replaceValue: "",
// //     booleanMode: "setAll",
// //   });

// //   const currentColConfig = useMemo(
// //     () => columns.find((c) => c.id === config.column),
// //     [config.column, columns],
// //   );

// //   const canReplace = currentColConfig?.allowReplace !== false;

// //   const handleChange = (update) =>
// //     setConfig((prev) => ({ ...prev, ...update }));

// //   const renderInputs = (isReplaceSection = false) => {
// //     const type = currentColConfig?.type;
// //     const prefix = isReplaceSection ? "replace" : "find";
// //     const options = currentColConfig?.options || [];

// //     switch (type) {
// //       case "date":
// //         return (
// //           <div className="flex gap-1">
// //             <input
// //               type="text"
// //               placeholder="YYYY"
// //               maxLength={4}
// //               className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-14 text-center text-[10px] text-black"
// //               value={config[`${prefix}Year`]}
// //               onChange={(e) =>
// //                 handleChange({
// //                   [`${prefix}Year`]: e.target.value.replace(/\D/g, ""),
// //                 })
// //               }
// //             />
// //             <input
// //               type="text"
// //               placeholder="MM"
// //               maxLength={2}
// //               className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-10 text-center text-[10px] text-black"
// //               value={config[`${prefix}Month`]}
// //               onChange={(e) =>
// //                 handleChange({
// //                   [`${prefix}Month`]: e.target.value.replace(/\D/g, ""),
// //                 })
// //               }
// //             />
// //           </div>
// //         );

// //       case "flag":
// //         if (isReplaceSection) {
// //           const showAllOption = config.booleanMode === "inverted";
// //           return (
// //             <select
// //               className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-16 bg-white text-[10px] text-black"
// //               value={config.replaceValue}
// //               onChange={(e) => handleChange({ replaceValue: e.target.value })}
// //             >
// //               {showAllOption && <option value="All">All</option>}
// //               <option value="Y">Y</option>
// //               <option value="N">N</option>
// //             </select>
// //           );
// //         }
// //         return (
// //           <select
// //             className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-28 bg-white text-[10px] text-black"
// //             value={config.booleanMode}
// //             onChange={(e) =>
// //               handleChange({ booleanMode: e.target.value, replaceValue: "Y" })
// //             }
// //           >
// //             <option value="setAll">Set All To</option>
// //             <option value="inverted">Invert Values</option>
// //           </select>
// //         );

// //       case "select":
// //         return (
// //           <div className="w-48">
// //             <FormSearchSelect
// //               placeholder={
// //                 isReplaceSection ? "Select Replacement..." : "Search All..."
// //               }
// //               options={options}
// //               displayKey="label"
// //               value={isReplaceSection ? config.replaceValue : config.findYear}
// //               searchTerm={isReplaceSection ? replaceValueSearch : valueSearch}
// //               setSearchTerm={
// //                 isReplaceSection ? setReplaceValueSearch : setValueSearch
// //               }
// //               onSelect={(opt) => {
// //                 handleChange({
// //                   [isReplaceSection ? "replaceValue" : "findYear"]: opt.value,
// //                 });
// //               }}
// //             />
// //           </div>
// //         );

// //       default:
// //         return (
// //           <input
// //             type={type === "number" ? "number" : "text"}
// //             className="border px-1 py-0.5 border-gray-200 rounded outline-none w-32 text-[10px] text-black"
// //             value={isReplaceSection ? config.replaceValue : config.findYear}
// //             onChange={(e) =>
// //               handleChange({
// //                 [isReplaceSection ? "replaceValue" : "findYear"]:
// //                   e.target.value,
// //               })
// //             }
// //           />
// //         );
// //     }
// //   };

// //   return (
// //     <div className="flex flex-wrap items-center gap-2">
// //       {/* 1. Main Column Selection using FormSearchSelect */}
// //       <div className="w-48">
// //         <FormSearchSelect
// //           placeholder="Select Column"
// //           options={columns}
// //           displayKey="label"
// //           value={columns.find((c) => c.id === config.column)?.label || ""}
// //           searchTerm={columnSearch}
// //           setSearchTerm={setColumnSearch}
// //           onSelect={(opt) => {
// //             handleChange({ column: opt.id, findYear: "", replaceValue: "" });
// //             setValueSearch("");
// //             setReplaceValueSearch("");
// //           }}
// //         />
// //       </div>

// //       {/* Find/Replace Section */}
// //       <div className="flex items-center gap-1">
// //         {/* {config.column && ( */}
// //         <>
// //           <div className="flex items-center">{renderInputs(false)}</div>

// //           {canReplace && (
// //             <button
// //               onClick={() => setReplaceMode(!replaceMode)}
// //               className={`p-1 cursor-pointer rounded border transition-colors ${replaceMode ? "bg-gray-100 border-gray-500 text-gray-600" : "bg-white border-gray-400 text-gray-500"}`}
// //             >
// //               <ReplaceAll size={12} />
// //             </button>
// //           )}

// //           {replaceMode && canReplace && (
// //             <>
// //               <div className="font-bold fex items-center text-gray-400">→</div>
// //               <div className="flex items-center">{renderInputs(true)}</div>
// //             </>
// //           )}

// //           <button
// //             onClick={() => onExecute(config, replaceMode)}
// //             className="px-3 py-0.5 rounded font-medium text-[10px] text-white bg-[#17414d]/95 hover:bg-[#17414d]"
// //           >
// //             {replaceMode ? "Apply" : "Search"}
// //           </button>
// //         </>
// //         {/* )} */}
// //       </div>
// //     </div>
// //   );
// // };

// const BulkActionPanel = ({ columns = [], onExecute }) => {
//   const [replaceMode, setReplaceMode] = useState(false);
//   const [columnSearch, setColumnSearch] = useState("");
//   const [valueSearch, setValueSearch] = useState("");
//   const [replaceValueSearch, setReplaceValueSearch] = useState("");

//   const [config, setConfig] = useState({
//     column: "",
//     findYear: "",
//     findMonth: "",
//     replaceYear: "",
//     replaceMonth: "",
//     replaceValue: "",
//     booleanMode: "setAll",
//   });

//   const currentColConfig = useMemo(
//     () => columns.find((c) => c.id === config.column),
//     [config.column, columns],
//   );

//   const canReplace = currentColConfig?.allowReplace !== false;

//   const handleChange = (update) =>
//     setConfig((prev) => ({ ...prev, ...update }));

//   const renderInputs = (isReplaceSection = false) => {
//     const type = currentColConfig?.type;
//     const prefix = isReplaceSection ? "replace" : "find";
//     const options = currentColConfig?.options || [];

//     switch (type) {
//       case "date":
//         return (
//           <div className="flex gap-1">
//             <input
//               type="text"
//               placeholder="YYYY"
//               maxLength={4}
//               className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-14 text-center text-[10px] text-black"
//               value={config[`${prefix}Year`]}
//               onChange={(e) =>
//                 handleChange({
//                   [`${prefix}Year`]: e.target.value.replace(/\D/g, ""),
//                 })
//               }
//             />
//             <input
//               type="text"
//               placeholder="MM"
//               maxLength={2}
//               className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-10 text-center text-[10px] text-black"
//               value={config[`${prefix}Month`]}
//               onChange={(e) =>
//                 handleChange({
//                   [`${prefix}Month`]: e.target.value.replace(/\D/g, ""),
//                 })
//               }
//             />
//           </div>
//         );

//       case "flag":
//         if (isReplaceSection) {
//           const showAllOption = config.booleanMode === "inverted";
//           return (
//             <select
//               className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-16 bg-white text-[10px] text-black"
//               value={config.replaceValue}
//               onChange={(e) => handleChange({ replaceValue: e.target.value })}
//             >
//               {showAllOption && <option value="All">All</option>}
//               <option value="Y">Y</option>
//               <option value="N">N</option>
//             </select>
//           );
//         }
//         return (
//           <select
//             className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-28 bg-white text-[10px] text-black"
//             value={config.booleanMode}
//             onChange={(e) =>
//               handleChange({ booleanMode: e.target.value, replaceValue: "Y" })
//             }
//           >
//             <option value="setAll">Set All To</option>
//             <option value="inverted">Invert Values</option>
//           </select>
//         );

//       case "select":
//         return (
//           <div className="w-48">
//             <FormSearchSelect
//               placeholder={
//                 isReplaceSection ? "Select Replacement..." : "Search All..."
//               }
//               options={options}
//               displayKey="label"
//               value={isReplaceSection ? config.replaceValue : config.findYear}
//               searchTerm={isReplaceSection ? replaceValueSearch : valueSearch}
//               setSearchTerm={
//                 isReplaceSection ? setReplaceValueSearch : setValueSearch
//               }
//               onSelect={(opt) => {
//                 handleChange({
//                   [isReplaceSection ? "replaceValue" : "findYear"]: opt.value,
//                 });
//               }}
//             />
//           </div>
//         );

//       default:
//         return (
//           <input
//             type={type === "number" ? "number" : "text"}
//             placeholder={prefix}
//             className="border px-1 py-0.5 border-gray-200 rounded outline-none w-32 text-[10px] text-black"
//             value={isReplaceSection ? config.replaceValue : config.findYear}
//             onChange={(e) =>
//               handleChange({
//                 [isReplaceSection ? "replaceValue" : "findYear"]:
//                   e.target.value,
//               })
//             }
//           />
//         );
//     }
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-2">
//       {/* 1. Main Column Selection using FormSearchSelect */}
//       <div className="w-48">
//         <FormSearchSelect
//           placeholder="Select Column"
//           options={columns}
//           displayKey="label"
//           value={columns.find((c) => c.id === config.column)?.label || ""}
//           searchTerm={columnSearch}
//           setSearchTerm={setColumnSearch}
//           onSelect={(opt) => {
//             handleChange({ column: opt.id, findYear: "", replaceValue: "" });
//             setValueSearch("");
//             setReplaceValueSearch("");
//           }}
//         />
//       </div>

//       {/* Find/Replace Section */}
//       <div className="flex items-center gap-1">
//         {/* {config.column && ( */}
//         <>
//           <div className="flex items-center">{renderInputs(false)}</div>

//           {canReplace && (
//             <button
//               onClick={() => setReplaceMode(!replaceMode)}
//               className={`p-1 cursor-pointer rounded border transition-colors ${replaceMode ? "bg-gray-100 border-gray-500 text-gray-600" : "bg-white border-gray-400 text-gray-500"}`}
//             >
//               <ReplaceAll size={12} />
//             </button>
//           )}

//           {replaceMode && canReplace && (
//             <>
//               <div className="font-bold fex items-center text-gray-400">→</div>
//               <div className="flex items-center">{renderInputs(true)}</div>
//             </>
//           )}

//           <button
//             onClick={() => onExecute(config, replaceMode)}
//             className="px-3 py-0.5 rounded font-medium text-[10px] text-white bg-[#17414d]/95 hover:bg-[#17414d]"
//           >
//             {replaceMode ? "Apply" : "Search"}
//           </button>
//         </>
//         {/* )} */}
//       </div>
//     </div>
//   );
// };

import React, { useMemo, useState } from "react";
import {
  Search,
  X,
  ReplaceAll,
  CircleArrowLeft,
  CircleArrowRight,
  Plus,
  Copy,
  ClipboardPaste,
  Trash2,
  Save,
  LayoutGrid,
  FileText,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  ChevronDown,
  ChevronsLeft,
ChevronLeft,
ChevronRight,
ChevronsRight,
} from "lucide-react";
import { FormSearchSelect } from "./formSection";

export const MainContainer = ({
  icon: Icon,
  title,
  children,
  handleClose,
  className = "",
  variant = "",
}) => {
  return (
    // We add ${className} at the end of the string
    <div
      className={`bg-white w-full rounded-xl border border-[#17414d]/40 shadow-sm relative z-30 overflow-visible ${variant ? `main-container-${variant}` : ""} ${className}`}
    >
      <div className="px-3 py-2 bg-white rounded-t-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-x-4">
          {Icon && <Icon size={20} className="text-gray-600" />}
          <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
        </div>
        <div>
          {handleClose && (
            <button
              onClick={handleClose}
              className={`p-1.5 rounded-full border transition-colors cursor-pointer bg-white border-gray-400 text-gray-500`}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
      <div className="h-[1px] w-full mb-2 bg-[#17414d]/40 rounded-full"></div>
      <div className="p-2 pt-0">{children}</div>
    </div>
  );
};

export const SecondaryContainer = ({
  title,
  children,
  handleClose,
  className = "",
  variant = "",
}) => {
  return (
    // IMPORTANT: Destructure 'className' above and inject it here
    <div
      className={`bg-white relative rounded-xl border border-[#17414d]/40 shadow-sm overflow-hidden ${variant ? `secondary-container-${variant}` : ""} ${className}`}
    >
      {title && (
        <div className="py-1 px-3 text-white border-b mb-2 border-[#17414d]/40 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-600">{title}</span>
          {handleClose && (
            <button
              onClick={handleClose}
              className={`p-1.5 rounded-full border transition-colors cursor-pointer bg-white border-gray-400 text-gray-500`}
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}
      <div className="p-0">{children}</div>
    </div>
  );
};

export const Toolbar = ({
  // View States
  clipboard,
  rowKey = "id",
  isFormView,

  // Search/Replace Props
  columns = [],
  searchValue,
  setSearchValue,

  // Navigation Props
  currentIndex,
  totalRecords,
  handleNavigate,
  jumpToCode,

  isDiscard,

  // Action Button Props
  actions: {
    onAdd,
    onCopy,
    onPaste,
    onClear,
    onDelete,
    onSave,
    onToggleView,
  },

  handleFindReplace,

  // Status Props
  selectedRow,
  clipboardCount = 0,
  isDirty,
  buttonsDisable = [],
  loading,
  hasSelectedRows,
  variant = "",
}) => {
  const isSavedRecord = selectedRow && selectedRow[rowKey];

  return (
    <div
      className={`flex items-center justify-between gap-1.5 pb-1 px-2 toolbar-${variant}`}
    >
      {/* =========================================================
          LEFT SECTION
          ========================================================= */}
      <div className="flex items-center gap-4">
        {!isFormView ? (
          /* ================= TABLE VIEW ================= */
          <>
            {columns && handleFindReplace && (
              <BulkActionPanel
                columns={columns}
                onExecute={handleFindReplace}
              />
            )}
          </>
        ) : (
          /* ================= FORM VIEW ================= */
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="relative group">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#17414d] transition-colors"
                size={14}
                onClick={() => {
                  if (searchValue) {
                    jumpToCode(searchValue);
                    setSearchValue("");
                  }
                }}
              />

              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-1 w-48 text-[11px] border border-gray-200 rounded outline-none"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    jumpToCode(searchValue);
                    setSearchValue("");
                  }
                }}
              />
            </div>

           {/* =================================================
    FORM NAVIGATION
    ================================================= */}
<div className="flex items-center rounded-md border border-[#d5dfeb] bg-[#f5f8fb] overflow-hidden">

  {/* FIRST RECORD */}
  <button
    type="button"
    onClick={() => handleNavigate("start")}
    disabled={currentIndex <= 0}
    className="flex h-[30px] w-[34px] items-center justify-center border-r border-[#d5dfeb] bg-[#f5f8fb] text-[#718096] transition-colors hover:bg-[#eaf1f7] hover:text-[#17414d] disabled:cursor-not-allowed disabled:opacity-50"
    title="First record"
  >
    <ChevronsLeft size={16} strokeWidth={1.5} />
  </button>

  {/* PREVIOUS RECORD */}
  <button
    type="button"
    onClick={() => handleNavigate("prev")}
    disabled={currentIndex <= 0}
    className="flex h-[30px] w-[34px] items-center justify-center border-r border-[#d5dfeb] bg-[#f5f8fb] text-[#718096] transition-colors hover:bg-[#eaf1f7] hover:text-[#17414d] disabled:cursor-not-allowed disabled:opacity-50"
    title="Previous record"
  >
    <ChevronLeft size={16} strokeWidth={1.5} />
  </button>

  {/* RECORD COUNT */}
  <span className="flex h-[30px] min-w-[48px] items-center justify-center bg-white px-2 text-[11px] font-bold text-[#17414d]">
    {totalRecords > 0 ? currentIndex + 1 : 0} / {totalRecords}
  </span>

  {/* NEXT RECORD */}
  <button
    type="button"
    onClick={() => handleNavigate("next")}
    disabled={currentIndex >= totalRecords - 1}
    className="flex h-[30px] w-[34px] items-center justify-center border-l border-[#d5dfeb] bg-[#f5f8fb] text-[#718096] transition-colors hover:bg-[#eaf1f7] hover:text-[#17414d] disabled:cursor-not-allowed disabled:opacity-50"
    title="Next record"
  >
    <ChevronRight size={16} strokeWidth={1.5} />
  </button>

  {/* LAST RECORD */}
  <button
    type="button"
    onClick={() => handleNavigate("end")}
    disabled={currentIndex >= totalRecords - 1}
    className="flex h-[30px] w-[34px] items-center justify-center bg-[#f5f8fb] text-[#718096] transition-colors hover:bg-[#eaf1f7] hover:text-[#17414d] disabled:cursor-not-allowed disabled:opacity-50"
    title="Last record"
  >
    <ChevronsRight size={16} strokeWidth={1.5} />
  </button>

</div>
          </div>
        )}
      </div>

      {/* =========================================================
          RIGHT SECTION - ACTION BUTTONS
          ========================================================= */}
      <div className="flex items-center gap-2">

        {/* CREATE */}
        {!buttonsDisable.includes("add") && (
          <button
            type="button"
            className="voucher-primary-btn"
            disabled={loading}
            onClick={onAdd}
          >
            <Plus size={14} />
            Create
          </button>
        )}

        {/* COPY */}
        {!buttonsDisable.includes("copy") && (
          <button
            type="button"
            className="voucher-head-btn"
            disabled={loading}
            onClick={onCopy}
          >
            <Copy size={14} />
            Copy
          </button>
        )}

       {/* PASTE */}
{!buttonsDisable.includes("paste") && onPaste && (
  <button
    type="button"
    className="voucher-head-btn"
    disabled={loading || clipboard?.length === 0}
    onClick={onPaste}
  >
    <ClipboardPaste size={14} />
    Paste
  </button>
)}

        {/* DELETE */}
        {!buttonsDisable.includes("delete") && (
          <button
            type="button"
            className="voucher-head-btn"
            disabled={loading}
            onClick={onDelete}
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}

        {/* CANCEL */}
        {!buttonsDisable.includes("discard") && (
          <button
            type="button"
            className="voucher-head-btn"
            disabled={isDiscard || loading}
            onClick={onClear}
          >
            Cancel
          </button>
        )}

        {/* SAVE */}
        {!buttonsDisable.includes("save") && (
          <button
            type="button"
            className="voucher-primary-btn"
            disabled={loading}
            onClick={onSave}
          >
            <Save size={14} />
            Save
          </button>
        )}

        {/* =====================================================
            FORM / TABLE SLIDING SWITCH
            ===================================================== */}
        {!buttonsDisable.includes("tableform") && (
          <button
            type="button"
            onClick={onToggleView}
            disabled={loading}
            className="relative flex h-[30px] w-[82px] items-center rounded-full border border-[#d5dfeb] bg-[#f5f8fb] p-[3px] transition-all duration-200 disabled:opacity-50"
          >
            {/* Sliding Background */}
            <span
              className={`absolute top-[3px] h-[24px] w-[38px] rounded-full bg-white shadow-sm transition-all duration-200 ${
                isFormView
                  ? "left-[3px]"
                  : "left-[41px]"
              }`}
            />

            {/* FORM */}
            <span
              className={`relative z-10 flex w-1/2 items-center justify-center text-[10px] font-semibold transition-colors ${
                isFormView
                  ? "text-[#1677e8]"
                  : "text-[#7b8798]"
              }`}
            >
              Form
            </span>

            {/* TABLE */}
            <span
              className={`relative z-10 flex w-1/2 items-center justify-center text-[10px] font-semibold transition-colors ${
                !isFormView
                  ? "text-[#1677e8]"
                  : "text-[#7b8798]"
              }`}
            >
              Table
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
// export const Toolbar = ({
//   // View States
//   clipboard,
//   rowKey = "id",
//   isFormView,
//   isReplaceMode,
//   setIsReplaceMode,

//   // Search/Replace Props (Table View)
//   columns = [],
//   searchColumn,
//   setSearchColumn,
//   searchValue,
//   setSearchValue,
//   replaceValue,
//   setReplaceValue,
//   showColumnDropdown,
//   setShowColumnDropdown,
//   handleFind,
//   handleBulkReplace,

//   // Navigation Props (Form View)
//   currentIndex,
//   totalRecords,
//   handleNavigate,
//   jumpToCode,

//   // Action Button Props
//   actions: { onAdd, onCopy, onPaste, onClear, onDelete, onSave, onToggleView },

//   // Status Props
//   selectedRow,
//   clipboardCount = 0,
//   isDirty,
//   loading,
//   hasSelectedRows,
// }) => {
//   const isSavedRecord = selectedRow && selectedRow[rowKey];
//   return (
//     <div className="flex items-center justify-between gap-1.5 pb-1 px-2 ">
//       {/* LEFT SECTION */}
//       <div className="flex items-center gap-4">
//         {!isFormView ? (
//           /* --- TABLE VIEW SEARCH --- */
//           <div className="flex items-center gap-2 bg-white">
//             <div className="relative w-40">
//               {" "}
//               {/* Fixed width to keep toolbar stable */}
//               <FormSearchSelectInline
//                 value={
//                   columns.find((c) => c.value === searchColumn)?.label ||
//                   "Select Column"
//                 }
//                 options={columns}
//                 displayKey="label"
//                 onSelect={(selectedCol) => {
//                   setSearchColumn(selectedCol.value);
//                   setSearchValue(""); // Clear search when switching columns
//                 }}
//               />
//             </div>

//             <input
//               type={
//                 columns.find((c) => c.value === searchColumn)?.type || "text"
//               }
//               placeholder="Find..."
//               className="pl-2 pr-3 py-1.5 w-48 text-[11px] border border-gray-200 rounded  outline-none bg-white"
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//             />

//             <button
//               onClick={() => setIsReplaceMode(!isReplaceMode)}
//               // Disable if the column doesn't allow replacement (unless we are already in replace mode and need to exit)
//               disabled={
//                 !isReplaceMode &&
//                 columns.find((c) => c.value === searchColumn)?.allowReplace ===
//                   false
//               }
//               className={`p-1 rounded border border-gray-200 transition-colors
//     ${
//       !isReplaceMode &&
//       columns.find((c) => c.value === searchColumn)?.allowReplace === false
//         ? "text-gray-300 cursor-not-allowed bg-gray-50"
//         : "text-gray-800 cursor-pointer hover:bg-gray-50"
//     }`}
//               title={
//                 !isReplaceMode &&
//                 columns.find((c) => c.value === searchColumn)?.allowReplace ===
//                   false
//                   ? "Bulk Replace not available for this column"
//                   : isReplaceMode
//                     ? "Close Replace"
//                     : "Bulk Replace"
//               }
//             >
//               {isReplaceMode ? <X size={14} /> : <ReplaceAll size={14} />}
//             </button>

//             {isReplaceMode && (
//               <input
//                 type={
//                   columns.find((c) => c.value === searchColumn)?.type || "text"
//                 }
//                 placeholder="Replace with..."
//                 className="pl-2 pr-3 py-1.5 w-48 text-[11px] border border-gray-200 rounded  outline-none bg-white"
//                 value={replaceValue}
//                 onChange={(e) => setReplaceValue(e.target.value)}
//                 disabled={
//                   columns.find((c) => c.value === searchColumn)
//                     ?.allowReplace === false
//                 }
//               />
//             )}

//             <button
//               onClick={isReplaceMode ? handleBulkReplace : handleFind}
//               className="bg-[#17414d] text-white px-4 py-1 rounded text-[10px] font-bold hover:bg-[#12333d]"
//             >
//               {isReplaceMode ? "Replace" : "Search"}
//             </button>
//           </div>
//         ) : (
//           /* --- FORM VIEW NAVIGATOR --- */
//           <div className="flex items-center gap-3">
//             {/* --- FORM VIEW NAVIGATOR SEARCH --- */}
//             <div className="relative group">
//               <Search
//                 className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#17414d] transition-colors"
//                 size={14}
//                 onClick={() => {
//                   // Use the searchValue state to jump
//                   if (searchValue) {
//                     jumpToCode(searchValue);
//                     setSearchValue(""); // Clear after jump
//                   }
//                 }}
//               />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-9 pr-3 py-1.5 w-48 text-[11px] border border-gray-200 rounded  outline-none focus:border-[#17414d]"
//                 // Use a state variable to track the value
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     jumpToCode(searchValue);
//                     setSearchValue("");
//                   }
//                 }}
//               />
//             </div>

//             <div className="flex items-center rounded bg-white border border-gray-200">
//               <button
//                 onClick={() => handleNavigate("prev")}
//                 disabled={currentIndex <= 0}
//                 className="px-2 py-1.5 disabled:opacity-50 border-r border-gray-200 bg-[#e5f3fb]"
//               >
//                 <CircleArrowLeft size={18} strokeWidth={1.5} />
//               </button>
//               <span className="text-[10px] font-bold text-[#17414d] px-3">
//                 {totalRecords > 0 ? currentIndex + 1 : 0} / {totalRecords}
//               </span>
//               <button
//                 onClick={() => handleNavigate("next")}
//                 disabled={currentIndex >= totalRecords - 1}
//                 className="px-2 py-1.5 disabled:opacity-50 border-l border-gray-200 bg-[#e5f3fb]"
//               >
//                 <CircleArrowRight size={18} strokeWidth={1.5} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* RIGHT SECTION: ACTIONS */}
//       <div className="flex items-center gap-2">
//         <ActionButton icon={Plus} onClick={onAdd} title="Add New" />

//         {isSavedRecord && (
//           <ActionButton icon={Copy} onClick={onCopy} title="Copy Row" />
//         )}

//         {clipboard?.length !== 0 && (
//           <ActionButton
//             icon={ClipboardPaste}
//             onClick={onPaste}
//             title={`Paste ${clipboardCount} items`}
//           />
//         )}

//         {(hasSelectedRows || isSavedRecord) && (
//           <ActionButton
//             icon={Trash2}
//             onClick={onDelete}
//             loading={loading}
//             title="Delete"
//           />
//         )}

//         {isDirty && (
//           <ActionButton icon={X} onClick={onClear} title="Discard Changes" />
//         )}

//         <ActionButton
//           icon={Save}
//           onClick={onSave}
//           hasBadge={isDirty}
//           disabled={!isDirty}
//           title="Save Changes"
//         />

//         <ActionButton
//           icon={isFormView ? LayoutGrid : FileText}
//           onClick={onToggleView}
//           title={isFormView ? "Table View" : "Form View"}
//         />
//       </div>
//     </div>
//   );
// };

export const ActionButton = ({
  icon: Icon,
  onClick,
  loading = false,
  variant = "default", // default, success, danger, warning
  title,
  disabled = false,
  hasBadge = false, // The "unsaved changes" pulse dot
}) => {
  const variants = {
    default:
      "text-[#17414d] hover:bg-[#17414d] hover:text-white border-gray-200",
    success:
      "text-emerald-600 hover:bg-emerald-600 hover:text-white border-qemerald-100",
    danger: "text-rose-500 hover:bg-rose-500 hover:text-white border-rose-100",
    warning:
      "text-amber-600 hover:bg-amber-600 hover:text-white border-amber-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={` cursor-pointer
        relative flex items-center justify-center w-8 h-8 
        rounded-lg border transition-all duration-200 shadow
        disabled:opacity-40 disabled:cursor-not-allowed active:scale-90
        ${variants[variant]}
      `}
    >
      {/* {loading ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : ( */}
      <Icon size={18} strokeWidth={1.5} />
      {/* )} */}

      {/* Unsaved Changes Pulse Dot */}
      {hasBadge && !loading && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span> */}
          {/* <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border-2 border-white"></span> */}
        </span>
      )}
    </button>
  );
};

export const FormSearchSelectInline = ({
  value,
  options,
  onSelect,
  displayKey,
  disabled,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const filtered = options.filter((opt) =>
    (opt[displayKey] || "").toLowerCase().includes(localSearch.toLowerCase()),
  );

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          readOnly={!showDropdown} // Toggle readonly to allow typing only when open
          disabled={disabled}
          className={`w-full border outline-none border-gray-200 pl-2 pr-8 py-1.5 rounded text-[11px] 
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:border-[#17414d]"}`}
          value={showDropdown ? localSearch : value || ""}
          placeholder={showDropdown ? "Search columns..." : ""}
          onChange={(e) => setLocalSearch(e.target.value)}
          onFocus={() => !disabled && setShowDropdown(true)}
        />
        <div
          className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
          onClick={() => !disabled && setShowDropdown(!showDropdown)}
        >
          <Search size={12} />
        </div>
      </div>

      {showDropdown && !disabled && (
        <>
          <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-2 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
                  onClick={() => {
                    onSelect(opt);
                    setLocalSearch("");
                    setShowDropdown(false);
                  }}
                >
                  <span className="font-medium text-gray-700">
                    {opt[displayKey]}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-[10px] text-gray-400 italic text-center">
                No results
              </div>
            )}
          </div>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setShowDropdown(false)}
          />
        </>
      )}
    </div>
  );
};

// Assuming your icons and FormSearchSelect are imported
// import { ReplaceAll, Search } from 'lucide-react';

// const BulkActionPanel = ({ columns = [], onExecute }) => {
//   const [replaceMode, setReplaceMode] = useState(false);
//   const [columnSearch, setColumnSearch] = useState("");
//   const [valueSearch, setValueSearch] = useState("");
//   const [replaceValueSearch, setReplaceValueSearch] = useState("");

//   const [config, setConfig] = useState({
//     column: "",
//     findYear: "",
//     findMonth: "",
//     replaceYear: "",
//     replaceMonth: "",
//     replaceValue: "",
//     booleanMode: "setAll",
//   });

//   const currentColConfig = useMemo(
//     () => columns.find((c) => c.id === config.column),
//     [config.column, columns],
//   );

//   const canReplace = currentColConfig?.allowReplace !== false;

//   const handleChange = (update) =>
//     setConfig((prev) => ({ ...prev, ...update }));

//   const renderInputs = (isReplaceSection = false) => {
//     const type = currentColConfig?.type;
//     const prefix = isReplaceSection ? "replace" : "find";
//     const options = currentColConfig?.options || [];

//     switch (type) {
//       case "date":
//         return (
//           <div className="flex gap-1">
//             <input
//               type="text"
//               placeholder="YYYY"
//               maxLength={4}
//               className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-14 text-center text-[10px] text-black"
//               value={config[`${prefix}Year`]}
//               onChange={(e) =>
//                 handleChange({
//                   [`${prefix}Year`]: e.target.value.replace(/\D/g, ""),
//                 })
//               }
//             />
//             <input
//               type="text"
//               placeholder="MM"
//               maxLength={2}
//               className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-10 text-center text-[10px] text-black"
//               value={config[`${prefix}Month`]}
//               onChange={(e) =>
//                 handleChange({
//                   [`${prefix}Month`]: e.target.value.replace(/\D/g, ""),
//                 })
//               }
//             />
//           </div>
//         );

//       case "flag":
//         if (isReplaceSection) {
//           const showAllOption = config.booleanMode === "inverted";
//           return (
//             <select
//               className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-16 bg-white text-[10px] text-black"
//               value={config.replaceValue}
//               onChange={(e) => handleChange({ replaceValue: e.target.value })}
//             >
//               {showAllOption && <option value="All">All</option>}
//               <option value="Y">Y</option>
//               <option value="N">N</option>
//             </select>
//           );
//         }
//         return (
//           <select
//             className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-28 bg-white text-[10px] text-black"
//             value={config.booleanMode}
//             onChange={(e) =>
//               handleChange({ booleanMode: e.target.value, replaceValue: "Y" })
//             }
//           >
//             <option value="setAll">Set All To</option>
//             <option value="inverted">Invert Values</option>
//           </select>
//         );

//       case "select":
//         return (
//           <div className="w-48">
//             <FormSearchSelect
//               placeholder={
//                 isReplaceSection ? "Select Replacement..." : "Search All..."
//               }
//               options={options}
//               displayKey="label"
//               value={isReplaceSection ? config.replaceValue : config.findYear}
//               searchTerm={isReplaceSection ? replaceValueSearch : valueSearch}
//               setSearchTerm={
//                 isReplaceSection ? setReplaceValueSearch : setValueSearch
//               }
//               onSelect={(opt) => {
//                 handleChange({
//                   [isReplaceSection ? "replaceValue" : "findYear"]: opt.value,
//                 });
//               }}
//             />
//           </div>
//         );

//       default:
//         return (
//           <input
//             type={type === "number" ? "number" : "text"}
//             className="border px-1 py-0.5 border-gray-200 rounded outline-none w-32 text-[10px] text-black"
//             value={isReplaceSection ? config.replaceValue : config.findYear}
//             onChange={(e) =>
//               handleChange({
//                 [isReplaceSection ? "replaceValue" : "findYear"]:
//                   e.target.value,
//               })
//             }
//           />
//         );
//     }
//   };



const BulkActionPanel = ({ columns = [], onExecute }) => {
  const [replaceMode, setReplaceMode] = useState(false);
  const [columnSearch, setColumnSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [replaceValueSearch, setReplaceValueSearch] = useState("");

  const [config, setConfig] = useState({
    column: "",
    findYear: "",
    findMonth: "",
    replaceYear: "",
    replaceMonth: "",
    replaceValue: "",
    booleanMode: "setAll",
  });

  const currentColConfig = useMemo(
    () => columns.find((c) => c.id === config.column),
    [config.column, columns],
  );

  const canReplace = currentColConfig?.allowReplace !== false;

  const handleChange = (update) =>
    setConfig((prev) => ({ ...prev, ...update }));

  const renderInputs = (isReplaceSection = false) => {
    const type = currentColConfig?.type;
    const prefix = isReplaceSection ? "replace" : "find";
    const options = currentColConfig?.options || [];

    switch (type) {
      case "date":
        return (
          <div className="flex gap-1">
            <input
              type="text"
              placeholder="YYYY"
              maxLength={4}
              className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-14 text-center text-[10px] text-black"
              value={config[`${prefix}Year`]}
              onChange={(e) =>
                handleChange({
                  [`${prefix}Year`]: e.target.value.replace(/\D/g, ""),
                })
              }
            />
            <input
              type="text"
              placeholder="MM"
              maxLength={2}
              className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-10 text-center text-[10px] text-black"
              value={config[`${prefix}Month`]}
              onChange={(e) =>
                handleChange({
                  [`${prefix}Month`]: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>
        );

      case "flag":
        if (isReplaceSection) {
          const showAllOption = config.booleanMode === "inverted";
          return (
            <select
              className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-16 bg-white text-[10px] text-black"
              value={config.replaceValue}
              onChange={(e) => handleChange({ replaceValue: e.target.value })}
            >
              {showAllOption && <option value="All">All</option>}
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          );
        }
        return (
          <select
            className="border px-1 py-0.5 border-gray-200 rounded  outline-none w-28 bg-white text-[10px] text-black"
            value={config.booleanMode}
            onChange={(e) =>
              handleChange({ booleanMode: e.target.value, replaceValue: "Y" })
            }
          >
            <option value="setAll">Set All To</option>
            <option value="inverted">Invert Values</option>
          </select>
        );

      case "select":
        return (
          <div className="w-48">
            <FormSearchSelect
              placeholder={
                isReplaceSection ? "Select Replacement..." : "Search All..."
              }
              options={options}
              displayKey="label"
              value={isReplaceSection ? config.replaceValue : config.findYear}
              searchTerm={isReplaceSection ? replaceValueSearch : valueSearch}
              setSearchTerm={
                isReplaceSection ? setReplaceValueSearch : setValueSearch
              }
              onSelect={(opt) => {
                handleChange({
                  [isReplaceSection ? "replaceValue" : "findYear"]: opt.value,
                });
              }}
            />
          </div>
        );

      default:
        return (
          <input
            type={type === "number" ? "number" : "text"}
            placeholder={prefix}
            className="border px-1 py-0.5 border-gray-200 rounded outline-none w-32 text-[10px] text-black"
            value={isReplaceSection ? config.replaceValue : config.findYear}
            onChange={(e) =>
              handleChange({
                [isReplaceSection ? "replaceValue" : "findYear"]:
                  e.target.value,
              })
            }
          />
        );
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. Main Column Selection - mouse selection only */}
      <div className="relative w-48">
        <button
          type="button"
          className="w-full h-7 px-2 text-left text-[11px] border border-gray-300 rounded bg-white outline-none cursor-pointer flex items-center justify-between"
          onClick={() =>
            setColumnSearch((prev) => (prev === "__OPEN__" ? "" : "__OPEN__"))
          }
          onKeyDown={(e) => e.preventDefault()}
          onKeyUp={(e) => e.preventDefault()}
          onKeyPress={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
        >
          <span className="truncate">
            {columns.find((c) => String(c.id) === String(config.column))?.label ||
              "Select Column"}
          </span>
          <ChevronDown size={12} className="shrink-0 text-gray-500" />
        </button>

        {columnSearch === "__OPEN__" && (
          <>
            <div
              className="fixed inset-0 z-[90]"
              onMouseDown={() => setColumnSearch("")}
            />

            <div className="absolute left-0 top-full mt-1 z-[100] w-full bg-white border border-gray-300 rounded shadow-xl max-h-48 overflow-y-auto">
              {columns.map((opt, idx) => (
                <button
                  key={opt.id || idx}
                  type="button"
                  className={`block w-full px-2 py-1.5 text-left text-[11px] cursor-pointer hover:bg-blue-50 ${
                    String(opt.id) === String(config.column)
                      ? "bg-blue-50"
                      : "bg-white"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();

                    handleChange({
                      column: opt.id,
                      findYear: "",
                      replaceValue: "",
                    });

                    setValueSearch("");
                    setReplaceValueSearch("");
                    setColumnSearch("");
                  }}
                  onKeyDown={(e) => e.preventDefault()}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Find/Replace Section */}
      <div className="flex items-center gap-1">
        {/* {config.column && ( */}
        <>
          <div className="flex items-center">{renderInputs(false)}</div>

          {canReplace && (
            <button
              onClick={() => setReplaceMode(!replaceMode)}
              className={`p-1 cursor-pointer rounded border transition-colors ${replaceMode ? "bg-gray-100 border-gray-500 text-gray-600" : "bg-white border-gray-400 text-gray-500"}`}
            >
              <ReplaceAll size={12} />
            </button>
          )}

          {replaceMode && canReplace && (
            <>
              <div className="font-bold fex items-center text-gray-400">→</div>
              <div className="flex items-center">{renderInputs(true)}</div>
            </>
          )}

          <button
            onClick={() => onExecute(config, replaceMode)}
            className="px-3 py-0.5 rounded font-medium text-[10px] text-white bg-[#17414d]/95 hover:bg-[#17414d]"
          >
            {replaceMode ? "Apply" : "Search"}
          </button>
        </>
        {/* )} */}
      </div>
    </div>
  );
};
