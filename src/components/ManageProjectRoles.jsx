// // // // import React, { useState, useEffect } from "react";
// // // // import { ShieldCheck, UserCheck, Briefcase } from "lucide-react";
// // // // import { toast } from "react-toastify";
// // // // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // // // import { ReusableTable } from "../helper/tableSection";
// // // // import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

// // // // const ManageProjectRoles = () => {
// // // //   // View States
// // // //   const [isFormView, setIsFormView] = useState(false);
// // // //   const [isAssignedFormView, setIsAssignedFormView] = useState(false);
  
// // // //   // Data States
// // // //   const [projectData, setProjectData] = useState({ projectId: "", description: "" });
// // // //   const [roles, setRoles] = useState([]);
// // // //   const [users, setUsers] = useState([]);
// // // //   const [assignedUsers, setAssignedUsers] = useState([]);
  
// // // //   // Selection States
// // // //   const [selectedRoleIds, setSelectedRoleIds] = useState(new Set());
// // // //   const [selectedAssignedIds, setSelectedAssignedIds] = useState(new Set());
// // // //   const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
// // // //   const [currentAssignedIndex, setCurrentAssignedIndex] = useState(0);

// // // //   // Clipboard for Assigned Users
// // // //   const [assignedClipboard, setAssignedClipboard] = useState([]);

// // // //   // Column Definitions
// // // //   const roleColumns = [
// // // //     { id: "roleCode", key: "roleCode", label: "Role Code", type: "text", required: true },
// // // //     { id: "roleDesc", key: "roleDesc", label: "Description", type: "text" }
// // // //   ];

// // // //   const userColumns = [
// // // //     { id: "userId", key: "userId", label: "User ID", type: "readOnly-text" },
// // // //     { id: "userName", key: "userName", label: "Name", type: "readOnly-text" },
// // // //     { id: "empId", key: "empId", label: "Employee ID", type: "readOnly-text" }
// // // //   ];

// // // //   const assignedColumns = [
// // // //     { id: "roleCode", key: "roleCode", label: "Role Code *", type: "search-select", options: roles, displayKey: "roleCode" },
// // // //     { id: "roleDesc", key: "roleDesc", label: "Description", type: "readOnly-text" },
// // // //     { id: "userId", key: "userId", label: "User ID *", type: "search-select", options: users, displayKey: "userId" },
// // // //     { id: "userName", key: "userName", label: "Name", type: "readOnly-text" },
// // // //     { id: "applyLower", key: "applyLower", label: "Apply to Lower Project Levels", type: "checkbox" },
// // // //     { id: "keepExisting", key: "keepExisting", label: "Keep Existing Lower Project", type: "checkbox" }
// // // //   ];

// // // //   // --- Handlers ---

// // // //   const handleRoleChange = (id, field, value) => {
// // // //     setRoles(prev => prev.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
// // // //   };

// // // //   const handleAssignedChange = (id, field, value) => {
// // // //     setAssignedUsers(prev => prev.map(a => a.id === id ? { ...a, [field]: value, isDirty: true } : a));
// // // //   };

// // // //   const handleFindReplaceRoles = (config, isReplaceMode) => {
// // // //     const { column, findYear, replaceValue } = config;
// // // //     if (!isReplaceMode) {
// // // //       // Logic for Search/Filter
// // // //       toast.info(`Searching for ${findYear} in ${column}`);
// // // //     } else {
// // // //       setRoles(prev => prev.map(r => 
// // // //         String(r[column]).includes(findYear) ? { ...r, [column]: replaceValue, isDirty: true } : r
// // // //       ));
// // // //       toast.success("Bulk update applied to roles");
// // // //     }
// // // //   };

// // // //   const handleCopyAssigned = () => {
// // // //     const targets = selectedAssignedIds.size > 0 
// // // //       ? assignedUsers.filter(a => selectedAssignedIds.has(String(a.id)))
// // // //       : [assignedUsers[currentAssignedIndex]];
    
// // // //     setAssignedClipboard(targets);
// // // //     toast.success(`${targets.length} assignment(s) copied`);
// // // //   };

// // // //   const handlePasteAssigned = () => {
// // // //     const pasted = assignedClipboard.map((item, i) => ({
// // // //       ...item,
// // // //       id: `PASTE_${Date.now()}_${i}`,
// // // //       isDirty: true
// // // //     }));
// // // //     setAssignedUsers(prev => [...pasted, ...prev]);
// // // //   };

// // // //   // --- UI Render Helpers ---

// // // //   const renderRoleForm = (role) => (
// // // //     <div className="grid grid-cols-2 gap-4">
// // // //       <FormInput label="Role Code *" value={role?.roleCode || ""} onChange={(e) => handleRoleChange(role.id, "roleCode", e.target.value)} />
// // // //       <FormInput label="Description" value={role?.roleDesc || ""} onChange={(e) => handleRoleChange(role.id, "roleDesc", e.target.value)} />
// // // //     </div>
// // // //   );

// // // //   const renderAssignedForm = (assigned) => (
// // // //     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// // // //       <FormSearchSelect label="Role Code *" value={assigned?.roleCode} options={roles} displayKey="roleCode" onSelect={(opt) => handleAssignedChange(assigned.id, "roleCode", opt.roleCode)} />
// // // //       <FormInput label="Description" value={assigned?.roleDesc || ""} readOnly />
// // // //       <FormSearchSelect label="User ID *" value={assigned?.userId} options={users} displayKey="userId" onSelect={(opt) => handleAssignedChange(assigned.id, "userId", opt.userId)} />
// // // //       <FormInput label="Name" value={assigned?.userName || ""} readOnly />
// // // //       <FormInput label="Apply to Lower" type="checkbox" checked={assigned?.applyLower === "Y"} onChange={(e) => handleAssignedChange(assigned.id, "applyLower", e.target.checked ? "Y" : "N")} />
// // // //       <FormInput label="Keep Existing" type="checkbox" checked={assigned?.keepExisting === "Y"} onChange={(e) => handleAssignedChange(assigned.id, "keepExisting", e.target.checked ? "Y" : "N")} />
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <div className="p-4 space-y-4 font-inter">
// // // //       {/* Primary Container */}
// // // //       <MainContainer icon={Briefcase} title="Manage Project Roles">
// // // //         <Toolbar 
// // // //           isFormView={false} 
// // // //           actions={{ onAdd: () => {}, onSave: () => {}, onClear: () => {} }}
// // // //           buttonsDisable={["copy", "paste", "tableform"]}
// // // //         />
        
// // // //         <FormSection className="mb-4">
// // // //           <div className="flex gap-4 items-center">
// // // //             <FormSearchSelect 
// // // //               label="Project *" 
// // // //               value={projectData.projectId} 
// // // //               options={[]} 
// // // //               displayKey="id" 
// // // //               placeholder="Search Project..."
// // // //             />
// // // //             <FormInput value={projectData.description} readOnly className="flex-1" />
// // // //           </div>
// // // //         </FormSection>

// // // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// // // //           {/* Roles Secondary Section */}
// // // //           <SecondaryContainer title="Roles">
// // // //             <Toolbar 
// // // //               isFormView={isFormView}
// // // //               columns={roleColumns}
// // // //               handleFindReplace={handleFindReplaceRoles}
// // // //               totalRecords={roles.length}
// // // //               currentIndex={currentRoleIndex}
// // // //               handleNavigate={(dir) => {/* Navigation Logic */}}
// // // //               actions={{
// // // //                 onAdd: () => { /* Add Role Logic */ },
// // // //                 onToggleView: () => setIsFormView(!isFormView),
// // // //                 onDelete: () => {},
// // // //                 onSave: () => {}
// // // //               }}
// // // //             />
// // // //             {isFormView ? (
// // // //               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
// // // //                 {renderRoleForm(roles[currentRoleIndex])}
// // // //               </div>
// // // //             ) : (
// // // //               <ReusableTable 
// // // //                 data={roles} 
// // // //                 columns={roleColumns} 
// // // //                 selectedRows={selectedRoleIds}
// // // //                 onRowSelect={(row) => {/* Selection Logic */}}
// // // //                 onFieldChange={handleRoleChange}
// // // //               />
// // // //             )}
// // // //           </SecondaryContainer>

// // // //           {/* Users Secondary Section */}
// // // //           <SecondaryContainer title="Users">
// // // //              <Toolbar 
// // // //               isFormView={false}
// // // //               actions={{}} 
// // // //               buttonsDisable={["add", "save", "delete", "copy", "paste", "discard", "tableform"]}
// // // //             />
// // // //             <ReusableTable data={users} columns={userColumns} rowKey="userId" />
// // // //           </SecondaryContainer>
// // // //         </div>
// // // //       </MainContainer>

// // // //       {/* Roles Assigned to Users Section */}
// // // //       <SecondaryContainer title="Roles Assigned to Users">
// // // //         <Toolbar 
// // // //           isFormView={isAssignedFormView}
// // // //           columns={assignedColumns}
// // // //           totalRecords={assignedUsers.length}
// // // //           currentIndex={currentAssignedIndex}
// // // //           actions={{
// // // //             onAdd: () => {},
// // // //             onCopy: handleCopyAssigned,
// // // //             onPaste: handlePasteAssigned,
// // // //             onToggleView: () => setIsAssignedFormView(!isAssignedFormView),
// // // //             onDelete: () => {},
// // // //             onSave: () => {}
// // // //           }}
// // // //           clipboard={assignedClipboard}
// // // //         />
// // // //         {isAssignedFormView ? (
// // // //           <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
// // // //             {renderAssignedForm(assignedUsers[currentAssignedIndex])}
// // // //           </div>
// // // //         ) : (
// // // //           <ReusableTable 
// // // //             data={assignedUsers} 
// // // //             columns={assignedColumns}
// // // //             selectedRows={selectedAssignedIds}
// // // //             onFieldChange={handleAssignedChange}
// // // //           />
// // // //         )}
// // // //       </SecondaryContainer>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ManageProjectRoles;

// // // import React, { useState } from "react";
// // // import { Briefcase } from "lucide-react";
// // // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // // import { ReusableTable } from "../helper/tableSection";
// // // import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

// // // const ManageProjectRoles = () => {
// // //   // View States
// // //   const [isMainFormView, setIsMainFormView] = useState(true);
// // //   const [isAssignedFormView, setIsAssignedFormView] = useState(false);
  
// // //   // Data States
// // //   const [projects, setProjects] = useState([{ id: "P001", projectName: "System Refactor", isDirty: false }]);
// // //   const [selectedProject, setSelectedProject] = useState({ id: "P001", projectName: "System Refactor" });
// // //   const [roles, setRoles] = useState([]);
// // //   const [users, setUsers] = useState([]);
// // //   const [assignedUsers, setAssignedUsers] = useState([]);

// // //   // Column Definitions
// // //   const projectColumns = [
// // //     { id: "id", key: "id", label: "Project", type: "text" },
// // //     { id: "projectName", key: "projectName", label: "Project Name", type: "text" }
// // //   ];

// // //   const roleColumns = [
// // //     { id: "roleCode", key: "roleCode", label: "Role Code", type: "text" },
// // //     { id: "roleDesc", key: "roleDesc", label: "Description", type: "text" }
// // //   ];

// // //   const userColumns = [
// // //     { id: "userId", key: "userId", label: "User ID", type: "readOnly-text" },
// // //     { id: "userName", key: "userName", label: "Name", type: "readOnly-text" }
// // //   ];

// // //   const assignedColumns = [
// // //     { id: "roleCode", key: "roleCode", label: "Role Code *", type: "search-select", options: roles, displayKey: "roleCode" },
// // //     { id: "userId", key: "userId", label: "User ID *", type: "search-select", options: users, displayKey: "userId" },
// // //     { id: "applyLower", key: "applyLower", label: "Apply to Lower Project Levels", type: "checkbox" },
// // //     { id: "keepExisting", key: "keepExisting", label: "Keep Existing Lower Project", type: "checkbox" }
// // //   ];

// // //   // Handlers
// // //   const handleProjectFindReplace = (config, isReplaceMode) => {
// // //     if (!isReplaceMode) return;
// // //     const { column, findYear, replaceValue } = config;
// // //     setProjects(prev => prev.map(p => 
// // //       String(p[column]).includes(findYear) ? { ...p, [column]: replaceValue, isDirty: true } : p
// // //     ));
// // //   };

// // //   return (
// // //     <div className="p-4 space-y-4 font-inter">
// // //       {/* 1. PRIMARY CONTAINER: PROJECTS */}
// // //       <MainContainer icon={Briefcase} title="Manage Project Roles">
// // //         <Toolbar 
// // //           isFormView={isMainFormView}
// // //           columns={projectColumns}
// // //           handleFindReplace={handleProjectFindReplace}
// // //           actions={{
// // //             onToggleView: () => setIsMainFormView(!isMainFormView),
// // //             onAdd: () => {},
// // //             onSave: () => {},
// // //             onClear: () => {},
// // //             onDelete: () => {}
// // //           }}
// // //         />
        
// // //         <div className="mt-2">
// // //           {isMainFormView ? (
// // //             <FormSection title="Project Selection">
// // //               <div className="flex gap-4 items-center">
// // //                 <FormSearchSelect 
// // //                   label="Project *" 
// // //                   value={selectedProject.id} 
// // //                   options={projects} 
// // //                   displayKey="id" 
// // //                 />
// // //                 <FormInput value={selectedProject.projectName} readOnly className="flex-1" />
// // //               </div>
// // //             </FormSection>
// // //           ) : (
// // //             <ReusableTable 
// // //               data={projects} 
// // //               columns={projectColumns} 
// // //               onFieldChange={(id, field, val) => {}}
// // //             />
// // //           )}
// // //         </div>
// // //       </MainContainer>

// // //       {/* 2. SEPARATE SECONDARY CONTAINER: ROLES */}
// // //       <SecondaryContainer title="Roles">
// // //         <Toolbar 
// // //           isFormView={false}
// // //           actions={{}} 
// // //           buttonsDisable={["add", "save", "delete", "copy", "paste", "discard", "tableform"]}
// // //         />
// // //         <ReusableTable data={roles} columns={roleColumns} />
// // //       </SecondaryContainer>

// // //       {/* 3. SEPARATE SECONDARY CONTAINER: USERS */}
// // //       <SecondaryContainer title="Users">
// // //         <Toolbar 
// // //           isFormView={false}
// // //           actions={{}} 
// // //           buttonsDisable={["add", "save", "delete", "copy", "paste", "discard", "tableform"]}
// // //         />
// // //         <ReusableTable data={users} columns={userColumns} rowKey="userId" />
// // //       </SecondaryContainer>

// // //       {/* 4. SECONDARY CONTAINER: ASSIGNED ROLES */}
// // //       <SecondaryContainer title="Roles Assigned to Users">
// // //         <Toolbar 
// // //           isFormView={isAssignedFormView}
// // //           columns={assignedColumns}
// // //           actions={{
// // //             onToggleView: () => setIsAssignedFormView(!isAssignedFormView),
// // //             onAdd: () => {},
// // //             onSave: () => {},
// // //             onDelete: () => {},
// // //             onCopy: () => {},
// // //             onPaste: () => {}
// // //           }}
// // //         />
// // //         <div className="mt-2">
// // //           {isAssignedFormView ? (
// // //             <FormSection title="Assignment Details">
// // //                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                   <FormSearchSelect label="Role Code *" options={roles} displayKey="roleCode" />
// // //                   <FormSearchSelect label="User ID *" options={users} displayKey="userId" />
// // //                </div>
// // //             </FormSection>
// // //           ) : (
// // //             <ReusableTable data={assignedUsers} columns={assignedColumns} />
// // //           )}
// // //         </div>
// // //       </SecondaryContainer>
// // //     </div>
// // //   );
// // // };

// // // export default ManageProjectRoles;

// // import React, { useState } from "react";
// // import { Briefcase } from "lucide-react";
// // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // import { ReusableTable } from "../helper/tableSection";
// // import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

// // const ManageProjectRoles = () => {
// //   // View States
// //   const [isMainFormView, setIsMainFormView] = useState(true);
// //   const [isAssignedFormView, setIsAssignedFormView] = useState(false);
  
// //   // Data States
// //   const [projects, setProjects] = useState([{ id: "P001", projectName: "System Refactor", isDirty: false }]);
// //   const [selectedProject, setSelectedProject] = useState({ id: "P001", projectName: "System Refactor" });
// //   const [roles, setRoles] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [assignedUsers, setAssignedUsers] = useState([]);

// //   // Column Definitions
// //   const projectColumns = [
// //     { id: "id", key: "id", label: "Project", type: "text" },
// //     { id: "projectName", key: "projectName", label: "Project Name", type: "text" }
// //   ];

// //   const roleColumns = [
// //     { id: "roleCode", key: "roleCode", label: "Role Code", type: "text" },
// //     { id: "roleDesc", key: "roleDesc", label: "Description", type: "text" }
// //   ];

// //   const userColumns = [
// //     { id: "userId", key: "userId", label: "User ID", type: "readOnly-text" },
// //     { id: "userName", key: "userName", label: "Name", type: "readOnly-text" },
// //     { id: "empId", key: "empId", label: "Employee ID", type: "readOnly-text" }
// //   ];

// //   const assignedColumns = [
// //     { id: "roleCode", key: "roleCode", label: "Role Code *", type: "search-select", options: roles, displayKey: "roleCode" },
// //     { id: "roleDesc", key: "roleDesc", label: "Description", type: "readOnly-text" },
// //     { id: "userId", key: "userId", label: "User ID *", type: "search-select", options: users, displayKey: "userId" },
// //     { id: "userName", key: "userName", label: "Name", type: "readOnly-text" },
// //     { id: "applyLower", key: "applyLower", label: "Apply to Lower Project Levels", type: "checkbox" },
// //     { id: "keepExisting", key: "keepExisting", label: "Keep Existing Lower Project", type: "checkbox" }
// //   ];

// //   // Handlers
// //   const handleProjectFindReplace = (config, isReplaceMode) => {
// //     if (!isReplaceMode) return;
// //     const { column, findYear, replaceValue } = config;
// //     setProjects(prev => prev.map(p => 
// //       String(p[column]).includes(findYear) ? { ...p, [column]: replaceValue, isDirty: true } : p
// //     ));
// //   };

// //   return (
// //     <div className="p-4 space-y-4 font-inter">
// //       {/* 1. PRIMARY CONTAINER: PROJECTS */}
// //       <MainContainer icon={Briefcase} title="Manage Project Roles">
// //         <Toolbar 
// //           isFormView={isMainFormView}
// //           columns={projectColumns}
// //           handleFindReplace={handleProjectFindReplace}
// //           actions={{
// //             onToggleView: () => setIsMainFormView(!isMainFormView),
// //             onAdd: () => {},
// //             onSave: () => {},
// //             onClear: () => {},
// //             onDelete: () => {}
// //           }}
// //         />
        
// //         <div className="mt-2">
// //           {isMainFormView ? (
// //             <FormSection title="Project Selection">
// //               <div className="flex gap-4 items-center">
// //                 <FormSearchSelect 
// //                   label="Project *" 
// //                   value={selectedProject.id} 
// //                   options={projects} 
// //                   displayKey="id" 
// //                 />
// //                 <FormInput value={selectedProject.projectName} readOnly className="flex-1" />
// //               </div>
// //             </FormSection>
// //           ) : (
// //             <ReusableTable 
// //               data={projects} 
// //               columns={projectColumns} 
// //               onFieldChange={(id, field, val) => {}}
// //             />
// //           )}
// //         </div>

// //         {/* SIDE-BY-SIDE ROLES & USERS DIV */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
// //           {/* Roles Section */}
// //           <SecondaryContainer title="Roles">
// //             <Toolbar 
// //               isFormView={false}
// //               actions={{}} 
// //               buttonsDisable={["add", "save", "delete", "copy", "paste", "discard", "tableform"]}
// //             />
// //             <ReusableTable data={roles} columns={roleColumns} maxHeight="max-h-[30vh]" />
// //           </SecondaryContainer>

// //           {/* Users Section */}
// //           <SecondaryContainer title="Users">
// //             <Toolbar 
// //               isFormView={false}
// //               actions={{}} 
// //               buttonsDisable={["add", "save", "delete", "copy", "paste", "discard", "tableform"]}
// //             />
// //             <ReusableTable data={users} columns={userColumns} rowKey="userId" maxHeight="max-h-[30vh]" />
// //           </SecondaryContainer>
// //         </div>
// //       </MainContainer>

// //       {/* 2. SECONDARY CONTAINER: ASSIGNED ROLES */}
// //       <SecondaryContainer title="Roles Assigned to Users">
// //         <Toolbar 
// //           isFormView={isAssignedFormView}
// //           columns={assignedColumns}
// //           actions={{
// //             onToggleView: () => setIsAssignedFormView(!isAssignedFormView),
// //             onAdd: () => {},
// //             onSave: () => {},
// //             onDelete: () => {},
// //             onCopy: () => {},
// //             onPaste: () => {}
// //           }}
// //         />
// //         <div className="mt-2">
// //           {isAssignedFormView ? (
// //             <FormSection title="Assignment Details">
// //                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <FormSearchSelect label="Role Code *" options={roles} displayKey="roleCode" />
// //                   <FormSearchSelect label="User ID *" options={users} displayKey="userId" />
// //                </div>
// //             </FormSection>
// //           ) : (
// //             <ReusableTable data={assignedUsers} columns={assignedColumns} />
// //           )}
// //         </div>
// //       </SecondaryContainer>
// //     </div>
// //   );
// // };

// // export default ManageProjectRoles;

// import React, { useState } from "react";
// import { Briefcase } from "lucide-react";
// import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

// const ManageProjectRoles = () => {
//   // View States
//   const [isMainFormView, setIsMainFormView] = useState(true);
//   const [isAssignedFormView, setIsAssignedFormView] = useState(false);
  
//   // Data States
//   const [projects, setProjects] = useState([{ id: "P001", projectName: "Main System", isDirty: false }]);
//   const [selectedProject, setSelectedProject] = useState({ id: "P001", projectName: "Main System" });
//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState([]);
  
//   // Selection/Pagination Indices
//   const [currentAssignedIndex, setCurrentAssignedIndex] = useState(0);

//   // Column Definitions
//   const projectColumns = [
//     { id: "id", key: "id", label: "Project", type: "text" },
//     { id: "projectName", key: "projectName", label: "Project Name", type: "text" }
//   ];

//   const roleColumns = [
//     { id: "roleCode", key: "roleCode", label: "Role Code", type: "text" },
//     { id: "roleDesc", key: "roleDesc", label: "Description", type: "text" }
//   ];

//   const userColumns = [
//     { id: "userId", key: "userId", label: "User ID", type: "readOnly-text" },
//     { id: "userName", key: "userName", label: "Name", type: "readOnly-text" },
//     { id: "empId", key: "empId", label: "Employee ID", type: "readOnly-text" }
//   ];

//   const assignedColumns = [
//     { id: "roleCode", key: "roleCode", label: "Role Code *", type: "search-select", options: roles, displayKey: "roleCode" },
//     { id: "roleDesc", key: "roleDesc", label: "Description", type: "readOnly-text" },
//     { id: "userId", key: "userId", label: "User ID *", type: "search-select", options: users, displayKey: "userId" },
//     { id: "userName", key: "userName", label: "Name", type: "readOnly-text" },
//     { id: "applyLower", key: "applyLower", label: "Apply to Lower Project Levels", type: "checkbox" },
//     { id: "keepExisting", key: "keepExisting", label: "Keep Existing Lower Project", type: "checkbox" }
//   ];

//   // Handlers
//   const handleProjectFindReplace = (config, isReplaceMode) => {
//     if (!isReplaceMode) return;
//     const { column, findYear, replaceValue } = config;
//     setProjects(prev => prev.map(p => 
//       String(p[column]).includes(findYear) ? { ...p, [column]: replaceValue, isDirty: true } : p
//     ));
//   };

//   const handleAssignedFieldChange = (id, field, value) => {
//     setAssignedUsers(prev => prev.map(row => 
//       row.id === id ? { ...row, [field]: value, isDirty: true } : row
//     ));
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       {/* 1. PRIMARY CONTAINER: PROJECTS */}
//       <MainContainer icon={Briefcase} title="Manage Project Roles">
//         <Toolbar 
//           isFormView={isMainFormView}
//           columns={projectColumns}
//           handleFindReplace={handleProjectFindReplace}
//           actions={{
//             onToggleView: () => setIsMainFormView(!isMainFormView),
//             onAdd: () => {},
//             onSave: () => {},
//             onClear: () => {},
//             onDelete: () => {}
//           }}
//         />
        
//         <div className="mt-2">
//           {isMainFormView ? (
//             <FormSection title="Project Selection">
//               <div className="flex gap-4 items-center">
//                 <FormSearchSelect 
//                   label="Project *" 
//                   value={selectedProject.id} 
//                   options={projects} 
//                   displayKey="id" 
//                 />
//                 <FormInput value={selectedProject.projectName} readOnly className="flex-1" />
//               </div>
//             </FormSection>
//           ) : (
//             <ReusableTable 
//               data={projects} 
//               columns={projectColumns} 
//               onFieldChange={(id, field, val) => {}}
//             />
//           )}
//         </div>
//       </MainContainer>

//       {/* 2. NEW SEPARATE DIV FOR ROLES & USERS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <SecondaryContainer title="Roles">
//           <Toolbar 
//             isFormView={false}
//             actions={{}} 
//             buttonsDisable={["add", "save", "delete", "copy", "paste", "discard", "tableform"]}
//           />
//           <ReusableTable data={roles} columns={roleColumns} maxHeight="max-h-[30vh]" />
//         </SecondaryContainer>

//         <SecondaryContainer title="Users">
//           <Toolbar 
//             isFormView={false}
//             actions={{}} 
//             buttonsDisable={["add", "save", "delete", "copy", "paste", "discard", "tableform"]}
//           />
//           <ReusableTable data={users} columns={userColumns} rowKey="userId" maxHeight="max-h-[30vh]" />
//         </SecondaryContainer>
//       </div>

//       {/* 3. ASSIGNED ROLES CONTAINER */}
//       <SecondaryContainer title="Roles Assigned to Users">
//         <Toolbar 
//           isFormView={isAssignedFormView}
//           columns={assignedColumns}
//           totalRecords={assignedUsers.length}
//           currentIndex={currentAssignedIndex}
//           handleNavigate={(dir) => {
//              if (dir === 'next') setCurrentAssignedIndex(i => Math.min(i + 1, assignedUsers.length - 1));
//              if (dir === 'prev') setCurrentAssignedIndex(i => Math.max(i - 1, 0));
//           }}
//           actions={{
//             onToggleView: () => setIsAssignedFormView(!isAssignedFormView),
//             onAdd: () => {},
//             onSave: () => {},
//             onDelete: () => {},
//             onCopy: () => {},
//             onPaste: () => {},
//             onClear: () => {}
//           }}
//         />
//         <div className="mt-2">
//           {isAssignedFormView ? (
//             <FormSection title="Assignment Details">
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
//                   <FormSearchSelect label="Role Code *" value={assignedUsers[currentAssignedIndex]?.roleCode} options={roles} displayKey="roleCode" />
//                   <FormInput label="Description" value={assignedUsers[currentAssignedIndex]?.roleDesc} readOnly />
//                   <FormSearchSelect label="User ID *" value={assignedUsers[currentAssignedIndex]?.userId} options={users} displayKey="userId" />
//                   <FormInput label="Name" value={assignedUsers[currentAssignedIndex]?.userName} readOnly />
                  
//                   {/* NEW LABELED CHECKBOXES */}
//                   <FormInput 
//                     label="Apply to Lower Project Levels" 
//                     type="checkbox" 
//                     checked={assignedUsers[currentAssignedIndex]?.applyLower === "Y"} 
//                     onChange={(e) => handleAssignedFieldChange(assignedUsers[currentAssignedIndex]?.id, "applyLower", e.target.checked ? "Y" : "N")} 
//                   />
//                   <FormInput 
//                     label="Keep Existing Lower Project Roles" 
//                     type="checkbox" 
//                     checked={assignedUsers[currentAssignedIndex]?.keepExisting === "Y"} 
//                     onChange={(e) => handleAssignedFieldChange(assignedUsers[currentAssignedIndex]?.id, "keepExisting", e.target.checked ? "Y" : "N")} 
//                   />
//                </div>
//             </FormSection>
//           ) : (
//             <ReusableTable 
//               data={assignedUsers} 
//               columns={assignedColumns} 
//               onFieldChange={handleAssignedFieldChange}
//             />
//           )}
//         </div>
//       </SecondaryContainer>
//     </div>
//   );
// };

// export default ManageProjectRoles;

import React, { useState } from "react";
import { Briefcase } from "lucide-react";
import { toast } from "react-toastify";
import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

const ManageProjectRoles = () => {
  const [isMainFormView, setIsMainFormView] = useState(true);
  const [isAssignedFormView, setIsAssignedFormView] = useState(false);
  
  const [projects, setProjects] = useState([{ id: "P001", projectName: "Main System", isDirty: false }]);
  const [selectedProject, setSelectedProject] = useState({ id: "P001", projectName: "Main System" });
  const [roles] = useState([]);
  const [users] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [currentAssignedIndex, setCurrentAssignedIndex] = useState(0);

  // Column Definitions
  const projectColumns = [
    { id: "id", key: "id", label: "Project", type: "text" },
    { id: "projectName", key: "projectName", label: "Project Name", type: "text" }
  ];

  const assignedColumns = [
    { id: "roleCode", key: "roleCode", label: "Role Code *", type: "search-select", options: roles, displayKey: "roleCode" },
    { id: "roleDesc", key: "roleDesc", label: "Description", type: "readOnly-text" },
    { id: "userId", key: "userId", label: "User ID *", type: "search-select", options: users, displayKey: "userId" },
    { id: "userName", key: "userName", label: "Name", type: "readOnly-text" },
    { id: "applyLower", key: "applyLower", label: "Apply to Lower Project Levels", type: "checkbox" },
    { id: "keepExisting", key: "keepExisting", label: "Keep Existing Lower Project Roles", type: "checkbox" }
  ];

  // --- ADD NEW LOGIC (Reference: ManageEmployee.jsx) ---
  const handleAddAssigned = () => {
    const tempId = `NEW_${Date.now()}`;
    const newEntry = {
      id: tempId, // Set id so selection works immediately
      tempId: tempId, // Stable reference for unsaved row
      roleCode: "",
      roleDesc: "",
      userId: "",
      userName: "",
      applyLower: "N",
      keepExisting: "N",
      isDirty: true // Mark as dirty for the Save badge[cite: 1, 3]
    };

    // Prepend to list so it appears at the top of the table[cite: 1]
    setAssignedUsers(prev => [newEntry, ...prev]);
    
    // Auto-focus on the new record for Form View
    setCurrentAssignedIndex(0); 
    
    // Optional: stay in current view but notify user
    toast.info("New row added to the top.");
  };

  const handleAssignedFieldChange = (rowId, field, value) => {
    setAssignedUsers(prev => prev.map(row => 
      (row.tempId || row.id) === rowId ? { ...row, [field]: value, isDirty: true } : row
    ));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      {/* 1. PRIMARY CONTAINER: PROJECTS */}
      <MainContainer icon={Briefcase} title="Manage Project Roles">
        <Toolbar 
          isFormView={isMainFormView}
          columns={projectColumns}
          actions={{
            onToggleView: () => setIsMainFormView(!isMainFormView),
            onAdd: () => {}, 
            onSave: () => {},
            onClear: () => {},
            onDelete: () => {}
          }}
        />
        <div className="mt-2">
          {isMainFormView ? (
            <FormSection title="Project Selection">
              <div className="flex gap-4 items-center">
                <FormSearchSelect label="Project *" value={selectedProject.id} options={projects} displayKey="id" />
                <FormInput value={selectedProject.projectName} readOnly className="flex-1" />
              </div>
            </FormSection>
          ) : (
            <ReusableTable data={projects} columns={projectColumns} onFieldChange={() => {}} />
          )}
        </div>
      </MainContainer>

      {/* 2. ROLES & USERS DIV */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SecondaryContainer title="Roles">
          <Toolbar isFormView={false} actions={{}} buttonsDisable={["add", "save", "delete", "copy", "paste", "discard", "tableform"]} />
          <ReusableTable data={roles} columns={[{ label: "Role Code", key: "roleCode" }, { label: "Description", key: "roleDesc" }]} maxHeight="max-h-[30vh]" />
        </SecondaryContainer>

        <SecondaryContainer title="Users">
          <Toolbar isFormView={false} actions={{}} buttonsDisable={["add", "save", "delete", "copy", "paste", "discard", "tableform"]} />
          <ReusableTable data={users} columns={[{ label: "User ID", key: "userId" }, { label: "Name", key: "userName" }]} rowKey="userId" maxHeight="max-h-[30vh]" />
        </SecondaryContainer>
      </div>

      {/* 3. ASSIGNED ROLES: SUPPORTS NEW IN BOTH VIEWS */}
      <SecondaryContainer title="Roles Assigned to Users">
        <Toolbar 
          isFormView={isAssignedFormView}
          columns={assignedColumns}
          totalRecords={assignedUsers.length}
          currentIndex={currentAssignedIndex}
          handleNavigate={(dir) => {
             if (dir === 'next') setCurrentAssignedIndex(i => Math.min(i + 1, assignedUsers.length - 1));
             if (dir === 'prev') setCurrentAssignedIndex(i => Math.max(i - 1, 0));
          }}
          isDirty={assignedUsers.some(u => u.isDirty)}
          actions={{
            onAdd: handleAddAssigned, // Trigger the new row logic[cite: 1]
            onToggleView: () => setIsAssignedFormView(!isAssignedFormView),
            onSave: () => { /* Save Logic */ },
            onDelete: () => { /* Delete Logic */ },
            onClear: () => { /* Clear Logic */ }
          }}
        />
        <div className="mt-2">
          {isAssignedFormView ? (
            <FormSection title="Assignment Details">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <FormSearchSelect 
                    label="Role Code *" 
                    value={assignedUsers[currentAssignedIndex]?.roleCode} 
                    options={roles} 
                    displayKey="roleCode"
                    onSelect={(opt) => handleAssignedFieldChange(assignedUsers[currentAssignedIndex].id, "roleCode", opt.roleCode)}
                  />
                  <FormInput label="Description" value={assignedUsers[currentAssignedIndex]?.roleDesc} readOnly />
                  <FormSearchSelect 
                    label="User ID *" 
                    value={assignedUsers[currentAssignedIndex]?.userId} 
                    options={users} 
                    displayKey="userId"
                    onSelect={(opt) => handleAssignedFieldChange(assignedUsers[currentAssignedIndex].id, "userId", opt.userId)}
                  />
                  <FormInput label="Name" value={assignedUsers[currentAssignedIndex]?.userName} readOnly />
                  
                  <FormInput 
                    label="Apply to Lower Project Levels" 
                    type="checkbox" 
                    checked={assignedUsers[currentAssignedIndex]?.applyLower === "Y"} 
                    onChange={(e) => handleAssignedFieldChange(assignedUsers[currentAssignedIndex].id, "applyLower", e.target.checked ? "Y" : "N")} 
                  />
                  <FormInput 
                    label="Keep Existing Lower Project Roles" 
                    type="checkbox" 
                    checked={assignedUsers[currentAssignedIndex]?.keepExisting === "Y"} 
                    onChange={(e) => handleAssignedFieldChange(assignedUsers[currentAssignedIndex].id, "keepExisting", e.target.checked ? "Y" : "N")} 
                  />
               </div>
            </FormSection>
          ) : (
            <ReusableTable 
              data={assignedUsers} 
              columns={assignedColumns} 
              onFieldChange={handleAssignedFieldChange} // Inline table editing[cite: 5]
              rowKey="id"
            />
          )}
        </div>
      </SecondaryContainer>
    </div>
  );
};

export default ManageProjectRoles;