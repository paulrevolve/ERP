import React, { useEffect, useState } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import api from "../utils/api";
import { IoSaveOutline } from "react-icons/io5";
import {
  BriefcaseBusiness,
  CircleArrowLeft,
  CircleArrowRight,
  ClipboardPaste,
  Copy,
  Edit3,
  FileText,
  LayoutGrid,
  Plus,
  ReplaceAll,
  Save,
  Search,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import {
  FormSearchSelect,
  FormInput,
  FormSection,
  ActionDetailButton,
} from "../helper/formSection";
import ReusableTable from "../helper/tableSection";

const ManageOrganizationSecurityGroups = ({ canEdit }) => {
  // --- Data States ---
  const [groups, setGroups] = useState([]);
  // const [allUsers, setAllUsers] = useState([]);
  // const [allModules, setAllModules] = useState([]);
  //   const [allApplications, setAllApplications] = useState([]);

  // --- Selection & UI States ---
  const [selectedGroupRow, setSelectedGroupRow] = useState(
    groups ? groups[0] : null,
  );
  const [activeView, setActiveView] = useState("Group"); // 'users' | 'modules' | 'apps'
  const [loading, setLoading] = useState(false);
  const [searchTermGroups, setSearchTermGroups] = useState("");
  // Add this with your other states
  const [isMappingDirty, setIsMappingDirty] = useState(false);

  // --- Mapping States ---
  const [allProfiles, setAllProfiles] = useState([]);

  const [moduleProMapping, setModuleProMapping] = useState([]);

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [isFormView, setIsFormView] = useState(true);

  const [clipboard, setClipboard] = useState([]);
  const [searchTermProfiles, setSearchTermProfiles] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Find & Replace States
  const [searchColumn, setSearchColumn] = useState("orgGroupCode");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  // Add to your existing state definitions
  const [filteredGroups, setFilteredGroups] = useState([]);

  // Change this line:
  // const [selectedGroupRow, setSelectedGroupRow] = useState(groups ? groups[0] : null);

  // To these two:
  const [selectedGroupRows, setSelectedGroupRows] = useState([]); // Array of all checked rows
  const [activeGroupRow, setActiveGroupRow] = useState(null); // The "Latest" selected row
  const profilesWithNone = [
    { orgSecProfCd: "NONE", name: "None" },
    ...allProfiles,
  ];

  useEffect(() => {
    if (activeGroupRow?.orgGroupCode && !activeGroupRow.tempId) {
      handleAssignProfile(activeGroupRow.orgGroupCode);
    } else {
      setModuleProMapping([]);
    }
  }, [activeGroupRow]);

  // Update the initial fetch to sync the filtered list
  useEffect(() => {
    setFilteredGroups(groups);
  }, [groups]);

  // Column Definitions (Add 'type' to handle number/text inputs)
  const columns = [
    {
      label: "Group Code",
      value: "orgGroupCode",
      type: "text",
      allowReplace: false,
    },
    {
      label: "Group Name",
      value: "orgGroupName",
      type: "text",
      allowReplace: true,
    },
  ];

  const myColumns = [
    {
      label: "Group Code",
      key: "orgGroupCode",
      required: true,
      readOnlyIfExisting: true,
      placeholder: "Code...",
    },
    {
      label: "Group Name",
      key: "orgGroupName",
      required: true,
      placeholder: "Name...",
    },
    {
      label: "Assigned Profile",
      key: "orgSecProfCd",
      type: "search-select",
      options: allProfiles,
      displayKey: "orgSecProfCd",
      secondaryKey: "name",
      onSelect: (selectedOpt, id) => {
        // id here is the row's unique identifier passed by the ReusableTable
        handleFieldChange(id, "orgSecProfCd", selectedOpt.orgSecProfCd);
        handleFieldChange(id, "profileName", selectedOpt.name);
      },
    },
    {
      label: "Profile Name",
      key: "profileName",
      type: "readOnly-text",
    },
  ];

  const mappingColumns = [
    { label: "Module", key: "moduleCd", readOnly: true },
    { label: "Description", key: "moduleName", readOnly: true },
    {
      label: "Assign profile",
      key: "orgSecProfCd",
      displayKey: "orgSecProfCd",
      type: "search-select",
      // Use the new list with "None"
      options: profilesWithNone,
      secondaryKey: "name",
      onSelect: (selectedOpt, id) => {
        handleMappingChange(id, "orgSecProfCd", selectedOpt.orgSecProfCd);
        handleMappingChange(id, "profileName", selectedOpt.name || "---");
      },
    },
    {
      label: "Profile Name",
      key: "profileName",
      type: "readOnly-text",
    },
  ];

  const initialFormState = {
    orgGroupCode: "",
    orgGroupName: "",
    orgSecProfCd: "",
    profileName: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // 1. Create a ref to track if we have already handled the first load
  const isInitialized = React.useRef(false);

  // Change from [selectedGroupRow] to [activeGroupRow]
  useEffect(() => {
    const handleModuleProfile = async () => {
      // Check activeGroupRow instead of selectedGroupRow
      if (!activeGroupRow?.orgGroupCode || activeGroupRow?.tempId) {
        setModuleProMapping([]); // Clear if it's a new row or nothing selected
        return;
      }

      try {
        const res = await api.get(
          `${backendUrl}/api/OrgSecGrpSetup/by-group/${activeGroupRow.orgGroupCode}`,
        );
        if (res.data) {
          setModuleProMapping(res.data);
        }
      } catch (error) {
        setModuleProMapping([]);
        console.error("Error fetching mappings:", error);
      }
    };
    handleModuleProfile();
  }, [activeGroupRow]); // Crucial: Watch activeGroupRow

  // Change your useEffect to this EXACT version:
  useEffect(() => {
    // This only runs ONCE when the component first mounts
    if (!isInitialized.current) {
      isInitialized.current = true;

      const newId = `temp-${Date.now()}`;
      const newRow = {
        tempId: newId,
        ...initialFormState,
        companyId: "1",
        isDirty: false, // Set to false so it doesn't try to save an empty row
      };

      setGroups([newRow]);
      setSelectedGroupRow(newRow);
      setActiveGroupRow(newRow);
      setSelectedGroupRows([newRow]);
      setFormData(initialFormState);
      setIsFormView(true); // Ensure we start in the form as you requested
    }
  }, []); // Empty array is critical: it prevents re-running after saves

  const handleFind = () => {
    if (!searchValue) {
      setFilteredGroups(groups); // Reset filter if empty
      return;
    }

    const results = groups.filter((g) =>
      String(g[searchColumn] || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase()),
    );

    if (results.length > 0) {
      setFilteredGroups(results);
      // Automatically select the first match found
      setSelectedGroupRow(results[0]);
      setActiveGroupRow(results[0]); // Sync activeGroupRow

      // If it's an existing group, load its mappings
      if (results[0].orgGroupCode && !results[0].tempId) {
        handleAssignProfile(results[0].orgGroupCode);
      }
      toast.success(`Found ${results.length} matches`);
    } else {
      toast.error("No matching records found");
      setFilteredGroups(groups); // Reset to show all if nothing found
    }
  };

  const handleBulkReplace = () => {
    if (!searchValue) return toast.warn("Enter value to find");

    const updatedGroups = groups.map((group) => {
      const currentValue = String(group[searchColumn] || "").toLowerCase();
      const targetValue = searchValue.toLowerCase();

      if (currentValue === targetValue) {
        let extraFields = {};
        if (searchColumn === "orgSecProfCd") {
          const profile = allProfiles.find(
            (p) => p.orgSecProfCd === replaceValue,
          );
          extraFields.profileName = profile ? profile.name : "";
        }
        return {
          ...group,
          [searchColumn]: replaceValue,
          ...extraFields,
          isDirty: true,
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    // Keep the table filtered to show the rows that were just replaced
    setFilteredGroups(
      updatedGroups.filter(
        (g) =>
          String(g[searchColumn]).toLowerCase() === replaceValue.toLowerCase(),
      ),
    );

    toast.success("Replacements applied to filtered results.");
    setIsReplaceMode(false);
  };
  const handleAssignProfile = async (groupCode) => {
    if (!groupCode) return;
    if (!selectedGroupRow) {
      setModuleProMapping([]);
    }

    if (!selectedGroupRow.orgGroupCode) {
      toast.warn("Enter the group code first!");
      return;
    }

    setLoading(true);
    try {
      // Calling your C# API: [HttpGet("by-group/{grpCd}")]
      const res = await api.get(
        `${backendUrl}/api/OrgSecGrpSetup/by-group/${groupCode}`,
      );

      if (res.data) {
        // This populates the second table (Module & Profile Assignments)
        setModuleProMapping(res.data);
        // Ensure the detail view is visible
        setActiveView("Group");
      }
    } catch (error) {
      console.error("Error fetching group mappings:", error);
      toast.error("Could not load assignments for this group.");
      setModuleProMapping([]); // Clear table on error
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = (moduleCd, field, value) => {
    setIsMappingDirty(true);
    setModuleProMapping((prev) =>
      prev.map((row) => {
        if (row.moduleCd === moduleCd) {
          const updatedRow = { ...row, [field]: value };

          if (field === "orgSecProfCd") {
            // Check for "NONE" first
            if (value === "NONE") {
              updatedRow.profileName = "No Profile Assigned";
            } else {
              const profile = allProfiles.find((p) => p.orgSecProfCd === value);
              updatedRow.profileName = profile ? profile.name : "";
            }
          }
          return updatedRow;
        }
        return row;
      }),
    );
  };

  const handleAddGroup = () => {
    const newGroup = {
      tempId: `new-${Date.now()}`, // Guaranteed unique ID
      orgGroupCode: "",
      orgGroupName: "",
      isDirty: true,
    };
    setGroups([newGroup, ...groups]);
    setActiveGroupRow(newGroup);
    setSelectedGroupRows([newGroup]);
  };

  // const handleRowSelection = (group) => {
  //   const groupId = group.tempId || group.orgGroupId;
  //   const currentId = selectedGroupRow?.tempId || selectedGroupRow?.orgGroupId;

  //   // 1. ALWAYS clear profile data from ALL rows first
  //   // This ensures no matter which row you click, the others become "Select Profile..."
  //   setGroups((prev) =>
  //     prev.map((g) => ({
  //       ...g,
  //       orgSecProfCd: "",
  //       profileName: "",
  //     })),
  //   );

  //   // 2. TOGGLE OFF: If clicking the same row again, just stop here
  //   if (currentId === groupId) {
  //     setSelectedGroupRow(null);
  //     setModuleProMapping([]);
  //     return;
  //   }

  //   // 3. NEW SELECTION: Reset mapping table and set the new row
  //   setModuleProMapping([]);
  //   setSelectedGroupRow(group);

  //   // 4. Fetch data if it's an existing row
  //   if (group.orgGroupCode && !group.tempId) {
  //     handleAssignProfile(group.orgGroupCode);
  //   }
  // };

  const handleRowSelection = (row) => {
    const rowId = row.tempId || row.orgGroupId || row.orgGroupCode;

    setSelectedGroupRows((prev) => {
      const isAlreadySelected = prev.some(
        (item) =>
          (item.tempId || item.orgGroupId || item.orgGroupCode) === rowId,
      );

      if (isAlreadySelected) {
        return prev.filter(
          (item) =>
            (item.tempId || item.orgGroupId || item.orgGroupCode) !== rowId,
        );
      } else {
        return [...prev, row];
      }
    });

    setActiveGroupRow(row);
    setSelectedGroupRow(row); // Sync selectedGroupRow with activeGroupRow
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleModuleProfile = async () => {
      if (!selectedGroupRow.orgGroupCode) {
        return;
      }
      if (selectedGroupRow.tempId) {
        return;
      }
      try {
        // Using the selectedGroupRow from your first table selection
        const res = await api.get(
          `${backendUrl}/api/OrgSecGrpSetup/by-group/${selectedGroupRow.orgGroupCode}`,
        );

        // axios uses .data; if using fetch, use res.ok
        if (res.data) {
          // Set the mapping state used by the table
          setModuleProMapping(res.data);
        }
      } catch (error) {
        setModuleProMapping([]);
        console.error("Error fetching mappings:", error);
      }
    };
    handleModuleProfile();
  }, [selectedGroupRow]);

  // Add 'isRefresh' parameter
  const fetchInitialData = async (isRefresh = false) => {
    try {
      const [groupsRes, profilesRes] = await Promise.all([
        api.get(`${backendUrl}/api/OrgGroups/GetAllOrgGroups`),
        api.get(`${backendUrl}/api/OrgSecGrpSetup/profiles-dropdown`),
      ]);

      const serverGroups = groupsRes.data || [];
      setAllProfiles(profilesRes.data || []);

      setGroups((prev) => {
        // If we are refreshing after a save, we ONLY want server data.
        // We do NOT want to keep the old tempId rows.
        if (isRefresh) {
          return serverGroups;
        }

        // On first load, keep the auto-generated row from the useEffect
        const tempRows = prev.filter((g) => !!g.tempId);
        return [...tempRows, ...serverGroups];
      });
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };

  const handleMasterSave = async () => {
    setLoading(true);
    try {
      // 1. Identify the group code from the active record being viewed/edited
      // This ensures the mapping assignments are linked to the correct group
      let currentGroupCode = activeGroupRow?.orgGroupCode;

      // --- PART 1: Save Group Changes (Top Table) ---
      // Filters for rows that are either new (tempId) or modified (isDirty)
      const changedGroups = groups.filter((g) => {
        const hasContent =
          g.orgGroupCode?.trim() !== "" && g.orgGroupName?.trim() !== "";
        return (g.isDirty || !!g.tempId) && hasContent;
      });

      // Check if there is anything to save at all
      if (changedGroups.length === 0 && moduleProMapping.length === 0) {
        toast.warn("No valid changes to save.");
        setLoading(false);
        return;
      }

      if (changedGroups.length > 0) {
        const savePromises = changedGroups.map((group) => {
          const payload = {
            orgGroupCode: group.orgGroupCode,
            orgGroupName: group.orgGroupName,
            companyId: group.companyId || "1",
          };

          // POST for new records, PUT for existing ones
          if (group.tempId) {
            return api.post(`${backendUrl}/api/OrgGroups/OrgGroups`, payload);
          } else {
            return api.put(
              `${backendUrl}/api/OrgGroups/OrgGroups/${group.orgGroupId}`,
              payload,
            );
          }
        });

        await Promise.all(savePromises);
        toast.success("Groups updated successfully.");
      }

      // --- PART 2: Save Assignment Changes (Bottom Table) ---
      // Only proceed if there is an active group and mapping data available
      if (activeView && moduleProMapping.length > 0 && currentGroupCode) {
        const mappingPayload = moduleProMapping
          .filter(
            (row) => row.orgSecProfCd !== "NONE" && row.orgSecProfCd !== "",
          ) // Filter out "None"
          .map((row) => ({
            orgSecGrpCd: currentGroupCode, // Link to the active group code
            moduleCd: row.moduleCd,
            companyId: row.companyId || "1",
            orgSecProfCd: row.orgSecProfCd,
            moduleName: row.moduleName,
            profileName: row.profileName,
          }));

        // Only sync if there are valid assignments (non-"NONE") to send
        // if (mappingPayload.length >= 0) {
        const res = await api.post(
          `${backendUrl}/api/OrgSecGrpSetup/bulk-sync`,
          mappingPayload,
        );
        setIsMappingDirty(false);
        toast.success(
          `Assignments synced! Total active: ${res.data.total || mappingPayload.length}`,
        );
        // }
      }

      // --- PART 3: Refresh Data ---
      // fetchInitialData(true) clears local temp states and fetches fresh DB data
      await fetchInitialData(true);
    } catch (error) {
      console.error("Master Save Error:", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred while saving.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignProfileClick = async () => {
    // Use the activeGroupRow which is now synced by handleFieldChange
    const currentGroupCode = activeGroupRow?.orgGroupCode;

    if (!currentGroupCode || currentGroupCode.trim() === "") {
      toast.warn("Please enter a Group Code first!");
      return;
    }

    setLoading(true);
    try {
      const selectedProfileCD = activeGroupRow?.orgSecProfCd || "";
      const selectedProfileName = activeGroupRow?.profileName || "";

      // Fetches the module template based on the profile you just selected in the table
      const res = await api.get(
        `${backendUrl}/api/OrgSecGrpSetup/GetAllModules?profileCD=${selectedProfileCD}&profileName=${selectedProfileName}`,
      );

      if (res.data) {
        setModuleProMapping(res.data);
        setActiveView("Group");
        setIsMappingDirty(true); // Enable the Save button
        toast.success("Modules loaded.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load modules.");
    } finally {
      setLoading(false);
    }
  };

  // const handleAssignProfileClick = async () => {
  //   // 1. Determine the Group Code based on the active view
  //   // If in Form view, use formData. If in Table view, use selectedGroupRow
  //   const currentGroupCode = activeGroupRow?.orgGroupCode;

  //   // 2. Safe validation check
  //   if (!currentGroupCode) {
  //     toast.warn("Enter the group code first!");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // 3. Determine Profile details safely
  //     const selectedProfileCD = activeGroupRow?.orgSecProfCd;
  //     const selectedProfileName = activeGroupRow?.profileName;

  //     const res = await api.get(
  //       `${backendUrl}/api/OrgSecGrpSetup/GetAllModules?profileCD=${selectedProfileCD || ""}&profileName=${selectedProfileName || ""}`,
  //     );

  //     if (res.data) {
  //       setModuleProMapping(res.data);
  //       setActiveView("Group");
  //       toast.success("Modules loaded for selected profile.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching module template:", error);
  //     toast.error("Failed to load modules for this profile.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleDelete = async () => {
    // 1. Check if any rows are selected using the array state
    if (selectedGroupRows.length === 0) {
      return toast.warn("Please select records to delete.");
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedGroupRows.length} selected record(s)?`,
    );

    if (confirmDelete) {
      setLoading(true);
      try {
        // 2. Separate existing records (with IDs) from temporary rows
        const existingIds = selectedGroupRows
          .filter((row) => row.orgGroupId)
          .map((row) => row.orgGroupId);

        const tempIds = selectedGroupRows
          .filter((row) => row.tempId)
          .map((row) => row.tempId);

        // 3. Delete existing records from the database
        if (existingIds.length > 0) {
          // Option A: If your API supports bulk delete, use one call here.
          // Option B: Sequential deletes (standard for many REST APIs)
          await Promise.all(
            existingIds.map((id) =>
              api.delete(`${backendUrl}/api/OrgGroups/OrgGroups/${id}`),
            ),
          );
        }

        // 4. Update local state to remove all selected rows (both temp and existing)
        setGroups((prev) =>
          prev.filter((g) => {
            const isTempToDelete = g.tempId && tempIds.includes(g.tempId);
            const isExistingToDelete =
              g.orgGroupId && existingIds.includes(g.orgGroupId);
            return !isTempToDelete && !isExistingToDelete;
          }),
        );

        // 5. Clear all selection states
        setSelectedGroupRows([]);
        setActiveGroupRow(null);
        toast.success(
          `${selectedGroupRows.length} record(s) deleted successfully`,
        );
      } catch (error) {
        console.error("Delete Error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to delete the records.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  // const handleFieldChange = (id, field, value) => {
  //   let finalValue = value;

  //   if (field === "orgGroupCode") {
  //     // ONLY show toast if a space is actually detected
  //     if (/\s/.test(value)) {
  //       toast.warn("No spacing allowed while entering the Org Group Code");
  //       // Remove the spaces
  //       finalValue = value.replace(/\s+/g, "");
  //     }
  //   }

  //   setGroups((prev) =>
  //     prev.map((g) => {
  //       if ((g.tempId || g.orgGroupId) === id) {
  //         // Mark as dirty so "Discard" and "Save" buttons activate
  //         const updatedRow = { ...g, [field]: finalValue, isDirty: true };

  //         // Keep the selected row state in sync with the table/form
  //         if (
  //           selectedGroupRow &&
  //           (selectedGroupRow.tempId || selectedGroupRow.orgGroupId) === id
  //         ) {
  //           setSelectedGroupRow(updatedRow);
  //         }
  //         return updatedRow;
  //       }
  //       return g;
  //     }),
  //   );
  // };

  const handleFieldChange = (id, field, value) => {
    let finalValue = value;

    // Spacing validation
    if (field === "orgGroupCode" && /\s/.test(value)) {
      toast.warn("No spacing allowed for Group Code");
      finalValue = value.replace(/\s+/g, "");
    }

    console.log(id, field, value);

    setGroups((prev) =>
      prev.map((g) => {
        // Logic to find the row: Check all possible unique identifiers
        const isTargetRow =
          g.tempId === id ||
          g.orgGroupId === id ||
          (g.orgGroupCode === id && id !== ""); // Don't match on empty strings

        if (isTargetRow) {
          const updatedRow = { ...g, [field]: finalValue, isDirty: true };

          // SYNC ACTIVE ROW (For the Form & Assign Profile Button)
          if (
            activeGroupRow &&
            (activeGroupRow.tempId === g.tempId ||
              activeGroupRow.orgGroupId === g.orgGroupId)
          ) {
            setActiveGroupRow(updatedRow);
          }

          // SYNC SELECTED ROWS (For the Table Checkboxes)
          setSelectedGroupRows((prevSelected) =>
            prevSelected.map((sel) =>
              sel.tempId === g.tempId || sel.orgGroupId === g.orgGroupId
                ? updatedRow
                : sel,
            ),
          );

          console.log(updatedRow);

          return updatedRow;
        }
        return g;
      }),
    );
  };
  const handleCopy = () => {
    if (selectedGroupRows.length === 0)
      return toast.warn("Select records to copy");

    const header = ["Group Code", "Group Name"].join("\t");
    const dataRows = selectedGroupRows
      .map((row) => `${row.orgGroupCode || ""}\t${row.orgGroupName || ""}`)
      .join("\n");

    navigator.clipboard.writeText(`${header}\n${dataRows}`);
    setClipboard(selectedGroupRows);
    toast.success(`${selectedGroupRows.length} records copied`);
  };
  const handlePaste = () => {
    if (clipboard.length === 0) {
      return toast.warn("Clipboard is empty. Copy a record first.");
    }

    const pastedRows = clipboard.map((row, index) => {
      // Unique ID for React keys and selection logic
      const newTempId = `NEW_${Date.now()}_${index}`;

      return {
        ...row,
        orgGroupId: null, // Critical: Clear the DB ID
        tempId: newTempId,

        // Use your table's specific field names
        orgGroupCode: "",
        orgGroupName: row.orgGroupName ? `${row.orgGroupName}` : "",

        // Flag for the Master Save function
        isNew: true,
        isDirty: true,
      };
    });

    // 1. Add new rows to the top of the groups list
    setGroups((prev) => [...pastedRows, ...prev]);

    // 2. Update the multi-select checkbox state (if you use it for bulk delete/copy)
    const pastedIds = pastedRows.map((r) => r.tempId);
    setSelectedGroups((prev) => [...pastedIds, ...prev]);

    // 3. Focus the first pasted row as the ACTIVE row
    // This ensures the "Configuring: ..." header shows the new _COPY code immediately
    if (pastedRows.length > 0) {
      const firstPasted = pastedRows[0];
      setSelectedGroupRow(firstPasted);
      setActiveGroupRow(firstPasted); // Sync activeGroupRow

      // 4. Trigger profile assignment if data exists
      if (firstPasted.orgSecProfCd) {
        // Note: Since this is a new row, it doesn't have DB mappings yet,
        // but this will show the second table UI for the user to start configuring.
        handleAssignProfile(firstPasted.orgGroupCode);
      }
    }

    toast.success(
      `${pastedRows.length} groups pasted. Please update the Group Codes.`,
    );
  };

  const handleClear = () => {
    // 1. Identify if there are any temporary "NEW" rows using tempId
    const hasNewRows = groups.some((g) => !!g.tempId);

    // 2. Identify if any existing rows have been edited (isDirty)
    const hasEdits = groups.some((g) => g.isDirty === true);

    if (!hasNewRows && !hasEdits) return;

    // 3. Reset Strategy:
    // Remove all temporary 'NEW' rows from the main groups state
    setGroups((prev) => prev.filter((g) => !g.tempId));

    // Re-fetch the original data from the database to overwrite local edits
    fetchInitialData();

    // Clear selections and the active configuration view
    setSelectedGroups([]);
    setSelectedGroupRow(groups[1]);
    setSelectedGroupRows([]); // Clear checkboxes
    setActiveGroupRow(null); // Clear form
    toast.info("Unsaved changes and new rows have been discarded.");
  };

  const handleToggleView = () => {
    if (!isFormView) {
      // 1. If there is no active selection, default to the first row
      if (!activeGroupRow && groups.length > 0) {
        const firstRow = groups[0];
        setActiveGroupRow(firstRow);
        setSelectedGroupRows([firstRow]); // Sync the checkbox in the table

        // Load mapping for the first row if it's a saved record
        if (firstRow.orgGroupCode && !firstRow.tempId) {
          handleAssignProfile(firstRow.orgGroupCode);
        }
      }
      // 2. If something is already selected (activeGroupRow exists),
      // just ensure the checkbox matches before entering Form View
      else if (activeGroupRow) {
        setSelectedGroupRows([activeGroupRow]);
      }
    }

    setIsFormView(!isFormView);
  };
  const isFormDirty = Object.values(formData).some(
    (val) =>
      val !== "" &&
      val !== null &&
      val !== undefined &&
      val !==
        initialFormState[
          Object.keys(formData).find((key) => formData[key] === val)
        ],
  );
  const isTableDirty =
    groups.some((g) => g.isDirty || !!g.tempId) || isMappingDirty;

  // --- Navigation Logic ---

  // Find the index of the currently selected row
  const currentIndex = groups.findIndex(
    (g) =>
      (g.tempId || g.orgGroupId) ===
      (activeGroupRow?.tempId || activeGroupRow?.orgGroupId),
  );

  const handleNavigate = (direction) => {
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < groups.length) {
      const nextRow = groups[newIndex];

      // 1. Set the new active row for the Form
      setActiveGroupRow(nextRow);
      setSelectedGroupRow(nextRow); // Sync selectedGroupRow

      // 2. Sync the checkbox selection
      // This replaces the old selection with only the currently viewed row
      setSelectedGroupRows([nextRow]);

      // 3. Load the mapping table
      if (nextRow.orgGroupCode && !nextRow.tempId) {
        handleAssignProfile(nextRow.orgGroupCode);
      } else {
        setModuleProMapping([]);
      }
    }
  };

  const jumpToCode = (code) => {
    const found = groups.find((g) => g.orgGroupCode === code);
    if (found) {
      setActiveGroupRow(found);
      setSelectedGroupRow(found); // Sync selectedGroupRow
    } else {
      toast.error("Group Code not found");
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer
        icon={BriefcaseBusiness}
        title="Manage Organization Security Groups"
      >
        {/* <div className="bg-white rounded-xl shadow-md shadow-[#17414d]/50 overflow-hidden "> */}

        <Toolbar
          clipboard={clipboard}
          isFormView={isFormView}
          isReplaceMode={isReplaceMode}
          setIsReplaceMode={setIsReplaceMode}
          columns={columns}
          searchColumn={searchColumn}
          setSearchColumn={setSearchColumn}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          replaceValue={replaceValue} // ADD THIS
          setReplaceValue={setReplaceValue} // ADD THIS
          handleFind={handleFind} // ADD THIS
          handleBulkReplace={handleBulkReplace} // ADD THIS
          currentIndex={currentIndex}
          totalRecords={groups.length}
          handleNavigate={handleNavigate}
          selectedRow={activeGroupRow}
          jumpToCode={jumpToCode}
          actions={{
            onAdd: handleAddGroup,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleClear,
            onSave: handleMasterSave,
            onToggleView: handleToggleView,
          }}
          isDirty={isFormDirty || isTableDirty}
          loading={loading}
        />

        {/* form */}
        {isFormView ? (
          <>
            <div className="space-y-1 p-1 py-2">
              {/* Section 1: With Header */}
              <FormSection>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-2">
                  <FormInput
                    label="Group Code"
                    required
                    value={activeGroupRow?.orgGroupCode || ""}
                    readOnly={!!activeGroupRow?.orgGroupId || !activeGroupRow}
                    onChange={(e) =>
                      handleFieldChange(
                        activeGroupRow?.tempId || activeGroupRow?.orgGroupId,
                        "orgGroupCode",
                        e.target.value,
                      )
                    }
                  />

                  <FormInput
                    label="Group Name"
                    required
                    value={activeGroupRow?.orgGroupName}
                    onChange={(e) =>
                      handleFieldChange(
                        activeGroupRow?.tempId || activeGroupRow?.orgGroupId,

                        "orgGroupName",

                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <FormSearchSelect
                    label="Assigned Profile"
                    value={activeGroupRow?.orgSecProfCd}
                    searchTerm={searchTermProfiles}
                    setSearchTerm={setSearchTermProfiles}
                    options={allProfiles.filter((p) =>
                      p.orgSecProfCd
                        .toLowerCase()
                        .includes(searchTermProfiles.toLowerCase()),
                    )}
                    displayKey="orgSecProfCd"
                    secondaryKey="name"
                    onSelect={(p) => {
                      handleFieldChange(
                        activeGroupRow?.tempId || activeGroupRow?.orgGroupId,
                        "orgSecProfCd",
                        p.orgSecProfCd,
                      );
                      handleFieldChange(
                        activeGroupRow?.tempId || activeGroupRow?.orgGroupId,
                        "profileName",
                        p.name,
                      );
                    }}
                  />

                  <FormInput
                    label="Profile Name"
                    disabled={true}
                    value={activeGroupRow?.profileName}
                  />
                </div>
              </FormSection>
            </div>
          </>
        ) : (
          <ReusableTable
            data={(filteredGroups.length > 0 ? filteredGroups : groups).filter(
              (g) =>
                (g.orgGroupCode || "")
                  .toLowerCase()
                  .includes(searchTermGroups.toLowerCase()),
            )}
            rowKey="orgGroupId"
            columns={myColumns}
            selectedRows={selectedGroupRows}
            onRowSelect={handleRowSelection}
            onSelectAll={() => {
              /* Optional: logic if you want to select all groups */
            }}
            onFieldChange={handleFieldChange}
            maxHeight="max-h-64"
          />
        )}
        <ActionDetailButton
          label="Assign Profile"
          disabled={!selectedGroupRow}
          onClick={handleAssignProfileClick}
        />
      </MainContainer>
      {/* table */}
      {/* --- SECTION 2: DYNAMIC BOTTOM INTERFACE --- */}
      {activeView && (
        // <div className="bg-white rounded-xl border-t-6 border-[#17414d] shadow-sm overflow-hidden">
        <SecondaryContainer
          title={`Assign Profiles To Modules${activeGroupRow?.orgGroupCode ? ` (Group Code - ${activeGroupRow.orgGroupCode})` : ""}`}
        >
          <ReusableTable
            data={moduleProMapping}
            rowKey="moduleCd"
            columns={mappingColumns}
            showCheckboxes={false}
            // Since mapping table doesn't usually need checkboxes,
            // you can just pass empty handlers or modify ReusableTable to hide them
            onRowSelect={() => {}}
            onFieldChange={(id, key, value) => {
              setIsMappingDirty(true);
              if (key === "DELETE_ROW") {
                setModuleProMapping((prev) =>
                  prev.filter((r) => r.moduleCd !== id),
                );
              } else {
                // Find the profile name to keep the gray box in sync
                if (key === "orgSecProfCd") {
                  const profile = allProfiles.find(
                    (p) => p.orgSecProfCd === value,
                  );
                  handleMappingChange(id, "profileName", profile?.name || "");
                }
                handleMappingChange(id, key, value);
              }
            }}
            maxHeight="max-h-64"
            renderEmptyState={() => {
              if (!activeGroupRow) {
                return (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-[11px] font-semibold text-gray-400">
                      No Group Selected
                    </p>
                    <p className="text-[10px] text-gray-400/80 italic text-center">
                      Select a row from the list above to configure security
                      mappings.
                    </p>
                  </div>
                );
              }
              if (moduleProMapping.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-[11px] font-bold text-gray-400">
                      No Mappings Found
                    </p>
                    <p className="text-[10px] text-gray-400/80 italic text-center px-4">
                      {activeGroupRow.tempId
                        ? "This is a new entry. Please assign a Security Profile to load modules."
                        : "No modules are currently assigned to this group."}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </SecondaryContainer>
      )}
    </div>
    // </div>
  );
};

export default ManageOrganizationSecurityGroups;
