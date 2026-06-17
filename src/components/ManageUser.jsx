// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";
// import { FaUser } from "react-icons/fa";
// import { CircleArrowLeft } from "lucide-react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import api from "../utils/api";

// const ManageUser = ({ canEdit }) => {
//   // Global lists
//   const [users, setUsers] = useState([]);
//   const [userNewPassword, setUserNewPassword] = useState("");
//   const [userConfirmPassword, setUserConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const [openPasswordRest, setOpenPasswordRest] = useState(false);

//   // UI state
//   const [activeMainTab, setActiveMainTab] = useState("manageUsers");
//   const [initialLoading, setInitialLoading] = useState(true);
//   // Manage Users form state
//   const [resetUserId, setResetUserId] = useState(null);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [userNameInput, setUserNameInput] = useState("");
//   const [userFullNameInput, setUserFullNameInput] = useState("");
//   const [userEmailInput, setUserEmailInput] = useState("");
//   const [userFormLoading, setUserFormLoading] = useState(false);
//   const [searchTermManageUsers, setSearchTermManageUsers] = useState("");
//   const [selectedUserIdsForDelete, setSelectedUserIdsForDelete] = useState([]);
//   const [userPasswordInput, setUserPasswordInput] = useState("");
//   const [userRoleInput, setUserRoleInput] = useState("");
//   const [userIsActive, setUserIsActive] = useState(true);
//   const [error, setError] = useState(null);
//   const [userFormResetLoading, setUserFormResetLoading] = useState(false);

//   const isFetching = useRef(false);

//   // ------------Manage Users------------

//   // --- FETCH USERS ON START ---
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setInitialLoading(true);
//       const userRes = await api.get(`${backendUrl}/api/User`);
//       const userData = applyUserSorting(userRes.data);
//       setUsers(userData);
//     } catch (e) {
//       console.error("Fetch users failed", e);
//       setError("Failed to load users.");
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   const applyUserSorting = (userData) => {
//     // newest (highest userId) first; adjust if you have createdAt
//     return [...(userData || [])].sort(
//       (a, b) => (b.userId ?? 0) - (a.userId ?? 0),
//     );
//   };

//   const resetUserForm = () => {
//     setEditingUserId(null);
//     setUserNameInput("");
//     setUserFullNameInput("");
//     setUserEmailInput("");
//     setUserPasswordInput("");
//     setUserRoleInput("");
//     setUserIsActive("");
//   };

//   const startEditUser = (u) => {
//     setEditingUserId(u.userId);
//     setResetUserId(u.userId);
//     setUserNameInput(u.username || "");
//     setUserFullNameInput(u.fullName || "");
//     setUserEmailInput(u.email || "");
//     setUserPasswordInput(""); // typically not loaded back
//     setUserRoleInput(u.role || "");
//     setUserIsActive(u.isActive || "");
//   };

//   const resetUserIdFun = (u) => {
//     setResetUserId(u.userId);
//   };

//   const toggleSelectedUserForDelete = (id) => {
//     setSelectedUserIdsForDelete((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   };

//   const areAllUsersSelected = (list) =>
//     list.length > 0 &&
//     list.every((u) => selectedUserIdsForDelete.includes(u.userId));

//   const toggleSelectAllUsers = (list) => {
//     if (areAllUsersSelected(list)) {
//       setSelectedUserIdsForDelete([]);
//     } else {
//       setSelectedUserIdsForDelete(list.map((u) => u.userId));
//     }
//   };

//   const handleCreateOrUpdateUser = async () => {
//     if (!userNameInput.trim() || !userFullNameInput.trim()) {
//       toast.warn("Username and full name are required.");
//       return;
//     }

//     // Only validate password regex if it's a NEW user
//     // OR if an existing user is trying to change their password
//     if (!editingUserId || userPasswordInput.trim().length > 0) {
//       const passwordRegex =
//         /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
//       if (!passwordRegex.test(userPasswordInput)) {
//         toast.error(
//           "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.",
//         );
//         return;
//       }
//     }

//     try {
//       setUserFormLoading(true);

//       const payload = {
//         username: userNameInput.trim(),
//         fullName: userFullNameInput.trim(),
//         email: userEmailInput.trim(),
//         role: userRoleInput.trim(),
//         isActive: userIsActive,
//       };

//       if (editingUserId == null) {
//         await api.post(`${backendUrl}/api/User`, {
//           ...payload,
//           password: userPasswordInput.trim(),
//         });
//         toast.success("User created successfully.");
//       } else {
//         // For updates, only send password if provided
//         if (userPasswordInput.trim())
//           payload.password = userPasswordInput.trim();
//         await api.put(`${backendUrl}/api/User/${editingUserId}`, {
//           ...payload,
//           userId: editingUserId,
//         });
//         toast.success("User updated successfully.");
//       }

//       // --- REFRESH DATA ---
//       // Wrapped in a try-catch or simplified to prevent crashing the whole flow
//       const userRes = await api.get(`${backendUrl}/api/User`);
//       const userData = applyUserSorting(userRes.data);
//       setUsers(userData);

//       // Ensure setUserOptions exists before calling it
//       if (typeof setUserOptions === "function") {
//         setUserOptions(
//           userData.map((u) => ({
//             value: u.userId,
//             label: `${u.userId} - ${u.username || u.fullName || ""}`,
//           })),
//         );
//       }

//       resetUserForm();
//     } catch (e) {
//       console.error("Save user failed", e);
//       const apiMessage = e?.response?.data?.message || "Failed to save user.";
//       toast.error(apiMessage);
//     } finally {
//       setUserFormLoading(false);
//     }
//   };

//   const handleBulkDeleteUsers = async () => {
//     if (selectedUserIdsForDelete.length === 0) {
//       toast.warn("Select at least one user to delete.");
//       return;
//     }
//     if (!window.confirm(`Delete ${selectedUserIdsForDelete.length} users?`))
//       return;

//     try {
//       setUserFormLoading(true);

//       await api.post(
//         `${backendUrl}/api/User/BulkDelete`,
//         selectedUserIdsForDelete,
//       );
//       toast.success("Selected users deleted.");

//       // Clear selection IMMEDIATELY after successful API call
//       setSelectedUserIdsForDelete([]);

//       // Refresh list
//       const userRes = await api.get(`${backendUrl}/api/User`);
//       const userData = applyUserSorting(userRes.data);
//       setUsers(userData);

//       if (editingUserId && !userData.some((u) => u.userId === editingUserId)) {
//         resetUserForm();
//       }
//     } catch (e) {
//       console.error("Bulk delete users failed", e);
//       toast.error("Failed to delete selected users.");
//     } finally {
//       setUserFormLoading(false);
//     }
//   };

//   const handleResetPassword = async (userId) => {
//     // 1. Basic Validation: Match check (Keep outside try/catch for immediate feedback)
//     if (userNewPassword !== userConfirmPassword) {
//       toast.error("New password and confirmation do not match.");
//       return;
//     }

//     // 2. Strength Validation
//     const passwordRegex =
//       /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
//     if (!passwordRegex.test(userConfirmPassword)) {
//       toast.error(
//         "Password must be at least 8 characters long and include a special character.",
//       );
//       return;
//     }

//     try {
//       setUserFormResetLoading(true);

//       // 3. Prepare the payload
//       const payload = {
//         newPassword: userConfirmPassword,
//       };

//       // 4. API Call
//       await api.put(`${backendUrl}/api/User/${userId}/reset-password`, payload);

//       toast.success("Password updated successfully.");

//       // --- SUCCESS ACTIONS ---
//       setOpenPasswordRest(false); // Close popup ONLY on success
//       setUserNewPassword("");
//       setUserConfirmPassword("");
//       // If setUserOldPassword exists in your state:
//       // setUserOldPassword("");

//       // 5. Refresh user data
//       const userRes = await api.get(`${backendUrl}/api/User`);
//       const userData = applyUserSorting(userRes.data);
//       setUsers(userData);

//       resetUserForm();
//     } catch (e) {
//       console.error("Password update failed", e);
//       const apiMessage =
//         e?.response?.data?.message ||
//         e?.response?.data?.title ||
//         (typeof e?.response?.data === "string" ? e.response.data : null);
//       toast.error(apiMessage || "Failed to update password.");

//       // Popup stays open so user can fix the error (e.g., weak password rejected by server)
//     } finally {
//       setUserFormResetLoading(false);
//     }
//   };

//   const renderManageUsersTab = () => {
//     const filteredUsers = users.filter((u) =>
//       `${u.userId} ${u.username || ""} ${u.fullName || ""} ${u.email || ""}`
//         .toLowerCase()
//         .includes(searchTermManageUsers.toLowerCase()),
//     );

//     const allSelected = areAllUsersSelected(filteredUsers);

//     return (
//       <>
//         {canEdit("manageUser") && (
//           <div className="mb-1">
//             <h3 className="text-sm font-semibold text-gray-900 mb-3 ">
//               {editingUserId ? "Edit User" : "Create User"}
//             </h3>

//             <div className="grid  md:grid-cols-3 gap-4">
//               <div className="flex items-center gap-2 w-full sm:w-auto ">
//                 <label className="input-label">Username</label>
//                 <input
//                   type="text"
//                   value={userNameInput}
//                   onChange={(e) => setUserNameInput(e.target.value)}
//                   className="input-style"
//                   placeholder="Username"
//                 />
//               </div>
//               <div className="flex items-center gap-2 w-full sm:w-auto ">
//                 <label className="input-label">Full Name</label>
//                 <input
//                   type="text"
//                   value={userFullNameInput}
//                   onChange={(e) => setUserFullNameInput(e.target.value)}
//                   className="input-style"
//                   placeholder="Full name"
//                 />
//               </div>
//               <div className="flex items-center gap-2 w-full sm:w-auto ">
//                 <label className="input-label">Email</label>
//                 <input
//                   type="email"
//                   value={userEmailInput}
//                   onChange={(e) => setUserEmailInput(e.target.value)}
//                   className="input-style"
//                   placeholder="Email"
//                 />
//               </div>
//               {editingUserId ? null : (
//                 <div className="flex items-start gap-2 w-full sm:w-auto">
//                   <label className="input-label mt-2">Password</label>
//                   <div className="flex flex-col flex-1">
//                     {/* Wrapper to stack input and hint vertically */}
//                     <input
//                       type="password"
//                       value={userPasswordInput}
//                       onChange={(e) => setUserPasswordInput(e.target.value)}
//                       className="input-style"
//                       placeholder="Password"
//                     />
//                     {/* <div className="relative">
//       <input
//         type={showPassword ? "text" : "password"} // Dynamic type
//         value={userPasswordInput}
//         onChange={(e) => setUserPasswordInput(e.target.value)}
//         className="input-style w-full pr-10" // Add padding on right for icon
//         placeholder="Password"
//       /> */}
//                     {/* The Toggle Icon */}
//                     {/* <button
//         type="button"
//         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
//         onClick={() => setShowPassword(!showPassword)}
//       >
//         {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
//       </button>
//     </div> */}
//                     <p className="text-[10px] text-red-400 mt-1">
//                       {/* Must be 8+ characters with a special character (e.g., @, #, $).
//                        */}
//                       Min 8 chars. Include (e.g., @, #, $).
//                     </p>
//                   </div>
//                 </div>
//               )}
//               <div className="flex items-center gap-2 w-full sm:w-auto ">
//                 <label className="input-label">Role</label>
//                 <select
//                   value={userRoleInput}
//                   onChange={(e) => setUserRoleInput(e.target.value)}
//                   className="input-style "
//                 >
//                   <option value="">Select role</option>
//                   <option value="admin">Admin</option>
//                   {/* <option value="manager">Manager</option> */}
//                   <option value="user">User</option>
//                   <option value="approver">Approver</option>
//                 </select>
//               </div>
//               <div className="flex items-center gap-2 w-full sm:w-auto ">
//                 <label className="input-label">Status</label>
//                 <select
//                   value={userIsActive ? "true" : "false"}
//                   onChange={(e) => setUserIsActive(e.target.value === "true")}
//                   className="input-style"
//                 >
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className={canEdit("manageUser") ? "mt-10" : ""}>
//           <div className="flex justify-between items-center mb-3">
//             <div className="flex gap-2 items-center">
//               <h3 className="input-label">Existing Users</h3>
//               <input
//                 type="text"
//                 placeholder="Search by id, username, name, email..."
//                 value={searchTermManageUsers}
//                 onChange={(e) => setSearchTermManageUsers(e.target.value)}
//                 className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
//               />
//             </div>
//             <div className="flex items-center gap-x-2">
//               {canEdit("manageUser") && (
//                 <button
//                   type="button"
//                   onClick={handleCreateOrUpdateUser}
//                   className="btn1 btn-blue disabled:opacity-60"
//                   disabled={userFormLoading}
//                 >
//                   {userFormLoading
//                     ? "Saving..."
//                     : editingUserId
//                       ? "Update User"
//                       : "Create User"}
//                 </button>
//               )}
//               {editingUserId && canEdit("manageUser") && (
//                 <button
//                   type="button"
//                   onClick={resetUserForm}
//                   className="btn1 btn-blue"
//                   disabled={userFormLoading}
//                 >
//                   Cancel
//                 </button>
//               )}
//               {canEdit("manageUser") && (
//                 <button
//                   type="button"
//                   onClick={handleBulkDeleteUsers}
//                   className={`btn1 btn-red disabled:opacity-50 ${userFormLoading || selectedUserIdsForDelete.length === 0 ? "hidden" : ""}`}
//                   disabled={
//                     userFormLoading || selectedUserIdsForDelete.length === 0
//                   }
//                 >
//                   Delete ({selectedUserIdsForDelete.length})
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="rounded border border-gray-200 overflow-hidden relative">
//             {openPasswordRest && (
//               <div className="fixed inset-0  z-50 flex items-center justify-center">
//                 <div className="absolute inset-0 bg-black/40"></div>
//                 <div
//                   className="relative top-8 bg-white w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col
//                             animate-premium-popup shadow-2xl rounded"
//                 >
//                   <div className="overflow-y-auto py-4 px-2 custom-scrollbar">
//                     <form
//                       onSubmit={(e) => {
//                         e.preventDefault();

//                         if (userNewPassword != userConfirmPassword) {
//                           toast.error(
//                             "New password and confirm password should be same",
//                           );
//                         } else {
//                           handleResetPassword(resetUserId);
//                         }
//                       }}
//                       className="w-full max-w-md mx-auto flex flex-col gap-4"
//                     >
//                       {/* Old Password */}
//                       <div className="flex justify-end">
//                         <button
//                           className="btn1 btn-blue flex items-center gap-1"
//                           onClick={() => setOpenPasswordRest(false)}
//                           title="Close"
//                         >
//                           <CircleArrowLeft size={12} className="text-white" />
//                           Back
//                         </button>
//                       </div>
//                       {/* <div className="flex gap-2 items-center justify-between">
//                           <label className="text-sm font-medium text-gray-700">
//                             Old Password
//                           </label>
//                           <input
//                             type="password"
//                             value={userOldPassword}
//                             onChange={(e) => setUserOldPassword(e.target.value)}
//                             className="input-style"
//                             placeholder="Enter old password"
//                           />
//                         </div> */}

//                       {/* New Password */}
//                       <div className="flex gap-2 items-center justify-between">
//                         <label className="text-sm font-medium text-gray-700">
//                           New Password
//                         </label>
//                         <input
//                           type="password"
//                           value={userNewPassword}
//                           onChange={(e) => setUserNewPassword(e.target.value)}
//                           className="input-style "
//                           placeholder="Enter new password"
//                         />
//                       </div>

//                       {/* Confirm Password */}
//                       <div className="flex gap-2 items-center justify-between">
//                         <label className="text-sm font-medium text-gray-700">
//                           Confirm Password
//                         </label>
//                         <input
//                           type="password"
//                           value={userConfirmPassword}
//                           onChange={(e) =>
//                             setUserConfirmPassword(e.target.value)
//                           }
//                           className="input-style "
//                           placeholder="Confirm new password"
//                         />
//                       </div>
//                       {/* New Hint Text */}
//                       <p className="text-[10px] text-red-400 text-right -mt-3">
//                         {/* Must be 8+ characters with a special character (e.g., @, #, $).
//                          */}
//                         Min 8 chars. Include (e.g., @, #, $).
//                       </p>

//                       {/* Action Buttons */}
//                       <div className="flex justify-center gap-3 pt-2">
//                         <button
//                           type="submit"
//                           className="btn1 btn-blue"
//                           disabled={userFormResetLoading}
//                         >
//                           {userFormResetLoading
//                             ? "Updating"
//                             : "Update Password"}
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="overflow-x-auto max-h-80 border border-gray-300 rounded">
//               <table className="w-full text-sm">
//                 <thead className="thead">
//                   <tr className="bg-white border-b border-gray-300">
//                     {canEdit("manageUser") && (
//                       <th className="th-thead text-left text-black bg-[#e5f3fb] text-sm w-10">
//                         <input
//                           type="checkbox"
//                           className="w-3 h-3"
//                           checked={allSelected}
//                           onChange={() => toggleSelectAllUsers(filteredUsers)}
//                         />
//                       </th>
//                     )}
//                     {/* <th className="th-thead text-left text-gray-500 text-xs">
//                     ID
//                   </th> */}
//                     <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
//                       Username
//                     </th>
//                     <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
//                       Full Name
//                     </th>
//                     <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
//                       Role
//                     </th>
//                     <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
//                       Email
//                     </th>
//                     <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
//                       Status
//                     </th>
//                     {canEdit("manageUser") && (
//                       <th className="th-thead text-right bg-[#e5f3fb] text-black text-xs">
//                         Actions
//                       </th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {initialLoading ? (
//                     /* SHOW LOADING SPINNER INSTEAD OF BLANK */
//                     <tr>
//                       <td colSpan={7} className="px-3 py-12 text-center">
//                         <div className="flex flex-col items-center gap-2">
//                           {/* <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div> */}
//                           <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                           <p className="text-gray-500 font-medium">
//                             Fetching users...
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : userFormLoading ? (
//                     <tr>
//                       <td colSpan={7} className="px-3 py-10 text-center">
//                         <div className="flex flex-col items-center gap-2">
//                           {/* You can replace this with a Spinner component if you have one */}
//                           <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                           <span className="text-gray-500 font-medium">
//                             Loading users...
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : filteredUsers.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="px-3 py-6 text-center text-gray-500"
//                       >
//                         No users found.
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredUsers.map((u) => {
//                       const selected = selectedUserIdsForDelete.includes(
//                         u.userId,
//                       );
//                       return (
//                         <tr
//                           key={u.userId}
//                           className="hover:bg-gray-50 border-b border-gray-300"
//                         >
//                           {canEdit("manageUser") && (
//                             <td className="tbody-td">
//                               <input
//                                 type="checkbox"
//                                 className="w-3 h-3"
//                                 checked={selected}
//                                 onChange={() =>
//                                   toggleSelectedUserForDelete(u.userId)
//                                 }
//                               />
//                             </td>
//                           )}
//                           {/* <td className="tbody-td">{u.userId}</td> */}
//                           <td className="tbody-td">{u.username}</td>
//                           <td className="tbody-td">{u.fullName}</td>
//                           <td className="tbody-td capitalize">{u.role}</td>
//                           <td className="tbody-td">{u.email}</td>

//                           <td className="tbody-td">
//                             <span
//                               className={`inline-block rounded-2xl px-4 py-1 whitespace-nowrap ${
//                                 u.isActive
//                                   ? "bg-green-100 text-black"
//                                   : "bg-red-100 text-black"
//                               } `}
//                             >
//                               {u.isActive ? "Active" : "Inactive"}
//                             </span>
//                           </td>
//                           {canEdit("manageUser") && (
//                             <td className="tbody-td text-right flex gap-2 items-center justify-center">
//                               <button
//                                 type="button"
//                                 onClick={() => startEditUser(u)}
//                                 className="btn1 btn-blue whitespace-nowrap"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   resetUserIdFun(u);
//                                   setOpenPasswordRest(true);
//                                 }}
//                                 className="btn1 btn-blue whitespace-nowrap"
//                               >
//                                 Reset Passowrd
//                               </button>
//                               {/* <button
//                             type="button"
//                             onClick={() => handleBulkDeleteUsers([u.userId])}
//                             className="text-xs px-3 py-1 rounded border border-red-500 text-red-600"
//                           >
//                             Delete
//                           </button> */}
//                             </td>
//                           )}
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <div className="p-4 rounded-sm flex items-center justify-between bg-white">
//         <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//           <FaUser size={20} className="text-blue-600" />
//           Manger User
//         </h2>
//       </div>
//       <div className="p-3 w-full mx-auto bg-white rounded shadow">
//         {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

//         {activeMainTab === "manageUsers" && renderManageUsersTab()}
//       </div>
//     </div>
//   );
// };

// export default ManageUser;

import React, { useEffect, useState, useRef } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import {
  FaUser,
  FaSearch,
  FaPlus,
  FaCopy,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import api from "../utils/api";

const ManageUser = ({ canEdit }) => {
  // Global lists & Selection
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Authentication");
  const [initialLoading, setInitialLoading] = useState(true);

  // Form State (Matching Screenshot)
  const [formData, setFormData] = useState({
    userId: "15644.SUKHMAN.SANDHU",
    userName: "Sukhman.Sandhu",
    authMethod: "Active Directory",
    adCertificateId: "15644.sukhman.sandhu",
    password: "",
    verifyPassword: "",
    isPasskeyFido: false,
    genTempPassword: false,
    manageAdGroups: false,
    allowIntegration: true,
    allowExtensibility: true,
    twoFactor: "None", // None, Mobile, Notification
    effectiveDate: "",
    pin: "",
  });

  // Module Lists
  const [modules] = useState([
    { id: "AD", name: "Configuration", domain: "Time & Expense" },
    { id: "AP", name: "Accounts Payable", domain: "Accounting" },
    { id: "AR", name: "Accounts Receivable", domain: "Accounting" },
    { id: "BA", name: "Administration", domain: "Planning" },
    { id: "BD", name: "Budgeting and ETC", domain: "Projects" },
  ]);
  const [assignedModules, setAssignedModules] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setInitialLoading(false);
    } catch (e) {
      console.error("Fetch failed", e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] text-[13px]">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between bg-white p-2 border-b border-gray-300">
        <h2 className="text-sm font-bold text-gray-700">Manage Users</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1 bg-[#4a90e2] text-white rounded-sm hover:bg-blue-600">
            <FaPlus size={10} /> New
          </button>
          <div className="flex border rounded-sm overflow-hidden">
            <button className="px-3 py-1 bg-white border-r hover:bg-gray-50">
              Copy
            </button>
            <button className="px-2 py-1 bg-white hover:bg-gray-50">▼</button>
          </div>
          <button className="px-3 py-1 bg-white border rounded-sm text-red-600 hover:bg-red-50">
            Delete
          </button>

          <div className="flex items-center gap-2 ml-4 border-l pl-4">
            <span className="text-gray-500 italic">1 of 1 Existing</span>
            <button className="px-3 py-1 border rounded bg-white">
              Query ▼
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="p-4 space-y-4 overflow-y-auto">
        {/* Top Identity Row */}
        <div className="grid grid-cols-2 gap-8 bg-white p-4 border rounded shadow-sm">
          <div className="flex items-center gap-2">
            <label className="w-24 font-semibold">User ID *</label>
            <input
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className="flex-1 border p-1 rounded bg-[#fffbe6]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-24 font-semibold">User Name *</label>
            <div className="relative flex-1">
              <input
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full border p-1 rounded"
              />
              <FaSearch
                className="absolute right-2 top-2 text-gray-400"
                size={12}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-300 gap-1 mt-4">
          {[
            "Information",
            "Workflow",
            "Printing Defaults",
            "Authentication",
            "Web Services",
            "User Interface",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 text-sm transition-colors ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-600 font-bold bg-white" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Authentication Content */}
        <div className="bg-white border p-4 rounded-b shadow-sm">
          <div className="flex gap-8">
            {/* Left: Auth Settings */}
            <div className="flex-1 space-y-3 border-r pr-8">
              <h4 className="text-blue-600 font-bold text-xs uppercase mb-2">
                Authentication Settings
              </h4>
              <div className="flex items-center justify-between">
                <label>Authentication Method*</label>
                <select name="authMethod" className="w-2/3 border p-1 rounded">
                  <option>Active Directory</option>
                  <option>Standard</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label>Password</label>
                <input
                  type="password"
                  disabled
                  className="w-2/3 border p-1 rounded bg-gray-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Active Directory ID</label>
                <input
                  name="adCertificateId"
                  value={formData.adCertificateId}
                  onChange={handleInputChange}
                  className="w-2/3 border p-1 rounded"
                />
              </div>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Passkey (FIDO)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Manage AD Groups
                </label>
              </div>
            </div>

            {/* Right: 2FA Settings */}
            <div className="w-1/3 space-y-3 pl-4">
              <h4 className="text-blue-600 font-bold text-xs uppercase mb-2">
                2FA Settings
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="twoFactor"
                    checked={formData.twoFactor === "None"}
                  />{" "}
                  None
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="twoFactor" /> Mobile Application
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="twoFactor" /> Notification
                </label>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-gray-500">Effective Date</label>
                  <input
                    type="text"
                    disabled
                    className="w-24 border bg-gray-50"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-gray-500">PIN</label>
                  <input
                    type="text"
                    disabled
                    className="w-24 border bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Console Permissions */}
        <div className="flex gap-8 bg-white p-2 border rounded border-blue-200">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked /> Allow Access to Integration
            Console
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked /> Allow Access to Extensibility
            Console
          </label>
        </div>

        {/* Bottom Sub-Tabs & Module Grids */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              Module Rights
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              Company Access
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              Application Rights
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 h-64">
            {/* Left Grid: Module List */}
            <div className="border bg-white rounded flex flex-col">
              <div className="p-2 border-b bg-gray-50 font-bold">
                Module List
              </div>
              <div className="overflow-auto flex-1">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-1 border w-8">
                        <input type="checkbox" />
                      </th>
                      <th className="p-1 border">Module</th>
                      <th className="p-1 border">Name</th>
                      <th className="p-1 border">Domain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b hover:bg-blue-50 cursor-pointer"
                      >
                        <td className="p-1 border text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="p-1 border">{m.id}</td>
                        <td className="p-1 border">{m.name}</td>
                        <td className="p-1 border">{m.domain}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Grid: Assigned Module Rights */}
            <div className="border bg-white rounded flex flex-col">
              <div className="p-2 border-b bg-gray-50 font-bold flex justify-between">
                <span>Manage Users &gt; Module Rights</span>
                <div className="flex gap-1">
                  <button className="px-2 bg-blue-500 text-white text-[10px] rounded">
                    New
                  </button>
                  <button className="px-2 bg-white border text-[10px] rounded">
                    Query
                  </button>
                </div>
              </div>
              <div className="overflow-auto flex-1 bg-gray-50">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-1 border">Module *</th>
                      <th className="p-1 border">Name</th>
                      <th className="p-1 border">Module Rights *</th>
                      <th className="p-1 border">Company *</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty state or mapped data */}
                    <tr>
                      <td
                        colSpan="4"
                        className="p-4 text-center text-gray-400 italic"
                      >
                        No rights assigned to this user
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
