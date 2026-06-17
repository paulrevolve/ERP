// import React, { useState } from "react";
// import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { Link2 } from "lucide-react";

// const columns = [
//   { id: "projectWildcard", key: "projectWildcard", label: "Project Wildcard String *" },
//   { id: "orgWildcard", key: "orgWildcard", label: "Organization Wildcard String *" },
//   { id: "orgCount", key: "orgCount", label: "Org Count" },
//   { id: "projectCount", key: "projectCount", label: "Project Count" },
//   { id: "possibleCombinations", key: "possibleCombinations", label: "Possible Combinations" }
// ];

// const LinkProjectsOrganizations = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [records, setRecords] = useState([
//     { 
//       id: "1", 
//       projectWildcard: "PRJ%", 
//       orgWildcard: "ORG%", 
//       orgCount: "12", 
//       projectCount: "45", 
//       possibleCombinations: "540" 
//     }
//   ]);

//   const handleAdd = () => {
//     const newId = `NEW_${Date.now()}`;
//     setRecords([{ id: newId, projectWildcard: "", orgWildcard: "", orgCount: "0", projectCount: "0", possibleCombinations: "0" }, ...records]);
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={Link2} title="Link Projects/Organizations">
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
//           <SecondaryContainer title="Link Projects/Organizations">
//             <ReusableTable 
//               data={records} 
//               columns={columns} 
//               onFieldChange={() => {}} 
//             />
//             <div className="flex justify-end gap-4 mt-2 px-2 text-xs text-blue-600 underline cursor-pointer">
//               <span>Wildcard Option</span>
//               <span>Sample Projects</span>
//               <span>Sample Organizations</span>
//             </div>
//           </SecondaryContainer>
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default LinkProjectsOrganizations;

import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { Link2 } from "lucide-react";

const columnsLink = [
  { id: "projectWildcard", key: "projectWildcard", label: "Project Wildcard String *" },
  { id: "orgWildcard", key: "orgWildcard", label: "Organization Wildcard String *" },
  { id: "orgCount", key: "orgCount", label: "Org Count" },
  { id: "projectCount", key: "projectCount", label: "Project Count" },
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

const LinkProjectsOrganizations = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [activeTabs, setActiveTabs] = useState({});
  const [records, setRecords] = useState([
    { 
      id: "1", 
      projectWildcard: "PRJ%", 
      orgWildcard: "ORG%", 
      orgCount: "12", 
      projectCount: "45", 
      possibleCombinations: "540" 
    }
  ]);

  const [wildcardRules, setWildcardRules] = useState([]);
  const [sampleProjects, setSampleProjects] = useState([]);
  const [sampleOrganizations, setSampleOrganizations] = useState([]);

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    setRecords([{ id: newId, projectWildcard: "", orgWildcard: "", orgCount: "0", projectCount: "0", possibleCombinations: "0" }, ...records]);
  };

  const toggleTab = (tab) => {
    setActiveTabs(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Link2} title="Link Projects/Organizations">
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
          <SecondaryContainer title="Link Projects/Organizations">
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
              { id: "sampleOrganizations", label: "Sample Organizations" }
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
            <SecondaryContainer title="Link Projects/Organizations > Wildcard Option">
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
            <SecondaryContainer title="Link Projects/Organizations > Sample Projects">
              <Toolbar isTableOnly actions={{ onQuery: () => {} }} />
              <ReusableTable 
                data={sampleProjects} 
                columns={columnsSample} 
                onFieldChange={() => {}} 
              />
            </SecondaryContainer>
          )}

          {activeTabs.sampleOrganizations && (
            <SecondaryContainer title="Link Projects/Organizations > Sample Organizations">
              <Toolbar isTableOnly actions={{ onQuery: () => {} }} />
              <ReusableTable 
                data={sampleOrganizations} 
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

export default LinkProjectsOrganizations;
