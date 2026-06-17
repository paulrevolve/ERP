// import React, { useState } from "react";
// import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { Link2, X } from "lucide-react";

// const columnsLink = [
//   { id: "projectWildcard", key: "projectWildcard", label: "Project Wildcard String *" },
//   { id: "accountWildcard", key: "accountWildcard", label: "Account Wildcard String *" },
//   { id: "projectCount", key: "projectCount", label: "Project Count" },
//   { id: "accountCount", key: "accountCount", label: "Account Count" },
//   { id: "possibleCombinations", key: "possibleCombinations", label: "Possible Combinations" }
// ];

// const columnsSample = [
//   { id: "name", key: "name", label: "Name" }
// ];

// const LinkProjectsAccounts = () => {
//   const [isFormView, setIsFormView] = useState(true);
//   const [records, setRecords] = useState([
//     { 
//       id: "1", 
//       projectWildcard: "PRJ%", 
//       accountWildcard: "600%", 
//       projectCount: "10", 
//       accountCount: "5", 
//       possibleCombinations: "50" 
//     }
//   ]);

//   const handleAdd = () => {
//     const newId = `NEW_${Date.now()}`;
//     setRecords([{ id: newId, projectWildcard: "", accountWildcard: "", projectCount: "0", accountCount: "0", possibleCombinations: "0" }, ...records]);
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={Link2} title="Link Projects/Accounts">
//         <Toolbar 
//           isFormView={isFormView}
//           actions={{
//             onToggleView: () => setIsFormView(!isFormView),
//             onAdd: handleAdd,
//             onSave: () => {},
//             onDelete: () => {},
//             onCopy: () => {},
//             onPaste: () => {},
//             onClear: () => {}
//           }}
//         />

//         <div className="mt-2 space-y-4">
//           <SecondaryContainer title="Link Projects/Accounts">
//             <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
//             <ReusableTable 
//               data={records} 
//               columns={columnsLink} 
//               onFieldChange={() => {}} 
//             />
//             <div className="flex justify-end gap-4 mt-2 px-2 text-xs text-blue-600 underline cursor-pointer">
//               <span>Wildcard Option</span>
//               <span>Sample Projects</span>
//               <span>Sample Accounts</span>
//             </div>
//           </SecondaryContainer>

//           <SecondaryContainer title="Link Projects/Accounts > Sample Accounts">
//             <Toolbar isTableOnly actions={{ onQuery: () => {} }} />
//             <div className="p-4 border border-gray-200 rounded-sm bg-gray-50 min-h-[50px]">
//                {/* Sample data or table */}
//             </div>
//             <div className="flex justify-end mt-2 px-2">
//               <button className="px-4 py-1 text-xs bg-blue-900 text-white rounded-sm hover:bg-blue-800 transition-colors">Close</button>
//             </div>
//           </SecondaryContainer>

//           <SecondaryContainer title="Link Projects/Accounts > Sample Projects">
//             <Toolbar isTableOnly actions={{ onQuery: () => {} }} />
//             <div className="p-4 border border-gray-200 rounded-sm bg-gray-50 min-h-[50px]">
//                {/* Sample data or table */}
//             </div>
//             <div className="flex justify-end mt-2 px-2">
//               <button className="px-4 py-1 text-xs bg-blue-900 text-white rounded-sm hover:bg-blue-800 transition-colors">Close</button>
//             </div>
//           </SecondaryContainer>

//           <SecondaryContainer title="Link Projects/Accounts > Wildcard Option">
//             <div className="p-4 text-xs space-y-2 text-gray-700 bg-blue-50 border border-blue-100 rounded-sm">
//               <p className="font-bold text-blue-900">Wildcard Options</p>
//               <p>Use % or _ as wildcard. Examples are shown below:</p>
//               <div className="grid grid-cols-3 gap-2 max-w-sm">
//                 <span className="font-mono">%123</span> <span>=</span> <span>Ends with 123.</span>
//                 <span className="font-mono">123%</span> <span>=</span> <span>Begins with 123.</span>
//                 <span className="font-mono">%123%</span> <span>=</span> <span>Contains 123.</span>
//                 <span className="font-mono">1_3</span> <span>=</span> <span>Begins with 1 and ends with 3 and is 3 characters long.</span>
//               </div>
//             </div>
//           </SecondaryContainer>
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default LinkProjectsAccounts;

import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { Link2, X } from "lucide-react";

const columnsLink = [
  { id: "projectWildcard", key: "projectWildcard", label: "Project Wildcard String *" },
  { id: "accountWildcard", key: "accountWildcard", label: "Account Wildcard String *" },
  { id: "projectCount", key: "projectCount", label: "Project Count" },
  { id: "accountCount", key: "accountCount", label: "Account Count" },
  { id: "possibleCombinations", key: "possibleCombinations", label: "Possible Combinations" }
];

const columnsSample = [
  { id: "code", key: "code", label: "Code" },
  { id: "name", key: "name", label: "Name" }
];

const columnsWildcard = [
  { id: "wildcard", key: "wildcard", label: "Wildcard" },
  { id: "description", key: "description", label: "Description" },
  { id: "example", key: "example", label: "Example" }
];

const LinkProjectsAccounts = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [activeTabs, setActiveTabs] = useState({});
  const [records, setRecords] = useState([
    { 
      id: "1", 
      projectWildcard: "PRJ%", 
      accountWildcard: "600%", 
      projectCount: "10", 
      accountCount: "5", 
      possibleCombinations: "50" 
    }
  ]);

  const [wildcardRules, setWildcardRules] = useState([]);
  const [sampleProjects, setSampleProjects] = useState([]);
  const [sampleAccounts, setSampleAccounts] = useState([]);

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    setRecords([{ id: newId, projectWildcard: "", accountWildcard: "", projectCount: "0", accountCount: "0", possibleCombinations: "0" }, ...records]);
  };

  const toggleTab = (tab) => {
    setActiveTabs(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Link2} title="Link Projects/Accounts">
        <Toolbar 
          isFormView={isFormView}
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

        <div className="mt-2 space-y-4">
          <SecondaryContainer title="Link Projects/Accounts">
            {/* No internal toolbar here as requested */}
            <ReusableTable 
              data={records} 
              columns={columnsLink} 
              onFieldChange={() => {}} 
            />
          </SecondaryContainer>

          <div className="flex flex-wrap gap-2 mt-2 px-1 pb-2">
            {[
              { id: "wildcardOption", label: "Wildcard Option" },
              { id: "sampleProjects", label: "Sample Projects" },
              { id: "sampleAccounts", label: "Sample Accounts" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => toggleTab(tab.id)}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-colors whitespace-nowrap border cursor-pointer ${activeTabs[tab.id]
                    ? "bg-[#17414d] text-white border-[#17414d] shadow-md cursor-pointer"
                    : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe] cursor-pointer"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTabs.wildcardOption && (
            <SecondaryContainer title="Link Projects/Accounts > Wildcard Option">
              <div className="p-2">
                {/* <p className="text-[10px] text-gray-600 mb-2 italic">Use % or _ as wildcard. Enter rules below:</p> */}
                <ReusableTable 
                  data={wildcardRules} 
                  columns={columnsWildcard} 
                  onFieldChange={() => {}} 
                />
              </div>
            </SecondaryContainer>
          )}

          {activeTabs.sampleProjects && (
            <SecondaryContainer title="Link Projects/Accounts > Sample Projects">
              <Toolbar isTableOnly actions={{ onQuery: () => {} }} />
              <ReusableTable 
                data={sampleProjects} 
                columns={columnsSample} 
                onFieldChange={() => {}} 
              />
            </SecondaryContainer>
          )}

          {activeTabs.sampleAccounts && (
            <SecondaryContainer title="Link Projects/Accounts > Sample Accounts">
              <Toolbar isTableOnly actions={{ onQuery: () => {} }} />
              <ReusableTable 
                data={sampleAccounts} 
                columns={columnsSample} 
                onFieldChange={() => {}} 
              />
            </SecondaryContainer>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default LinkProjectsAccounts;
