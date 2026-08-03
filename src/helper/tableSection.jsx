// import React, { useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { Search, X } from "lucide-react"; // Ensure this is imported for your custom select
// import CustomDatePicker from "../components/CustomeDatePicker";

// export const ReusableTable = ({
//   data,
//   columns,
//   selectedRows = [],
//   onSelectAll,
//   onRowSelect,
//   onFieldChange,
//   renderEmptyState,
//   doubleclick,
//   maxHeight = "max-h-64",
//   showCheckboxesHeaderTop = true,
//   showCheckboxesHeader = true,
//   showCheckboxesTable = true,
//   rowKey = "id", // Default to 'id', can be 'orgGroupId', 'moduleCd', etc.
// }) => {
//   const isAllSelected = data.length > 0 && selectedRows.length === data.length;

//   /**
//    * Helper to identify a row uniquely.
//    * Handles rowKey as either a function or a string property name.
//    */
//   const getRowId = (item) => {
//     // If rowKey is a function, call it to get the ID
//     if (typeof rowKey === "function") {
//       return String(rowKey(item));
//     }
//     // Otherwise, treat it as a property name
//     return String(
//       item.tempId || // Priority 1: The stable temporary ID (never changes)
//         item[rowKey] || // Priority 2: The database ID (orgId)
//         item.rowKey,
//     ); // Priority 3: Fallback
//   };

//   return (
//     <div className={`overflow-x-auto mb-2 max-h-[35vh] `}>
//       <table className="min-w-full text-sm border border-gray-300 rounded">
//         <thead className="bg-gray-200 sticky top-0 z-10 ">
//           <tr>
//             {showCheckboxesHeaderTop && (
//               <th className="th-thead w-10">
//                 {showCheckboxesHeader && (
//                   <input
//                     type="checkbox"
//                     className="accent-blue-500 h-3 w-3 cursor-pointer"
//                     checked={isAllSelected}
//                     onChange={onSelectAll}
//                   />
//                 )}
//               </th>
//             )}
//             {columns.map((col, idx) => (
//               <th key={idx} className="th-thead">
//                 {col.label} {col.required && "*"}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="tbody">
//           {data.length > 0 ? (
//             data.map((item) => {
//               // Get the dynamic ID for this row
//               const currentId = getRowId(item);
//               // Check if the Set contains the String version of the ID
//               const isRowSelected =
//                 selectedRows instanceof Set
//                   ? selectedRows.has(currentId)
//                   : Array.isArray(selectedRows) &&
//                     selectedRows.some((s) => String(getRowId(s)) === currentId);

//               return (
//                 <tr
//                   key={currentId}
//                   className="hover:bg-gray-50 transition-colors"
//                   onDoubleClick={() => doubleclick(item)}
//                 >
//                   {showCheckboxesTable && (
//                     <td className="tbody-td text-center">
//                       <input
//                         type="checkbox"
//                         className="accent-blue-500 h-3 w-3 cursor-pointer"
//                         checked={isRowSelected} // This now correctly reads the Set
//                         onChange={() => onRowSelect(item)}
//                       />
//                     </td>
//                   )}
//                   {columns.map((col, idx) => (
//                     <td key={idx} className="tbody-td">
//                       {/* CHECK FOR CUSTOM RENDER FIRST */}
//                       {col.render
//                         ? col.render(item)
//                         : renderInput(
//                             col,
//                             item,
//                             currentId,
//                             !!item.tempId,
//                             onFieldChange,
//                           )}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })
//           ) : (
//             /* EMPTY STATE ROW */
//             <tr>
//               <td
//                 colSpan={columns.length + (showCheckboxesTable ? 1 : 0)}
//                 className="py-10"
//               >
//                 {renderEmptyState ? (
//                   renderEmptyState()
//                 ) : (
//                   <div className="text-center text-gray-400 text-xs italic">
//                     No data available.
//                   </div>
//                 )}
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Internal Render Helper
// const renderInput = (col, item, id, isNew, onFieldChange) => {
//   const value = item[col.key] ?? "";
//   const isEditable = col.readOnlyIfExisting ? isNew : !col.readOnly;
//   const isDisabled =
//     !isEditable ||
//     (typeof col.isDisabled === "function"
//       ? col.isDisabled(item)
//       : !!col.isDisabled);

//   const baseClass = "td-input min-w-[100px]";
//   const editableClass = "td-input bg-white";
//   const readOnlyClass = "td-input bg-gray-50";

//   const finalClass = `${baseClass} ${!isDisabled ? editableClass : readOnlyClass}`;

//   switch (col.type) {
//     case "readOnly-text":
//     case "readOnly-number":
//       return (
//         <div className="flex justify-center px-1">
//           <input
//             type={col.type === "readOnly-number" ? "number" : "text"}
//             value={value}
//             disabled={true}
//             className={`
//           ${baseClass} 
//           cursor-not-allowed 
//           bg-gray-200 
//           text-gray-500 
//           border-transparent 
//           rounded 
//           text-[10px] 
//           px-2
//         `}
//           />
//         </div>
//       );

//     case "search-select": {
//       // item[col.key] is where "orgSecProfCd" is stored
//       const currentValue = item[col.key] ?? "";

//       return (
//         <div className="relative">
//           <TableSearchSelect
//             id={id}
//             value={currentValue}
//             options={col.options || []}
//             displayKey={col.displayKey}
//             secondaryKey={col.secondaryKey}
//             disabled={isDisabled}
//             onSelect={(selectedOpt, rowId) => {
//               if (col.onSelect) {
//                 col.onSelect(selectedOpt, rowId);
//               } else {
//                 onFieldChange(rowId, col.key, selectedOpt[col.displayKey]);
//               }
//             }}
//           />
//         </div>
//       );
//     }
//     case "select":
//       return (
//         <select
//           className={`${baseClass} cursor-pointer border border-gray-200 rounded bg-white text-[10px] `}
//           value={value}
//           disabled={isDisabled}
//           onChange={(e) => onFieldChange(id, col.key, e.target.value)}
//         >
//           <option value="">{col.placeholder || "Select..."}</option>
//           {col.options?.map((opt, i) => (
//             <option key={i} value={opt[col.optionValue]}>
//               {opt[col.optionLabel]}
//             </option>
//           ))}
//         </select>
//       );

//     case "checkbox": {
//       // Determine if checked:
//       // 1. If col.value is a function, call it.
//       // 2. Otherwise, check if the raw value is "Y".
//       const isChecked =
//         typeof col.value === "function" ? col.value(item) : value === "Y";

//       return (
//         <div className="flex justify-center">
//           <input
//             type="checkbox"
//             checked={isChecked}
//             disabled={isDisabled}
//             onChange={(e) => {
//               if (col.onToggle) {
//                 // Pass the current state to the custom handler
//                 col.onToggle(id, isChecked);
//               } else {
//                 // Default: convert boolean to Y/N string for the generic change handler
//                 onFieldChange(id, col.key, e.target.checked ? "Y" : "N");
//               }
//             }}
//             className="h-3 w-3 rounded border-gray-300 accent-blue-500 cursor-pointer"
//           />
//         </div>
//       );
//     }

//     case "action-delete":
//       return (
//         <div className="flex justify-center">
//           <button
//             onClick={() => onFieldChange(id, "DELETE_ROW", item)}
//             className="flex items-center justify-center p-0.5 border cursor-pointer rounded border-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
//           >
//             <X size={12} strokeWidth={2} />
//           </button>
//         </div>
//       );

//     case "date":
//       return (
//         <DatePickerInput
//           id={id}
//           value={item[col.key] || ""}
//           disabled={isDisabled}
//           onDateChange={(date) => onFieldChange(id, col.key, date)}
//         />
//       );

//     default: // text, number, etc.
//       return (
//         <input
//           type={col.type || "text"}
//           className={finalClass}
//           value={value}
//           readOnly={isDisabled}
//           onChange={(e) => onFieldChange(id, col.key, e.target.value)}
//         />
//       );
//   }
// };

// const DatePickerInput = ({ id, value, disabled, onDateChange }) => {
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const wrapperRef = useRef(null);

//   const displayValue = (() => {
//     if (!value || value.trim() === "") return "";
//     try {
//       const datePart = value.includes("T") ? value.split("T")[0] : value;
//       const parts = datePart.split("-");
//       if (parts.length === 3 && parts[0].length === 4) {
//         return `${parts[1]}-${parts[2]}-${parts[0]}`;
//       }
//       return datePart;
//     } catch (err) {
//       return "";
//     }
//   })();

//   const handleInputChange = (e) => {
//     // 1. Remove non-numeric characters
//     let raw = e.target.value.replace(/\D/g, "");
//     if (raw.length > 8) raw = raw.slice(0, 8);

//     // 2. VALIDATION LOGIC
//     // Validate Month (First 2 digits)
//     if (raw.length >= 2) {
//       let month = parseInt(raw.slice(0, 2), 10);
//       if (month > 12) {
//         raw = "12" + raw.slice(2);
//       } else if (raw.slice(0, 2) === "00") {
//         raw = "01" + raw.slice(2);
//       }
//     }

//     // Validate Day (Middle 2 digits)
//     if (raw.length >= 4) {
//       let monthPart = raw.slice(0, 2);
//       let dayPart = raw.slice(2, 4);
//       let day = parseInt(dayPart, 10);
//       if (day > 31) {
//         raw = monthPart + "31" + raw.slice(4);
//       } else if (dayPart === "00") {
//         raw = monthPart + "01" + raw.slice(4);
//       }
//     }

//     // 3. Apply the Mask: MM-DD-YYYY
//     let formatted = raw;
//     if (raw.length > 2 && raw.length <= 4) {
//       formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
//     } else if (raw.length > 4) {
//       formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4)}`;
//     }

//     // 4. Update State
//     if (raw.length === 8) {
//       const mm = raw.slice(0, 2);
//       const dd = raw.slice(2, 4);
//       const yyyy = raw.slice(4);
//       onDateChange(`${yyyy}-${mm}-${dd}`);
//       setShowDatePicker(false);
//     } else {
//       onDateChange(formatted);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setShowDatePicker(false);
//       }
//     };
//     if (showDatePicker)
//       document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showDatePicker]);

//   return (
//     <div ref={wrapperRef} className="relative w-full">
//       <input
//         type="text"
//         className={`w-full text-center text-xs bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none transition-all cursor-pointer px-1 py-0.5 ${
//           disabled ? "text-gray-500 cursor-not-allowed" : ""
//         }`}
//         value={displayValue}
//         placeholder="MM-DD-YYYY"
//         disabled={disabled}
//         onChange={handleInputChange}
//         onClick={() => !disabled && setShowDatePicker(true)}
//       />
//       {showDatePicker && !disabled && (
//         <div className="absolute z-50 top-full mt-1">
//           <CustomDatePicker
//             selectedDate={
//               value.length === 10 &&
//               value.includes("-") &&
//               value.split("-")[0].length === 4
//                 ? value
//                 : ""
//             }
//             onChange={(date) => {
//               onDateChange(date);
//               setShowDatePicker(false);
//             }}
//             onClose={() => setShowDatePicker(false)}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export const TableSearchSelect = ({
//   id,
//   value,
//   options = [],
//   onSelect,
//   displayKey,
//   secondaryKey,
//   disabled,
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dropdownStyle, setDropdownStyle] = useState({});
//   const wrapperRef = useRef(null);

//   const filteredOptions = options.filter((opt) => {
//     // Force values to strings using String() to prevent .toLowerCase() errors
//     const mainValue = String(opt[displayKey] || "").toLowerCase();
//     const subValue = secondaryKey
//       ? String(opt[secondaryKey] || "").toLowerCase()
//       : "";
//     const term = searchTerm.toLowerCase();

//     return mainValue.includes(term) || subValue.includes(term);
//   });

//   // Position logic for the portal
//   const updateDropdownPosition = () => {
//     if (!wrapperRef.current) return;
//     const rect = wrapperRef.current.getBoundingClientRect();
//     setDropdownStyle({
//       position: "fixed",
//       top: rect.bottom + window.scrollY,
//       left: rect.left + window.scrollX,
//       width: rect.width,
//       zIndex: 9999,
//     });
//   };

//   useEffect(() => {
//     if (showDropdown) updateDropdownPosition();
//   }, [showDropdown, searchTerm]);

//   // Handle outside clicks and window events
//   useEffect(() => {
//     const handleScroll = () => {
//       if (showDropdown) updateDropdownPosition();
//     };
//     window.addEventListener("resize", handleScroll);
//     window.addEventListener("scroll", handleScroll, true);
//     return () => {
//       window.removeEventListener("resize", handleScroll);
//       window.removeEventListener("scroll", handleScroll, true);
//     };
//   }, [showDropdown]);

//   return (
//     <div className="relative min-w-[150px]" ref={wrapperRef}>
//       <div className="relative flex items-center">
//         <input
//           type="text"
//           disabled={disabled}
//           className={`w-full border outline-none border-gray-200 pl-1 pr-6 py-0.5 rounded text-[10px] 
//             ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white focus:border-blue-300"}`}
//           /* CRITICAL FIX: 
//              If the dropdown is open, show the search text.
//              If the dropdown is closed, show the 'value' (profile ID) passed from handleFieldChange.
//           */
//           value={
//             showDropdown
//               ? searchTerm
//               : value !== undefined && value !== null
//                 ? value
//                 : ""
//           }
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setShowDropdown(true);
//           }}
//           onFocus={() => !disabled && setShowDropdown(true)}
//           autoComplete="off"
//         />
//         <div className="absolute right-0 px-1 cursor-pointer text-gray-400">
//           <Search size={10} />
//         </div>
//       </div>

//       {showDropdown &&
//         !disabled &&
//         createPortal(
//           <>
//             <div
//               style={dropdownStyle}
//               className="bg-white border border-gray-300 rounded shadow-2xl max-h-32 overflow-y-auto custom-scrollbar"
//             >
//               {filteredOptions.length > 0 ? (
//                 filteredOptions.map((opt, idx) => (
//                   <div
//                     key={idx}
//                     className="p-1 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
//                     onClick={() => {
//                       onSelect(opt, id); // Triggers handleFieldChange
//                       setSearchTerm(""); // Clears the search text
//                       setShowDropdown(false); // Closes dropdown to show the 'value' prop
//                     }}
//                   >
//                     <span className="font-semibold">{opt[displayKey]}</span>
//                     {secondaryKey && opt[secondaryKey] && (
//                       <span className="text-gray-400 ml-1">
//                         ({opt[secondaryKey]})
//                       </span>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-2 text-[10px] text-gray-400 italic text-center">
//                   No matches
//                 </div>
//               )}
//             </div>
//             <div
//               className="fixed inset-0 z-[9998]"
//               onClick={() => {
//                 setShowDropdown(false);
//                 setSearchTerm("");
//               }}
//             />
//           </>,
//           document.body,
//         )}
//     </div>
//   );
// };

// export default ReusableTable;

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react"; // Ensure this is imported for your custom select

export const ReusableTable = ({
  data,
  columns,
  selectedRows = [],
  onSelectAll,
  onRowSelect,
  onFieldChange,
  renderEmptyState,
  maxHeight = "max-h-64",
  showCheckboxes = true,
  rowKey = "id", // Default to 'id', can be 'orgGroupId', 'moduleCd', etc.
}) => {
  const selectedCount = Array.isArray(selectedRows)
    ? selectedRows.length
    : selectedRows instanceof Set
    ? selectedRows.size
    : 0;
  const isAllSelected = data.length > 0 && selectedCount === data.length;

  /**
   * Helper to identify a row uniquely.
   * Checks for the custom rowKey first, falls back to tempId for new unsaved rows.
   */
  const getRowId = (item) => item[rowKey] || item.tempId;

  return (
    <div
      className={`overflow-y-auto rounded-xl ${maxHeight} px-2 pb-2 right-scrollbar bg-white`}
    >
      <table className="w-full text-sm border border-gray-300 rounded">
        <thead className="thead sticky top-0 z-10">
          <tr className="bg-white border-b border-gray-300">
            {showCheckboxes && (
              <th className="th-thead bg-[#e5f3fb] text-black text-xs w-10 text-center">
                <input
                  type="checkbox"
                  className="accent-[#17414d] h-3 w-3 cursor-pointer"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                />
              </th>
            )}
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="th-thead bg-[#e5f3fb] text-black text-xs px-2 text-left"
              >
                {col.label} {col.required && "*"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="relative">
          {data.length > 0 ? (
            data.map((item) => {
              // Get the dynamic ID for this row
              const currentId = getRowId(item);

              // Check if this row is in the selectedRows array or Set using the dynamic ID
              const isRowSelected = Array.isArray(selectedRows)
                ? selectedRows.some((selected) => getRowId(selected) === currentId)
                : selectedRows instanceof Set
                ? selectedRows.has(currentId) || Array.from(selectedRows).some((selected) => getRowId(selected) === currentId || selected === currentId || (selected && getRowId(selected) === currentId))
                : false;

              return (
                <tr
                  key={currentId}
                  className="hover:bg-blue-50/50 border-b border-gray-100"
                >
                  {showCheckboxes && (
                    <td className="tbody-td text-center">
                      <input
                        type="checkbox"
                        className="accent-[#17414d] h-3 w-3 cursor-pointer"
                        checked={isRowSelected}
                        onChange={() => onRowSelect(item)}
                      />
                    </td>
                  )}
                  {columns.map((col, idx) => (
                    <td key={idx} className="tbody-td">
                      {/* currentId: Passed as the identifier for field changes
                         !!item.tempId: Tells the input if this is a brand new row 
                      */}
                      {renderInput(
                        col,
                        item,
                        currentId,
                        !!item.tempId,
                        onFieldChange,
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            /* EMPTY STATE ROW */
            <tr>
              <td
                colSpan={columns.length + (showCheckboxes ? 1 : 0)}
                className="py-10"
              >
                {renderEmptyState ? (
                  renderEmptyState()
                ) : (
                  <div className="text-center text-gray-400 text-xs italic">
                    No data available.
                  </div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Internal Render Helper
const renderInput = (col, item, id, isNew, onFieldChange) => {
  const value = item[col.key] ?? "";
  const isEditable = col.readOnlyIfExisting ? isNew : !col.readOnly;

  const baseClass =
    "w-full bg-transparent outline-none text-xs px-1 transition-all";
  const editableClass =
    "border border-gray-200 rounded focus:border-blue-300 px-1 py-0.5";
  const readOnlyClass =
    "cursor-not-allowed text-gray-500 bg-gray-200 border-transparent rounded";

  const finalClass = `${baseClass} ${isEditable ? editableClass : readOnlyClass}`;

  switch (col.type) {
    case "readOnly-text":
    case "readOnly-number":
      return (
        <div className="flex justify-center px-1">
          <input
            type={col.type === "readOnly-number" ? "number" : "text"}
            value={value}
            disabled={true}
            className={`
          ${baseClass} 
          cursor-not-allowed 
          bg-gray-200 
          text-gray-500 
          border-transparent 
          rounded 
          text-[10px] 
          px-2
        `}
          />
        </div>
      );

    case "search-select": {
      // item[col.key] is where "orgSecProfCd" is stored
      const currentValue = item[col.key] || "";

      return (
        <div className="relative">
          <TableSearchSelect
            id={id}
            value={currentValue}
            options={col.options || []}
            displayKey={col.displayKey}
            secondaryKey={col.secondaryKey}
            disabled={!isEditable}
            onSelect={(selectedOpt, rowId) => {
              if (col.onSelect) {
                col.onSelect(selectedOpt, rowId);
              } else {
                onFieldChange(rowId, col.key, selectedOpt[col.displayKey]);
              }
            }}
          />
        </div>
      );
    }
    case "select":
      if (!isEditable) {
        return (
          <input
            type="text"
            className={`${baseClass} ${readOnlyClass} text-[10px] px-1 py-0.5`}
            value={value}
            readOnly
          />
        );
      }
      return (
        <select
          className={`${baseClass} cursor-pointer border border-gray-200 rounded bg-white text-[10px] `}
          value={value}
          disabled={!isEditable}
          onChange={(e) => onFieldChange(id, col.key, e.target.value)}
        >
          <option value="">{col.placeholder || "Select..."}</option>
          {col.options?.map((opt, i) => (
            <option key={i} value={opt[col.optionValue]}>
              {opt[col.optionLabel]}
            </option>
          ))}
        </select>
      );

    case "datalist": {
      const listId = col.listId || `${col.key}-list-${id}`;
      return (
        <div className="relative w-full">
          <input
            type="text"
            list={listId}
            className={finalClass}
            value={value}
            readOnly={!isEditable}
            placeholder={col.placeholder || ""}
            onChange={(e) => onFieldChange(id, col.key, e.target.value.toUpperCase())}
            onBlur={(e) => {
              if (col.onBlur) {
                col.onBlur(e.target.value, id);
              }
            }}
          />
          <datalist id={listId}>
            {col.options?.map((opt, i) => {
              const val = typeof opt === "object" ? opt.value : opt;
              const lbl = typeof opt === "object" ? (opt.label || opt.value) : opt;
              return <option key={i} value={val}>{lbl}</option>;
            })}
          </datalist>
        </div>
      );
    }


    case "checkbox":
      return (
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="accent-[#17414d] h-3 w-3 cursor-pointer"
            checked={value === "Y" || value === true || value === 1 || value === "1"}
            disabled={!isEditable}
            onChange={(e) => onFieldChange(id, col.key, e.target.checked ? "Y" : "N")}
          />
        </div>
      );

    case "action-delete":
      return (
        <div className="flex justify-center">
          <button
            onClick={() => onFieldChange(id, "DELETE_ROW", item)}
            className="flex items-center justify-center p-0.5 border cursor-pointer rounded border-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>
      );

    default: // text, number, etc.
      return (
        <input
          type={col.type || "text"}
          className={finalClass}
          value={value}
          readOnly={!isEditable}
          onChange={(e) => onFieldChange(id, col.key, e.target.value)}
        />
      );
  }
};

export const TableSearchSelect = ({
  id,
  value,
  options = [],
  onSelect,
  displayKey,
  secondaryKey,
  disabled,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});
  const wrapperRef = useRef(null);

  // Filter options based on user typing
  const filteredOptions = options.filter(
    (opt) =>
      (opt[displayKey] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (secondaryKey &&
        (opt[secondaryKey] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

  // Position logic for the portal
  const updateDropdownPosition = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      zIndex: 9999,
    });
  };

  useEffect(() => {
    if (showDropdown) updateDropdownPosition();
  }, [showDropdown, searchTerm]);

  // Handle outside clicks and window events
  useEffect(() => {
    const handleScroll = () => {
      if (showDropdown) updateDropdownPosition();
    };
    window.addEventListener("resize", handleScroll);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showDropdown]);

  return (
    <div className="relative w-full min-w-[160px]" ref={wrapperRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          disabled={disabled}
          className={`w-full border outline-none border-gray-200 pl-1 pr-6 py-0.5 rounded text-[10px] 
            ${disabled ? "bg-gray-200 cursor-not-allowed text-gray-500" : "bg-white focus:border-blue-300"}`}
          /* CRITICAL FIX: 
             If the dropdown is open, show the search text.
             If the dropdown is closed, show the 'value' (profile ID) passed from handleFieldChange.
          */
          value={showDropdown ? searchTerm : value || ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => !disabled && setShowDropdown(true)}
          autoComplete="off"
        />
        <div className="absolute right-0 px-1 cursor-pointer text-gray-400">
          <Search size={10} />
        </div>
      </div>

      {showDropdown &&
        !disabled &&
        createPortal(
          <>
            <div
              style={dropdownStyle}
              className="bg-white border border-gray-300 rounded shadow-2xl max-h-48 overflow-y-auto custom-scrollbar"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 text-[11px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none flex justify-between items-center whitespace-nowrap"
                    onClick={() => {
                      onSelect(opt, id); // Triggers handleFieldChange
                      setSearchTerm(""); // Clears the search text
                      setShowDropdown(false); // Closes dropdown to show the 'value' prop
                    }}
                  >
                    <span className="font-semibold">{opt[displayKey]}</span>
                    {secondaryKey && opt[secondaryKey] && (
                      <span className="text-gray-400 ml-1">
                        ({opt[secondaryKey]})
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-2 text-[10px] text-gray-400 italic text-center">
                  No matches
                </div>
              )}
            </div>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => {
                setShowDropdown(false);
                setSearchTerm("");
              }}
            />
          </>,
          document.body,
        )}
    </div>
  );
};

export default ReusableTable;
