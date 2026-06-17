import React, { useEffect, useState } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import api from "../utils/api";
import { Plus } from "lucide-react";
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import { ActionDetailButton } from "../helper/formSection";

const ManageUserGroups = ({ canEdit }) => {
  // --- Data States ---
  const [groups, setGroups] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [allCompanies, setAllCompanies] = useState([]);
  //   const [allApplications, setAllApplications] = useState([]);

  // --- Selection & UI States ---
  const [selectedGroupRow, setSelectedGroupRow] = useState(null);
  const [activeView, setActiveView] = useState(null); // 'users' | 'modules' | 'apps'
  const [loading, setLoading] = useState(false);
  const [searchTermGroups, setSearchTermGroups] = useState("");

  // --- Mapping States ---
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);
  const [selectedAppIds, setSelectedAppIds] = useState([]);

  const [selectedGroups, setSelectedGroups] = useState([]);

  const [clipboard, setClipboard] = useState([]);

  //for assign user
  const [selectedMappingRows, setSelectedMappingRows] = useState([]);

  //   const allApplications = [
  //     { appId: 101, appName: "FinAxis Web Portal" },
  //     { appId: 102, appName: "Mobile Approval App" },
  //     { appId: 103, appName: "Inventory Sync Tool" },
  //     { appId: 104, appName: "Payroll Integration" },
  //   ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setInitialLoading(true); // Ensure spinner shows
    try {
      const [groupsRes, usersRes, modulesRes, appRes] = await Promise.all([
        // New Endpoint with CompanyId query param
        api.get(`${backendUrl}/api/UserGroups/GetAllUserGroups?CompanyId=1`),
        api.get(`${backendUrl}/api/User`),
        api.get(`${backendUrl}/api/Modules`),
        api.get(`${backendUrl}/api/AppList`),
      ]);

      // groupsRes.data now contains the nested "users" array for each group
      setGroups(groupsRes.data || []);
      setAllUsers(usersRes.data || []);
      setAllModules(modulesRes.data || []);
      setAllApplications(appRes.data || []);
    } catch (e) {
      console.error("Fetch Error:", e);
      toast.error("Failed to load initial security data.");
    } finally {
      setInitialLoading(false);
    }
  };

  // Inside your fetchInitialData or a separate useEffect
  const fetchCompanies = async () => {
    try {
      const res = await api.get(
        `${backendUrl}/api/Company/getall?pageNumber=1&pageSize=1000`,
      );
      // Access the 'data' property inside the response object
      setAllCompanies(res.data.data || []);
    } catch (err) {
      console.error("Error fetching companies", err);
      toast.error("Failed to load companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleActionClick = async (viewType) => {
    if (selectedGroups.length === 0) {
      toast.warn("Please select at least one group from the top table first.");
      return;
    }

    const latestGroup = selectedGroups[selectedGroups.length - 1];
    setActiveView(viewType);
    setSelectedGroupRow(latestGroup);

    try {
      setLoading(true);
      if (viewType === "users") {
        const assignedUsers = latestGroup.users || [];
        setSelectedUserIds(assignedUsers.map((u) => u.userId));
      } else if (viewType === "modules") {
        // FIX: Extract 'moduleId' from the 'moduleRights' array
        const rights = latestGroup.moduleRights || [];
        setSelectedModuleIds(rights.map((r) => r.moduleId));
      } else if (viewType === "apps") {
        // FIX: Extract 'screenCode' from the 'screenPermissions' array
        const perms = latestGroup.screenPermissions || [];
        setSelectedAppIds(perms.map((p) => p.screenCode));
      }
    } catch (e) {
      console.error("Error fetching group details:", e);
      toast.error("Failed to load group configurations.");
    } finally {
      setLoading(false);
    }
  };

  const saveMappings = async () => {
    try {
      setLoading(true);
      let endpoint = "";
      let finalPayload = null; // Use a fresh, single variable name

      const currentGroupId = selectedGroupRow?.userGroupId;
      const currentCompanyId = selectedGroupRow?.companyId || "1";

      if (!currentGroupId) {
        toast.warn("No group selected for mapping.");
        return;
      }

      // --- 1. DEFINE PAYLOADS BY VIEW ---
      if (activeView === "users") {
        endpoint = `${backendUrl}/api/UserGroups/UserGroupSetup/sync`;
        finalPayload = selectedUserIds.map((id) => {
          const userDetails = allUsers.find((u) => u.userId === id);
          return {
            userId: id,
            userGroupId: currentGroupId,
            moduleCd: "",
            companyId: userDetails?.companyId || "1",
          };
        });
      } else if (activeView === "modules") {
        endpoint = `${backendUrl}/api/UserGroups/UserGroupModuleSetup/sync?secObjId=${currentGroupId}&companyId=1`;

        finalPayload = selectedModuleIds.map((modCd) => {
          // 1. Find if this module already exists in the group's current rights
          const existingRight = selectedGroupRow?.moduleRights?.find(
            (r) => r.moduleId === modCd,
          );

          // 2. Get the value from the <select> in the DOM or fallback to existing/default
          // Note: In a production app, it's better to store these in a state object { [id]: value }
          const selectElement = document.querySelector(
            `tr[data-id="${modCd}"] select`,
          );
          const currentStatus = selectElement
            ? selectElement.value
            : existingRight?.sRightsStatusCd || "F";

          return {
            userGroupId: String(currentGroupId),
            moduleCD: String(modCd),
            companyId:
              existingRight?.companyId || selectedGroupRow?.companyId || "1", // Use API companyId
            accessFl: currentStatus === "D" ? "N" : "Y", // Map Deny to 'N'
            modifiedBy: "admin",
            rowversion: existingRight?.rowversion || 0,
            sRightsStatusCd: currentStatus, // Now takes 'F', 'V', or 'D' from UI
          };
        });
      } else if (activeView === "apps") {
        const currentCompanyId = selectedGroupRow?.companyId || "1";
        endpoint = `${backendUrl}/api/UserGroups/UserGroupScreenSetup/sync?userGroupId=${currentGroupId}&companyId=${currentCompanyId}`;

        finalPayload = selectedAppIds.map((appId) => {
          // 1. Find the specific row for this appId
          const row = document.querySelector(`tr[data-id="${appId}"]`);

          // 2. Get values from the specific dropdowns within that row
          const rightsSelect = row?.querySelector(".rights-select");
          const companySelect = row?.querySelector(".company-select");

          const currentStatus = rightsSelect ? rightsSelect.value : "V";
          const rowCompanyId = companySelect
            ? companySelect.value
            : currentCompanyId;

          return {
            userGroupId: String(currentGroupId),
            screenCode: String(appId),
            // Logic:
            // Full Access (F) -> View=true, Edit=true
            // Read Only (V)   -> View=true, Edit=false
            // Deny (D)        -> View=false, Edit=false
            canView: currentStatus !== "D",
            canEdit: currentStatus === "F",
            companyId: String(rowCompanyId),
            createdBy: "admin",
          };
        });
      }

      if (!endpoint || !finalPayload) return;

      await api.post(endpoint, finalPayload);
      toast.success(
        `${activeView.charAt(0).toUpperCase() + activeView.slice(1)} rights saved!`,
      );

      setSelectedMappingRows([]);
      await fetchInitialData();
    } catch (e) {
      console.error("Save Error:", e);
      // 415 usually means the server got 'undefined' instead of a JSON array
      toast.error(
        e.response?.status === 415
          ? "Server rejected data format (415). Try refreshing."
          : "Failed to save changes.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMappings = async () => {
    if (selectedMappingRows.length === 0) {
      toast.warn("Please select mappings to remove.");
      return;
    }

    // Confirmation
    if (
      !window.confirm(
        `Are you sure you want to remove ${selectedMappingRows.length} mapping(s)?`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      if (activeView === "modules") {
        /**
         * MODULES VIEW: Sync Logic
         * We find what should REMAIN after the deletion
         */
        const remainingModuleIds = selectedModuleIds.filter(
          (_, index) => !selectedMappingRows.includes(index),
        );

        // If no modules remain, we pass an empty array [] to the sync endpoint
        const payload = remainingModuleIds.map((modCd) => ({
          secObjId: String(selectedGroupRow.userGroupId),
          moduleCD: String(modCd),
          companyId: "1",
          accessFl: "Y",
          modifiedBy: "admin",
          rowversion: 0,
          sRightsStatusCd: "A",
        }));

        // Sync endpoint replaces the old list with this new list
        await api.post(
          `${backendUrl}/api/UserGroups/UserGroupModuleSetup/sync`,
          payload,
        );

        // Update UI state
        setSelectedModuleIds(remainingModuleIds);
        toast.success("Module mappings updated.");
      } else if (activeView === "users") {
        /**
         * USERS VIEW: Individual Delete Logic
         * We identify specific rows to remove via DELETE requests
         */
        const itemsToDelete = selectedMappingRows.map((index) => {
          const id = selectedUserIds[index];
          const detail = allUsers.find((u) => u.userId === id);
          return {
            userId: id,
            userGroupId: selectedGroupRow.userGroupId,
            moduleCd: "",
            companyId: detail?.companyId || "1",
          };
        });

        await Promise.all(
          itemsToDelete.map((payload) =>
            api.delete(`${backendUrl}/api/UserGroups/UserGroupSetup`, {
              data: payload,
              headers: { "Content-Type": "application/json" },
            }),
          ),
        );

        setSelectedUserIds((prev) =>
          prev.filter((_, index) => !selectedMappingRows.includes(index)),
        );
        toast.success("User mappings removed.");
      } else if (activeView === "apps") {
        /**
         * APPS VIEW: Sync Logic
         * We calculate the remaining IDs after the user's selection is removed.
         */
        const currentCompanyId = selectedGroupRow?.companyId || "1";

        // 1. Identify which IDs stay based on the checkboxes in selectedMappingRows
        const remainingAppIds = selectedAppIds.filter(
          (_, index) => !selectedMappingRows.includes(index),
        );

        // 2. Map the remaining IDs to the required API format
        const payload = remainingAppIds.map((appId) => {
          // Optional: Find existing permissions if you want to preserve 'Read Only' status
          // during a remove action. Otherwise, defaulting to true/true is fine.
          const existing = selectedGroupRow?.screenPermissions?.find(
            (p) => p.screenCode === appId,
          );

          return {
            userGroupId: String(currentGroupId),
            screenCode: String(appId),
            canView: existing ? existing.canView : true,
            canEdit: existing ? existing.canEdit : true,
            companyId: String(existing?.companyId || currentCompanyId),
            createdBy: "admin",
          };
        });

        // The sync endpoint will replace the existing list with our 'payload'
        // (or an empty array if everything was removed)
        await api.post(
          `${backendUrl}/api/UserGroups/UserGroupScreenSetup/sync?userGroupId=${currentGroupId}&companyId=${currentCompanyId}`,
          payload,
        );

        setSelectedAppIds(remainingAppIds);
        toast.success("Application rights updated.");
      }

      setSelectedMappingRows([]);
      fetchInitialData();
    } catch (e) {
      console.error("Delete Mapping Error:", e);
      toast.error("Failed to remove mappings.");
    } finally {
      setLoading(false);
    }
  };

  const toggleId = (id, setter) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const isLatest = (groupId) => {
    return (
      selectedGroups.length > 0 &&
      selectedGroups[selectedGroups.length - 1].userGroupId === groupId
    );
  };

  const toggleGroupSelection = (group) => {
    setSelectedGroups((prev) => {
      const isExisting = prev.find((g) => g.userGroupId === group.userGroupId);
      if (isExisting) {
        // Remove if already there
        return prev.filter((g) => g.userGroupId !== group.userGroupId);
      } else {
        // Add to end (making it the latest)
        return [...prev, group];
      }
    });
  };

  const handleDelete = async () => {
    if (selectedGroups.length === 0) {
      return toast.warn("Select at least one group to delete.");
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedGroups.length} group(s)?`,
    );

    if (confirmDelete) {
      try {
        // Collect IDs for API call
        const idsToDelete = selectedGroups.map((g) => g.userGroupId);

        // Example API call:
        // await api.delete(`${backendUrl}/api/user-projects/DeleteGroups`, { data: idsToDelete });

        // Update local UI state
        setGroups((prev) =>
          prev.filter((g) => !idsToDelete.includes(g.userGroupId)),
        );
        setSelectedGroups([]); // Clear selection
        toast.success("Groups deleted successfully");
      } catch (error) {
        toast.error("Failed to delete groups");
      }
    }
  };

  const handleCopy = () => {
    // 1. We use the already selected objects from your checkbox logic
    if (selectedGroups.length === 0) {
      toast.warn("No groups selected to copy");
      return;
    }

    // 2. Define columns matching your Group table
    const columns = ["userGroupId", "orgGroupName"];

    // 3. Create the Header Row (Tab-separated)
    const headerRow = columns.join("\t");

    // 4. Create the Data Rows
    const dataRows = selectedGroups
      .map((item) =>
        columns
          .map((col) => {
            const value = item[col];
            return value === null || value === undefined ? "" : value;
          })
          .join("\t"),
      )
      .join("\n");

    const fullText = `${headerRow}\n${dataRows}`;

    // 5. Copy to System Clipboard & Internal State
    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        setClipboard(selectedGroups); // Store objects for the handlePaste function
        toast.success(`${selectedGroups.length} groups copied to clipboard`);
      })
      .catch((err) => {
        toast.error("Failed to copy to clipboard");
        console.error(err);
      });
  };

  const handlePaste = () => {
    if (clipboard.length === 0) {
      return toast.warn("Clipboard is empty. Copy a group first.");
    }

    // Map the clipboard items to the same structure used in handleAddGroup
    const pastedRows = clipboard.map((row) => ({
      ...row, // Copy all existing properties (like companyId, orgGroupName)

      // 1. Follow your naming convention for the ID
      userGroupId: `${row.userGroupId}_COPY`,

      // 2. Use the same flags as handleAddGroup
      isNew: true, // Tells the Save logic to use POST
      isDirty: true, // Tells the Save logic this row has unsaved changes

      // 3. Clear relations (don't copy the users, just the group settings)
      users: [],
    }));

    // Add the new rows to the top of the list (same behavior as Add)
    setGroups((prev) => [...pastedRows, ...prev]);

    // Select the newly pasted rows so the user can see/edit them immediately
    setSelectedGroups(pastedRows);

    toast.success(`${pastedRows.length} groups pasted as new entries`);
  };

  const handleSaveGroups = async () => {
    // 1. Identify only rows that are New or have been edited
    const groupsToSave = groups.filter((g) => g.isNew || g.isDirty);

    if (groupsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    setLoading(true);
    try {
      // 2. Loop and call the API for each object individually
      // Using Promise.all so they run in parallel for speed
      await Promise.all(
        groupsToSave.map((g) => {
          const payload = {
            userGroupId: g.userGroupId,
            orgGroupName: g.orgGroupName,
            companyId: g.companyId || "1",
            companyName: g.companyName || "",
            createdAt: g.createdAt || new Date().toISOString(),
            users: null, // As requested
          };

          // POST api/UserGroups (Single Object)
          return api.post(`${backendUrl}/api/UserGroups`, payload);
        }),
      );

      toast.success(`${groupsToSave.length} group(s) saved successfully!`);

      // 3. Refresh and Clear UI
      await fetchInitialData();
      setSelectedGroups([]);
      setSelectedGroupRow(null);
      setActiveView(null);
    } catch (error) {
      console.error("Save Error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to save group changes";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    const newGroup = {
      userGroupId: "", // Blank for free-text entry
      orgGroupName: "",
      companyId: "1",
      isNew: true, // Flag to identify unsaved row
      isDirty: true, // Flag to track changes
    };

    // Add to the top of the list
    setGroups((prev) => [newGroup, ...prev]);

    // Select the new row so the user can immediately see/edit it
    setSelectedGroups([newGroup]);

    toast.info("New group row added. Please enter a Code and Name.");
  };

  const handleClear = () => {
    // Check if there's anything to clear (isNew or isDirty)
    const hasChanges = groups.some((g) => g.isNew || g.isDirty);

    if (!hasChanges) {
      toast.info("No unsaved changes to clear.");
      return;
    }

    // Reset by re-fetching from the database
    fetchInitialData();

    // Reset UI selection states
    setSelectedGroups([]);
    setSelectedGroupRow(null);
    setActiveView(null);

    toast.info("Unsaved rows and edits discarded.");
  };

  const handleDeleteGroups = async () => {
    if (selectedGroups.length === 0) {
      toast.warn("Please select groups to delete.");
      return;
    }

    const confirmMsg =
      selectedGroups.length === 1
        ? "Are you sure you want to delete this group?"
        : `Are you sure you want to delete ${selectedGroups.length} selected groups?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);

      // Filter out rows that exist in the DB (those NOT marked isNew)
      const existingGroups = selectedGroups.filter((g) => !g.isNew);

      // Call API for existing groups
      if (existingGroups.length > 0) {
        for (const group of existingGroups) {
          // DELETE endpoint: /api/UserGroups/{userGroupId}
          await api.delete(`${backendUrl}/api/UserGroups/${group.userGroupId}`);
        }
      }

      // Update local state: remove all selected groups (both new and existing)
      setGroups((prev) =>
        prev.filter(
          (g) =>
            !selectedGroups.some((sel) => sel.userGroupId === g.userGroupId),
        ),
      );

      // Clear selections
      setSelectedGroups([]);
      setSelectedGroupRow(null);
      setActiveView(null);

      toast.success("Deletion successful.");
    } catch (e) {
      console.error("Delete Error:", e);
      toast.error("Failed to delete groups. They may have active mappings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllGroups = () => {
    // Get the same filtered list used in the table
    const filteredGroups = groups.filter((g) =>
      g.userGroupId.toLowerCase().includes(searchTermGroups.toLowerCase()),
    );

    const allFilteredAreSelected = filteredGroups.every((fg) =>
      selectedGroups.some((sg) => sg.userGroupId === fg.userGroupId),
    );

    if (allFilteredAreSelected) {
      // DESELECT: Remove only the filtered items from selection
      const filteredIds = filteredGroups.map((g) => g.userGroupId);
      setSelectedGroups((prev) =>
        prev.filter((sg) => !filteredIds.includes(sg.userGroupId)),
      );
    } else {
      // SELECT: Add all filtered items that aren't already selected
      setSelectedGroups((prev) => {
        const existingIds = prev.map((sg) => sg.userGroupId);
        const toAdd = filteredGroups.filter(
          (fg) => !existingIds.includes(fg.userGroupId),
        );
        return [...prev, ...toAdd];
      });
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer title="Manage User Groups">
        <Toolbar
          clipboard={clipboard}
          rowKey={"userGroupId"}
          selectedRow={selectedGroups}
          loading={loading}
          actions={{
            onAdd: handleAddGroup,
            onDelete: handleDeleteGroups,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleClear,
            onSave: handleSaveGroups,
          }}
          isDirty={groups.some(
            (g) => g.isDirty || String(g.userGroupId).startsWith("NEW_"),
          )}
        />

        {/* Search Input */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search Groups..."
            className="input-style-master w-64"
            value={searchTermGroups}
            onChange={(e) => setSearchTermGroups(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto max-h-96 right-scrollbar">
          <table className="w-full text-sm border-collapse">
            <thead className="thead sticky top-0 z-10">
              <tr className="bg-[#e5f3fb]">
                <th className="th-thead w-10 text-center">
                  <input
                    type="checkbox"
                    className="accent-[#17414d] h-3.5 w-3.5 cursor-pointer"
                    checked={
                      groups.length > 0 &&
                      groups
                        .filter((g) =>
                          g.userGroupId
                            .toLowerCase()
                            .includes(searchTermGroups.toLowerCase()),
                        )
                        .every((fg) =>
                          selectedGroups.some(
                            (sg) =>
                              (fg.userGroupId &&
                                sg.userGroupId === fg.userGroupId) ||
                              fg === sg,
                          ),
                        )
                    }
                    onChange={handleSelectAllGroups}
                  />
                </th>
                <th className="th-thead text-black text-xs">Code</th>
                <th className="th-thead text-black text-xs">Group Name</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {initialLoading ? (
                <tr className="animate-pulse border-b border-gray-100">
                  <td colSpan="3" className="px-4 py-4 text-center">
                    <div className="flex justify-center items-center gap-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-[#17414d] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px]">Loading groups...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                groups
                  .filter((g) =>
                    (g.userGroupId || "")
                      .toLowerCase()
                      .includes(searchTermGroups.toLowerCase()),
                  )
                  .map((g, index) => {
                    const stableKey = g.isNew
                      ? `new-row-${index}`
                      : g.userGroupId;

                    const isSelected = selectedGroups.some((sel) =>
                      g.isNew ? sel === g : sel.userGroupId === g.userGroupId,
                    );

                    const latest = isLatest(g.userGroupId);

                    return (
                      <tr
                        key={stableKey}
                        onClick={() => toggleGroupSelection(g)}
                        className={`cursor-pointer transition-colors border-b border-gray-100 ${
                          latest
                            ? "bg-blue-100 hover:bg-blue-200"
                            : isSelected
                              ? "bg-blue-50 hover:bg-blue-100"
                              : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="tbody-td text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="accent-[#17414d] h-3.5 w-3.5"
                          />
                        </td>

                        <td className="tbody-td">
                          <input
                            type="text"
                            className={`td-input ${g.isNew ? "bg-white" : "bg-gray-50"}`}
                            value={g.userGroupId}
                            readOnly={!g.isNew}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              if (g.isNew) {
                                const newVal = e.target.value;
                                const updateRows = (prev) =>
                                  prev.map((item, i) =>
                                    i === index
                                      ? {
                                          ...item,
                                          userGroupId: newVal,
                                          isDirty: true,
                                        }
                                      : item,
                                  );

                                setGroups(updateRows);
                                setSelectedGroups(updateRows);
                              }
                            }}
                            placeholder={g.isNew ? "Enter Group Code..." : ""}
                          />
                        </td>

                        <td className="tbody-td">
                          <input
                            type="text"
                            className={`td-input ${g.isNew ? "bg-white" : "bg-gray-50"}`}
                            value={g.orgGroupName}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const newVal = e.target.value;
                              const updateRows = (prev) =>
                                prev.map((item, i) =>
                                  i === index
                                    ? {
                                        ...item,
                                        orgGroupName: newVal,
                                        isDirty: true,
                                      }
                                    : item,
                                );

                              setGroups(updateRows);
                              setSelectedGroups(updateRows);
                            }}
                            placeholder={g.isNew ? "Enter Group Name..." : ""}
                          />
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="p-3 border-t border-gray-100 flex justify-start gap-2">
          <ActionDetailButton
            label="Assign Users to Group"
            onClick={() => handleActionClick("users")}
            disabled={selectedGroups.length === 0}
          />
          <ActionDetailButton
            label="Manage Module Rights"
            onClick={() => handleActionClick("modules")}
            disabled={selectedGroups.length === 0}
          />
          <ActionDetailButton
            label="Application Rights"
            onClick={() => handleActionClick("apps")}
            disabled={selectedGroups.length === 0}
          />
        </div>
      </MainContainer>

      {/* --- SECTION 2: DYNAMIC BOTTOM INTERFACE --- */}
      {/* {activeView && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden animate-premium-popup">
          <div className="p-3 border-b border-gray-100 bg-[#17414d] flex justify-between items-center text-white">
            <span className="text-[10px] font-bold capitalize tracking-widest">
              Configuring {activeView}: {selectedGroupRow?.userGroupId}
            </span>
            <button
              onClick={saveMappings}
              disabled={loading}
              className="bg-white text-[#17414d] px-8 py-1 rounded text-[11px] font-bold capitalize hover:bg-gray-100 shadow-md"
            >
              {loading ? "Saving..." : "Confirm & Save"}
            </button>
          </div>

          <div className="p-4"> */}
      {/* 1. USER ASSIGNMENT VIEW */}
      {activeView === "users" && (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2">
          {/* Header with Actions */}
          {/* <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-[#17414d] tracking-wider">
                User Assignment
              </span>
              {selectedMappingRows.length > 0 && (
                <button
                  onClick={handleRemoveMappings}
                  className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100 hover:bg-red-100 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  DELETE SELECTED ({selectedMappingRows.length})
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedUserIds((prev) => [null, ...prev])}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700 shadow-sm"
              >
                <Plus size={14} /> Add
              </button>
               
            </div>
          </div> */}

          <SecondaryContainer title="Assign User to Group">
            <Toolbar
              clipboard={clipboard}
              rowKey={"userId"}
              // Points to the indices of the selected rows in the mapping table
              selectedRow={selectedMappingRows}
              loading={loading}
              actions={{
                // Adds a new null entry to the user IDs array to create a new dropdown row
                onAdd: () => setSelectedUserIds((prev) => [null, ...prev]),

                // Triggers the specific mapping removal logic
                onDelete: handleRemoveMappings,

                // Standard shared actions
                onCopy: handleCopy,
                onPaste: handlePaste,

                // Clears the current mapping selections or resets view
                onClear: () => {
                  setSelectedMappingRows([]);
                  handleActionClick("users"); // Re-syncs from latestGroup.users
                },

                // Saves the specifically mapped users
                onSave: saveMappings,
              }}
              // Optional: highlight if the number of users has changed from the original group data
              isDirty={
                selectedUserIds.length !==
                (selectedGroupRow?.users?.length || 0)
              }
            />

            <div className="max-h-80 overflow-y-auto right-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="thead sticky top-0 z-20">
                  <tr className="bg-[#e5f3fb]">
                    <th className="th-thead w-10 text-center">
                      <input
                        type="checkbox"
                        className="accent-[#17414d]"
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedMappingRows([
                              ...Array(selectedUserIds.length).keys(),
                            ]);
                          else setSelectedMappingRows([]);
                        }}
                        checked={
                          selectedMappingRows.length ===
                            selectedUserIds.length && selectedUserIds.length > 0
                        }
                      />
                    </th>
                    <th className="th-thead text-black text-xs py-2 px-4">
                      User ID
                    </th>
                    <th className="th-thead text-black text-xs py-2 px-4 w-32 text-center">
                      Name
                    </th>
                    <th className="th-thead text-black text-xs py-2 px-4 w-32 text-center">
                      Company ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {selectedUserIds.map((selectedId, index) => {
                    const userDetails = allUsers.find(
                      (u) => u.userId === selectedId,
                    );
                    return (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 ${selectedMappingRows.includes(index) ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
                      >
                        <td className="tbody-td text-center">
                          <input
                            type="checkbox"
                            className="accent-[#17414d]"
                            checked={selectedMappingRows.includes(index)}
                            onChange={() => {
                              setSelectedMappingRows((prev) =>
                                prev.includes(index)
                                  ? prev.filter((i) => i !== index)
                                  : [...prev, index],
                              );
                            }}
                          />
                        </td>
                        <td className="tbody-td px-4 py-2">
                          <select
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#17414d]"
                            value={selectedId || ""}
                            onChange={(e) => {
                              const newId = parseInt(e.target.value);
                              const updatedIds = [...selectedUserIds];
                              updatedIds[index] = newId;
                              setSelectedUserIds(updatedIds);
                            }}
                          >
                            <option value="" disabled>
                              -- Select User --
                            </option>
                            {allUsers
                              .filter(
                                (u) =>
                                  !selectedUserIds.includes(u.userId) ||
                                  u.userId === selectedId,
                              )
                              .map((u) => (
                                <option key={u.userId} value={u.userId}>
                                  {u.username || u.fullName}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="tbody-td text-center text-gray-500 font-mono text-[11px]">
                          {userDetails?.username || "—"}
                        </td>
                        <td className="tbody-td text-center text-gray-500 font-mono text-[11px]">
                          {userDetails?.companyId || "1"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SecondaryContainer>
        </div>
      )}

      {/* 2. MODULE RIGHTS (DUAL TABLE) & 3. APPLICATION RIGHTS (DUAL TABLE) */}
      {activeView === "modules" && (
        <div className="grid grid-cols-2 gap-8">
          <div>
            <SecondaryContainer title="Module Rights">
              <div className="border border-gray-200 rounded max-h-80 overflow-y-auto right-scrollbar">
                <table className="w-full text-left">
                  <thead className="thead sticky top-0">
                    <tr>
                      <th className="th-thead">Module</th>
                      <th className="th-thead">Name</th>
                      <th className="th-thead">Domain</th>
                      <th className="th-thead w-16 text-center">Add</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeView === "modules" ? allModules : allApplications)
                      .filter(
                        (item) =>
                          !(
                            activeView === "modules"
                              ? selectedModuleIds
                              : selectedAppIds
                          ).includes(
                            activeView === "modules"
                              ? item.moduleCd
                              : item.appId,
                          ),
                      )
                      .map((item) => {
                        const id =
                          activeView === "modules" ? item.moduleCd : item.appId;
                        return (
                          <tr
                            key={id}
                            className="hover:bg-green-50 transition-colors"
                          >
                            <td className="tbody-td text-xs">
                              {activeView === "modules"
                                ? item.moduleCd
                                : item.appName}
                            </td>
                            <td className="tbody-td text-xs">
                              {activeView === "modules"
                                ? item.name
                                : item.appName}
                            </td>
                            <td className="tbody-td text-xs">
                              {activeView === "modules"
                                ? item.domain
                                : item.appName}
                            </td>
                            <td className="tbody-td text-center">
                              <button
                                onClick={() =>
                                  toggleId(
                                    id,
                                    activeView === "modules"
                                      ? setSelectedModuleIds
                                      : setSelectedAppIds,
                                  )
                                }
                                className="text-green-400 font-semibold text-xs hover:scale-125 transition-transform"
                              >
                                {"->"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </SecondaryContainer>
          </div>

          {/* Selected/Assigned Table */}
          <div>
            <SecondaryContainer title="Module Rights">
              <Toolbar
                actions={{
                  // Saves the specifically mapped users
                  onSave: saveMappings,
                }}
                buttonsDisable={["add", "copy", "paste", "delete", "tableform"]}
              />
              <div className="border border-gray-200 rounded max-h-80 overflow-y-auto right-scrollbar bg-blue-50/10">
                <table className="w-full text-left">
                  <thead className="thead sticky top-0">
                    <tr>
                      <th className="th-thead">Module</th>
                      <th className="th-thead">Name</th>
                      {/* New Column Header */}
                      <th className="th-thead w-32">Rights</th>
                      <th className="th-thead w-32">Company</th>
                      <th className="th-thead w-32">Domain</th>
                      <th className="th-thead w-16 text-center">Revoke</th>
                    </tr>
                  </thead>
                  {/* Selected/Assigned Table */}
                  <tbody>
                    {(activeView === "modules" ? allModules : allApplications)
                      .filter((item) => {
                        if (activeView === "modules") {
                          // Match master 'moduleCd' against state 'selectedModuleIds' (which now contains moduleId strings)
                          return selectedModuleIds.includes(item.moduleCd);
                        }
                        // Match master 'appId' (or screenCode) against state 'selectedAppIds'
                        return selectedAppIds.includes(
                          item.appId || item.screenCode,
                        );
                      })
                      .map((item) => {
                        const id =
                          activeView === "modules"
                            ? item.moduleCd
                            : item.appId || item.screenCode;

                        // We find the specific rights info from the selectedGroupRow to show in the row
                        const rightsInfo =
                          activeView === "modules"
                            ? selectedGroupRow?.moduleRights?.find(
                                (r) => r.moduleId === item.moduleCd,
                              )
                            : selectedGroupRow?.screenPermissions?.find(
                                (p) => p.screenCode === item.appId,
                              );

                        return (
                          <tr
                            key={id}
                            className="hover:bg-red-50 border-b border-gray-100"
                          >
                            <td className="tbody-td text-xs font-semibold text-[#17414d]">
                              {activeView === "modules"
                                ? item.moduleCd
                                : item.appName}
                            </td>
                            <td className="tbody-td text-xs font-semibold text-[#17414d]">
                              {activeView === "modules"
                                ? item.name
                                : item.appName}
                            </td>
                            <td className="tbody-td">
                              <select
                                className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white outline-none"
                                defaultValue={
                                  rightsInfo?.sRightsStatusCd || "F"
                                }
                              >
                                <option value="F">Full Access</option>
                                <option value="V">View Only</option>
                                <option value="D">Deny</option>
                              </select>
                            </td>
                            <td className="tbody-td text-xs">
                              {rightsInfo?.companyId || "1"}
                            </td>
                            <td className="tbody-td text-xs">
                              {item.domain || "N/A"}
                            </td>
                            <td className="tbody-td text-center">
                              <button
                                onClick={() =>
                                  toggleId(
                                    id,
                                    activeView === "modules"
                                      ? setSelectedModuleIds
                                      : setSelectedAppIds,
                                  )
                                }
                                className="text-red-500 font-bold text-lg hover:scale-125"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </SecondaryContainer>
          </div>
        </div>
      )}

      {/* 2. MODULE/APPLICATION RIGHTS (DUAL TABLE) */}
      {activeView === "apps" && (
        <div className="grid grid-cols-2 gap-8">
          {/* --- AVAILABLE SOURCE TABLE --- */}
          <div>
            <SecondaryContainer title="Application List">
              <div className="border border-gray-200 rounded max-h-80 overflow-y-auto right-scrollbar bg-white">
                <table className="w-full text-left border-collapse">
                  <thead className="thead sticky top-0 bg-gray-100 shadow-sm">
                    <tr>
                      <th className="th-thead">Application</th>
                      <th className="th-thead">Name</th>
                      <th className="th-thead">Domain</th>
                      <th className="th-thead">Module</th>
                      <th className="th-thead">Mod Name</th>
                      <th className="th-thead">Area</th>
                      <th className="th-thead w-10 text-center">Add</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allApplications
                      .filter((item) => !selectedAppIds.includes(item.appId))
                      .map((item) => (
                        <tr
                          key={item.appId}
                          className="hover:bg-green-50 transition-colors border-b border-gray-50"
                        >
                          {/* Show appId if application/appName is missing */}
                          <td className="tbody-td text-[10px] font-medium">
                            {item.appId}
                          </td>
                          <td className="tbody-td text-[10px]">
                            {item.appName || item.name || "N/A"}
                          </td>
                          <td className="tbody-td text-[10px]">
                            {item.domain || "N/A"}
                          </td>
                          <td className="tbody-td text-[10px]">
                            {item.moduleCd || "N/A"}
                          </td>
                          <td className="tbody-td text-[10px]">
                            {item.moduleName || "N/A"}
                          </td>
                          <td className="tbody-td text-[10px]">
                            {item.area || "N/A"}
                          </td>
                          <td className="tbody-td text-center">
                            <button
                              onClick={() =>
                                toggleId(item.appId, setSelectedAppIds)
                              }
                              className="text-green-500 hover:scale-125 transition-transform"
                            >
                              →
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </SecondaryContainer>
          </div>

          {/* --- ASSIGNED TABLE --- */}
          <div>
            <SecondaryContainer title="Application Rights">
              <Toolbar
                actions={{
                  // Saves the specifically mapped users
                  onSave: saveMappings,
                }}
                buttonsDisable={["add", "copy", "paste", "delete", "tableform"]}
              />
              <div className="border border-gray-200 rounded max-h-80 overflow-y-auto right-scrollbar bg-blue-50/5">
                <table className="w-full text-left border-collapse">
                  <thead className="thead sticky top-0 bg-gray-50 shadow-sm">
                    <tr>
                      <th className="th-thead">Application</th>
                      <th className="th-thead">Name</th>
                      <th className="th-thead w-24">Rights</th>
                      <th className="th-thead w-32">Company</th>
                      <th className="th-thead w-10 text-center">Revoke</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allApplications
                      .filter((item) => selectedAppIds.includes(item.appId))
                      .map((item) => (
                        <tr
                          key={item.appId}
                          className="hover:bg-red-50 border-b border-gray-100"
                        >
                          <td className="tbody-td text-[10px] font-bold text-[#17414d]">
                            {item.appId}
                          </td>
                          <td className="tbody-td text-[10px] font-medium text-[#17414d]">
                            {item.appName || item.name || "N/A"}
                          </td>
                          {/* Rights Dropdown */}
                          <td className="tbody-td">
                            <select
                              className="rights-select w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white outline-none"
                              defaultValue={
                                selectedGroupRow?.screenPermissions?.find(
                                  (p) => p.screenCode === item.appId,
                                )?.canEdit
                                  ? "F"
                                  : selectedGroupRow?.screenPermissions?.find(
                                        (p) => p.screenCode === item.appId,
                                      )?.canView
                                    ? "V"
                                    : "D"
                              }
                            >
                              <option value="V">Read Only</option>
                              <option value="F">Full Access</option>
                              <option value="D">Deny</option>
                            </select>
                          </td>
                          {/* Company Dropdown */}
                          <td className="tbody-td">
                            <select className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white outline-none">
                              {allCompanies?.map((comp) => (
                                <option
                                  key={comp.companyId}
                                  value={comp.companyId}
                                >
                                  {comp.companyId}-{comp.companyName}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="tbody-td text-center">
                            <button
                              onClick={() =>
                                toggleId(item.appId, setSelectedAppIds)
                              }
                              className="text-red-500 font-bold text-lg hover:scale-125 transition-transform"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </SecondaryContainer>
          </div>
        </div>
      )}
    </div>
    //   </div>
    // )}
    // </div>
  );
};

export default ManageUserGroups;
