import React, { useEffect, useState } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import api from "../utils/api";
import { Plus } from "lucide-react";
import Select from "react-select";
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";

const ManageOrganizationSecurityProfiles = ({ canEdit }) => {
  // --- Data States ---
  const [profiles, setProfiles] = useState([]);
  const [allOrgs, setAllOrgs] = useState([]);

  const [activeView, setActiveView] = useState("orgs"); // 'orgs' | 'apps'
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [searchTermGroups, setSearchTermGroups] = useState("");

  // --- Mapping States ---
  const [selectedOrgIds, setSelectedOrgIds] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [clipboard, setClipboard] = useState([]);

  // 1. To track mapping rows selected for deletion
  const [selectedMappingRows, setSelectedMappingRows] = useState([]);

  // 2. To store the initial data (for the Reset/Clear functionality)
  const [originalMappings, setOriginalMappings] = useState([]);
  const [selectedProfileRow, setSelectedProfileRow] = useState(null);

  const [columns] = useState([
    "orgSecProfCd",
    "name",
    "profile_Org_Flag",
    "rightsAppCOde_Flag",
  ]);

  const COLUMN_LABELS = {
    orgSecProfCd: "Profile ID",
    name: "Profile Name",
    profile_Org_Flag: "Org Sec",
    rightsAppCOde_Flag: "Right Method",
  };

  // Auto-fetch mappings when the selected profile OR the active view changes
  useEffect(() => {
    if (selectedProfileRow) {
      // FIX: If it's a new row, don't try to fetch mappings from the database
      // because it doesn't exist yet!
      if (selectedProfileRow.isNew) {
        setSelectedOrgIds([]); // Just start with an empty mapping list for new profiles
        return;
      }

      // Only fetch for existing profiles that have a valid ID
      if (selectedProfileRow.orgSecProfCd) {
        fetchMappings(selectedProfileRow.orgSecProfCd);
      }
    } else {
      setSelectedOrgIds([]);
    }
  }, [selectedProfileRow, activeView]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const [profileRes, orgRes] = await Promise.all([
        api.get(`${backendUrl}/api/OrgSecProfile`),
        api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
      ]);
      setProfiles(profileRes.data || []);
      setAllOrgs(orgRes.data || []);
    } catch (e) {
      toast.error("Failed to load initial security data.");
    } finally {
      setInitialLoading(false);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "24px",
      height: "24px",
      fontSize: "12px",
      backgroundColor: state.isDisabled ? "#f1f5f9" : "#ffffff",
      color: state.isDisabled ? "#94a3b8" : "#000000",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      boxShadow: "none",
      borderColor: "#ccc",
      "&:hover": {
        borderColor: "#ccc",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontSize: "12px",
      color: state.isDisabled ? "#94a3b8" : "black",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 6px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "24px",
    }),
    option: (provided) => ({
      ...provided,
      fontSize: "12px",
      padding: "4px 8px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const saveMappings = async () => {
    if (!selectedProfileRow) return toast.warn("Select a profile first");

    try {
      setLoading(true);

      const savePromises = selectedOrgIds.map((item) => {
        const orgDetails = allOrgs.find((o) => o.orgId === item.id) || {};

        const payload = {
          orgSecProfCd: selectedProfileRow.orgSecProfCd,
          companyId: selectedProfileRow.companyId || "1",
          orgId: item.id,
          orgName: orgDetails.orgName || item.orgName || "",
          orgWildcardFl: item.relation || "",
          sorgRightsCd: item.rights || "N",
          profileName: selectedProfileRow.name || "",
          companyName: selectedProfileRow.companyName || "",
        };

        if (item.isExisting) {
          return api.put(
            `${backendUrl}/api/OrgSecProfileOrgSetup/${payload.orgSecProfCd}/${payload.orgId}/${payload.companyId}`,
            payload,
          );
        } else {
          return api.post(`${backendUrl}/api/OrgSecProfileOrgSetup`, payload);
        }
      });

      await Promise.all(savePromises);
      toast.success("All mappings processed successfully!");

      fetchMappings(selectedProfileRow.orgSecProfCd);
    } catch (e) {
      console.error("Save Error:", e);
      const serverMessage = e.response?.data?.message || e.response?.data;
      toast.error(
        typeof serverMessage === "string"
          ? serverMessage
          : "Error saving mappings",
      );
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
      selectedProfiles.length > 0 &&
      selectedProfiles[selectedProfiles.length - 1].orgSecProfCd === groupId
    );
  };

  const toggleGroupSelection = (group) => {
    setSelectedProfiles((prev) => {
      const isExisting = prev.find(
        (g) => g.orgSecProfCd === group.orgSecProfCd,
      );

      if (isExisting) {
        return prev.filter((g) => g.orgSecProfCd !== group.orgSecProfCd);
      } else {
        return [...prev, group];
      }
    });

    setSelectedProfileRow(group);
  };

  const handleDelete = async () => {
    const profilesToDelete =
      selectedProfiles.length > 0
        ? selectedProfiles
        : selectedProfileRow
          ? [selectedProfileRow]
          : [];

    if (profilesToDelete.length === 0) {
      return toast.warn("Please select at least one profile to delete.");
    }

    const confirmMessage =
      profilesToDelete.length === 1
        ? `Are you sure you want to remove the profile: ${profilesToDelete[0].name || "this new profile"}?`
        : `Are you sure you want to remove ${profilesToDelete.length} selected profiles?`;

    if (window.confirm(confirmMessage)) {
      setLoading(true);
      try {
        const existingProfiles = profilesToDelete.filter((p) => !p.isNew);

        if (existingProfiles.length > 0) {
          const deletePromises = existingProfiles.map((p) =>
            api.delete(
              `${backendUrl}/api/OrgSecProfile/${p.orgSecProfCd}/${p.companyId || "1"}`,
            ),
          );
          await Promise.all(deletePromises);
        }

        setProfiles((prev) =>
          prev.filter((g) => {
            return !profilesToDelete.some((p) =>
              p.isNew ? p === g : p.orgSecProfCd === g.orgSecProfCd,
            );
          }),
        );

        setSelectedProfiles([]);
        setSelectedProfileRow(null);
        setSelectedOrgIds([]);

        toast.success(`${profilesToDelete.length} profile(s) removed.`);
      } catch (error) {
        console.error("Delete Error:", error);
        toast.error("Failed to delete some profiles from the server.");
      } finally {
        await fetchInitialData();
        setSelectedProfiles([]);
        setSelectedProfileRow(null);
        setLoading(false);
      }
    }
  };

  const handleCopy = () => {
    if (selectedProfiles.length === 0) {
      return toast.warn("No profiles selected to copy.");
    }

    const itemsToCopy = selectedProfiles.map(({ isDirty, isNew, ...rest }) => ({
      ...rest,
    }));

    setClipboard(itemsToCopy);
    toast.success(`${selectedProfiles.length} profiles copied to clipboard.`);
  };

  const handlePaste = () => {
    if (clipboard.length === 0) {
      return toast.warn("Clipboard is empty. Copy a profile first.");
    }

    const pastedRows = clipboard.map((row) => ({
      ...row,
      orgSecProfCd: `NEW_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: `${row.name}_COPY`,
      isNew: true,
      isDirty: true,
    }));

    setProfiles((prev) => [...pastedRows, ...prev]);
    setSelectedProfiles(pastedRows);
    toast.success(`${pastedRows.length} profiles pasted as new entries.`);
  };

  const handleSave = async () => {
    if (profiles.length === 0) return;

    setLoading(true);
    try {
      const newProfiles = profiles.filter((p) => p.isNew === true);
      const updatedProfiles = profiles.filter((p) => !p.isNew && p.isDirty);

      if (newProfiles.length === 0 && updatedProfiles.length === 0) {
        toast.info("No changes to save.");
        setLoading(false);
        return;
      }

      const savePromises = [];

      newProfiles.forEach((p) => {
        const payload = {
          orgSecProfCd: p.orgSecProfCd,
          companyId: p.companyId || "1",
          name: p.name,
          rightsAppCOde_Flag: p.rightsAppCOde_Flag || "N",
          profile_Org_Flag: p.profile_Org_Flag || "B",
        };
        savePromises.push(api.post(`${backendUrl}/api/OrgSecProfile`, payload));
      });

      updatedProfiles.forEach((p) => {
        const payload = {
          orgSecProfCd: p.orgSecProfCd,
          companyId: p.companyId,
          name: p.name,
          rightsAppCOde_Flag: p.rightsAppCOde_Flag,
          profile_Org_Flag: p.profile_Org_Flag,
        };
        savePromises.push(
          api.put(
            `${backendUrl}/api/OrgSecProfile/${p.orgSecProfCd}/${p.companyId}`,
            payload,
          ),
        );
      });

      await Promise.all(savePromises);
      toast.success("All profile changes saved successfully!");
      fetchInitialData();
      setSelectedProfiles([]);
      setSelectedProfileRow(null);
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save some profiles. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newGroup = {
      orgSecProfCd: "",
      name: "",
      companyId: "1",
      rightsAppCOde_Flag: "N",
      profile_Org_Flag: "B",
      isNew: true,
      isDirty: true,
    };

    setProfiles((prev) => [newGroup, ...prev]);
    setSelectedProfiles([newGroup]);
    setSelectedProfileRow(newGroup);

    toast.info(
      "New profile row added. Please enter the profile code and name.",
    );
  };

  const handleClear = () => {
    const hasNewRows = profiles.some((g) =>
      String(g.orgSecProfCd).startsWith("NEW_"),
    );
    const hasEdits = profiles.some((g) => g.isDirty === true);

    if (!hasNewRows && !hasEdits) {
      toast.info("No unsaved changes to clear.");
      return;
    }

    if (window.confirm("Discard all unsaved changes and new rows?")) {
      setProfiles((prev) => prev.filter((g) => !g.isNew));
      fetchInitialData();
      setSelectedProfiles([]);
      toast.info("Unsaved changes discarded.");
    }
  };

  const getFilteredOrgOptions = (currentIndex) => {
    const usedIds = selectedOrgIds
      .filter((_, idx) => idx !== currentIndex)
      .map((m) => m.id);

    const currentMapping = selectedOrgIds[currentIndex];
    const isWildcard = currentMapping?.relation === "B";

    return allOrgs
      .filter((org) => {
        if (usedIds.includes(org.orgId)) return false;

        if (isWildcard) {
          const forbidden = ["1", "1.0", "1.0.1"];
          if (forbidden.includes(String(org.orgId))) return false;
        }
        return true;
      })
      .map((org) => ({
        value: org.orgId,
        label: `${org.orgId} - ${org.orgName || org.name || ""}`,
      }));
  };

  const isProfileSelected = (profile) =>
    selectedProfiles.some((p) =>
      profile.orgSecProfCd && p.orgSecProfCd
        ? p.orgSecProfCd === profile.orgSecProfCd
        : p === profile,
    );

  const isAllProfilesSelected = () => {
    // Use the same filtering logic as your table rows
    const filtered = filteredProfiles;
    if (filtered.length === 0) return false;

    // Check if every visible profile exists in the selectedProfiles array
    return filtered.every((profile) =>
      selectedProfiles.some((p) => p.orgSecProfCd === profile.orgSecProfCd),
    );
  };

  const handleProfileCheckboxChange = (profile) => {
    toggleGroupSelection(profile);
  };

  const handleProfileRowClick = (profile) => {
    setSelectedProfileRow(profile);
    if (!isProfileSelected(profile)) {
      setSelectedProfiles((prev) => [...prev, profile]);
    }
  };

  const relationOptions = [
    { label: "Begins With (B)", value: "B" },
    { label: "Equal/Other (N)", value: "N" },
  ];

  const rightsOptions = [
    { label: "Yes", value: "Y" },
    { label: "No", value: "N" },
  ];

  const handleAddMapping = () => {
    if (!selectedProfileRow) {
      toast.warn("Select a profile first to add a mapping.");
      return;
    }

    setSelectedOrgIds((prev) => [
      ...prev,
      {
        id: null,
        relation: "",
        rights: "N",
        orgName: "",
        companyId: selectedProfileRow.companyId || "1",
        isNew: true,
      },
    ]);
  };

  const updateMappingRow = (index, updates) => {
    setSelectedOrgIds((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, ...updates, isDirty: true } : item,
      ),
    );
  };

  const handleMappingOrgChange = (index, option) => {
    const org = allOrgs.find((o) => String(o.orgId) === String(option?.value));
    updateMappingRow(index, {
      id: option?.value || null,
      orgName: org?.orgName || option?.label || "",
      companyId: org?.companyId || selectedProfileRow?.companyId || "1",
    });
  };

  const handleSelectAllProfiles = (e) => {
    const isChecked = e.target.checked;
    const filtered = filteredProfiles; // Use the already defined filtered list

    if (isChecked) {
      // Add only those that aren't already selected
      setSelectedProfiles((prev) => {
        const existingIds = new Set(prev.map((p) => p.orgSecProfCd));
        const toAdd = filtered.filter((f) => !existingIds.has(f.orgSecProfCd));
        return [...prev, ...toAdd];
      });
    } else {
      // Remove only the visible ones from the selection
      const filteredIds = new Set(filtered.map((f) => f.orgSecProfCd));
      setSelectedProfiles((prev) =>
        prev.filter((p) => !filteredIds.has(p.orgSecProfCd)),
      );
    }
  };

  const updateGroupField = (index, field, value) => {
    setProfiles((prev) => {
      const oldRow = prev[index];

      const newProfiles = prev.map((item, idx) => {
        if (idx !== index) return item;
        return { ...item, [field]: value, isDirty: true };
      });

      const updatedRow = newProfiles[index];

      if (
        selectedProfileRow &&
        selectedProfileRow.orgSecProfCd === oldRow.orgSecProfCd
      ) {
        setSelectedProfileRow(updatedRow);
      }

      setSelectedProfiles((prevSel) =>
        prevSel.map((sel) =>
          sel.orgSecProfCd === oldRow.orgSecProfCd
            ? { ...sel, [field]: value, isDirty: true }
            : sel,
        ),
      );

      return newProfiles;
    });
  };

  const fetchMappings = async (profileId) => {
    try {
      setLoading(true);
      let endpoint = "";
      if (activeView === "orgs") {
        endpoint = `${backendUrl}/api/OrgSecProfileOrgSetup/by-profile/${profileId}`;
      } else if (activeView === "apps") {
        endpoint = `${backendUrl}/api/OrgSecProf_App/${profileId}/${selectedProfileRow?.companyId || "1"}`;
      }

      const res = await api.get(endpoint);

      const mappedData = (res.data || []).map((item) => ({
        id: item.orgId,
        relation: item.orgWildcardFl || "",
        rights: item.sorgRightsCd || "",
        name: item.profileName || "",
        companyName: item.companyName || "",
        orgName: item.orgName || "",
        companyId: item.companyId || "",
        isExisting: true,
      }));

      setSelectedOrgIds(mappedData);
      setOriginalMappings(mappedData);
    } catch (e) {
      console.error("Fetch Mappings Error:", e);
      setSelectedOrgIds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedOrgIds([...originalMappings]);
    setSelectedMappingRows([]);
    toast.info("Changes reverted to last saved state");
  };

  const deleteSelectedMappings = async () => {
    if (selectedMappingRows.length === 0) {
      toast.warn("Please select at least one mapping to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedMappingRows.length} selected mapping(s)?`,
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const mappingsToDelete = selectedMappingRows.map(
        (index) => selectedOrgIds[index],
      );
      const existingMappings = mappingsToDelete.filter(
        (m) => m?.isExisting && selectedProfileRow,
      );

      if (existingMappings.length > 0) {
        await Promise.all(
          existingMappings.map((m) => {
            const profCd = selectedProfileRow.orgSecProfCd;
            const orgId = m.id;
            const compId = m.companyId || "1";
            return api.delete(
              `${backendUrl}/api/OrgSecProfileOrgSetup/${profCd}/${orgId}/${compId}`,
            );
          }),
        );
      }

      const remainingMappings = selectedOrgIds.filter(
        (_, index) => !selectedMappingRows.includes(index),
      );

      setSelectedOrgIds(remainingMappings);
      setSelectedMappingRows([]);
      toast.success("Selected mappings removed successfully.");
    } catch (error) {
      console.error("Bulk Delete Error:", error);
      toast.error("An error occurred while deleting some mappings.");
    } finally {
      if (selectedProfileRow?.orgSecProfCd && !selectedProfileRow.isNew) {
        await fetchMappings(selectedProfileRow.orgSecProfCd);
      }
      setLoading(false);
    }
  };

  const toggleRowSelection = (index) => {
    setSelectedMappingRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleUnifiedSave = async () => {
    setLoading(true);
    try {
      const newProfiles = profiles.filter((p) => p.isNew === true);
      const updatedProfiles = profiles.filter(
        (p) => !p.isNew && p.isDirty === true,
      );

      const profilePromises = [];

      newProfiles.forEach((p) => {
        profilePromises.push(
          api.post(`${backendUrl}/api/OrgSecProfile`, {
            orgSecProfCd: p.orgSecProfCd,
            companyId: p.companyId || "1",
            name: p.name,
            rightsAppCOde_Flag: p.rightsAppCOde_Flag || "N",
            profile_Org_Flag: p.profile_Org_Flag || "B",
          }),
        );
      });

      updatedProfiles.forEach((p) => {
        profilePromises.push(
          api.put(
            `${backendUrl}/api/OrgSecProfile/${p.orgSecProfCd}/${p.companyId}`,
            {
              orgSecProfCd: p.orgSecProfCd,
              companyId: p.companyId,
              name: p.name,
              rightsAppCOde_Flag: p.rightsAppCOde_Flag,
              profile_Org_Flag: p.profile_Org_Flag,
            },
          ),
        );
      });

      if (profilePromises.length > 0) {
        await Promise.all(profilePromises);
      }

      if (selectedProfileRow && selectedOrgIds.length > 0) {
        const mappingPromises = selectedOrgIds.map((item) => {
          const orgDetails = allOrgs.find((o) => o.orgId === item.id) || {};
          const payload = {
            orgSecProfCd: selectedProfileRow.orgSecProfCd,
            companyId: selectedProfileRow.companyId || "1",
            orgId: item.id,
            orgName: orgDetails.orgName || item.orgName || "",
            orgWildcardFl: item.relation || "",
            sorgRightsCd: item.rights || "N",
            profileName: selectedProfileRow.name || "",
            companyName: selectedProfileRow.companyName || "",
          };

          return item.isExisting
            ? api.put(
                `${backendUrl}/api/OrgSecProfileOrgSetup/${payload.orgSecProfCd}/${payload.orgId}/${payload.companyId}`,
                payload,
              )
            : api.post(`${backendUrl}/api/OrgSecProfileOrgSetup`, payload);
        });

        await Promise.all(mappingPromises);
      }

      toast.success("All changes saved successfully.");
      await fetchInitialData();
      if (selectedProfileRow?.orgSecProfCd) {
        await fetchMappings(selectedProfileRow.orgSecProfCd);
      }
      setSelectedProfiles([]);
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Error during save process");
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const term = searchTermGroups.trim().toLowerCase();
    if (!term) return true;
    return (
      String(profile.name || "")
        .toLowerCase()
        .includes(term) ||
      String(profile.orgSecProfCd || "")
        .toLowerCase()
        .includes(term)
    );
  });

  const mappingLabel = activeView === "apps" ? "App" : "Organization";
  const mappingPlaceholder =
    activeView === "apps" ? "Select App..." : "Select Organization...";

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <div>
        <div className="space-y-4">
          <MainContainer title="Manage Organization Security Profiles">
            <Toolbar
              actions={{
                onAdd: handleAdd,
                onDelete: handleDelete,
                onCopy: handleCopy,
                onPaste: handlePaste,
                onClear: handleClear,
                onSave: handleSave,
              }}
            />
            <div className={`overflow-x-auto max-h-[35vh]`}>
              <table className="min-w-full text-sm border border-gray-300 rounded">
                <thead className="bg-gray-200 sticky top-0 z-10 ">
                  <tr>
                    <th className="th-thead w-10">
                      <input
                        type="checkbox"
                        checked={
                          profiles.length > 0 &&
                          profiles
                            .filter((g) =>
                              g.name
                                .toLowerCase()
                                .includes(searchTermGroups.toLowerCase()),
                            )
                            .every((fg) =>
                              selectedProfiles.some(
                                (sg) =>
                                  // Match by ID if it exists, otherwise match by the exact object reference
                                  (fg.orgSecProfCd &&
                                    sg.orgSecProfCd === fg.orgSecProfCd) ||
                                  fg === sg,
                              ),
                            )
                        }
                        onChange={handleSelectAllProfiles}
                      />
                    </th>
                    <th className="th-thead bg-[#e5f3fb] text-black text-xs">
                      Profile ID
                    </th>
                    <th className="th-thead bg-[#e5f3fb] text-black text-xs">
                      Profile Name
                    </th>
                    {/* New Headers */}
                    <th className="th-thead bg-[#e5f3fb] text-black text-xs w-24 text-center">
                      Org Sec
                    </th>
                    <th className="th-thead bg-[#e5f3fb] text-black text-xs w-32">
                      Right Method
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {initialLoading ? (
                    // 1. LOADING STATE: Show placeholder rows with a spinner
                    <tr className="animate-pulse border-b border-gray-100">
                      <td colSpan="3" className="px-4 py-4 text-center">
                        <div className="flex justify-center items-center gap-2 text-gray-400">
                          <div className="w-4 h-4 border-2 border-[#17414d] border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-[10px]">
                            Loading profiles...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    profiles
                      .filter((g) =>
                        g.name
                          .toLowerCase()
                          .includes(searchTermGroups.toLowerCase()),
                      )
                      .map((g, index) => {
                        const isSelected = selectedProfiles.some(
                          (sel) => sel.orgSecProfCd === g.orgSecProfCd,
                        );
                        const isNewRow = !!g.isNew;

                        return (
                          <tr
                            key={index}
                            onClick={() => {
                              // 1. Set this as the active row to show mappings below
                              setSelectedProfileRow(g);

                              // 2. Toggle the checkbox selection for bulk actions/saving
                              toggleGroupSelection(g);
                            }}
                            className={`cursor-pointer border-b transition-colors ${
                              selectedProfileRow?.orgSecProfCd ===
                              g.orgSecProfCd
                                ? "bg-blue-100" // Highlight for the currently active row
                                : isSelected
                                  ? "bg-blue-50" // Sub-highlight for other checked rows
                                  : "hover:bg-gray-50"
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="text-center tbody-td ">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                className="h-3 w-3 accent-blue-600 cursor-pointer"
                              />
                            </td>
                            {/* Profile Code - FIXED EDITABILITY */}
                            <td className="tbody-td">
                              <input
                                type="text"
                                placeholder="Code"
                                className={`bg-transparent outline-none w-full font-mono text-[11px] ${
                                  isNewRow
                                    ? "text-blue-600 border-b border-blue-200"
                                    : "text-gray-600"
                                }`}
                                maxLength={3}
                                value={g.orgSecProfCd}
                                readOnly={!isNewRow}
                                onChange={(e) =>
                                  updateGroupField(
                                    index,
                                    "orgSecProfCd",
                                    e.target.value,
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                            {/* Profile Name - Always Editable */}
                            <td className="tbody-td">
                              <input
                                type="text"
                                className="td-input"
                                value={g.name}
                                onChange={(e) =>
                                  updateGroupField(
                                    index,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>

                            {/* App Rights Toggle - Always Editable */}
                            <td className="px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                className="h-3 w-3 accent-blue-600 cursor-pointer"
                                checked={g.profile_Org_Flag === "Y"}
                                onChange={(e) =>
                                  updateGroupField(
                                    index,
                                    "profile_Org_Flag",
                                    e.target.checked ? "Y" : "N",
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>

                            {/* Profile Scope Dropdown - Always Editable */}
                            <td className="tbody-td text-center min-w-[150px]">
                              <select
                                className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white outline-none"
                                value={g.rightsAppCOde_Flag}
                                onChange={(e) =>
                                  updateGroupField(
                                    index,
                                    "rightsAppCOde_Flag",
                                    e.target.value,
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="B">Both</option>
                                <option value="I">Inclusive</option>
                                <option value="E">Exclusive</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </MainContainer>
        </div>
      </div>

      <div className="space-y-3">
        <SecondaryContainer title="Organization Mappings">
          <Toolbar
            actions={{
              onAdd: handleAddMapping,
              onDelete: deleteSelectedMappings,
              onCopy: handleCopy,
              onPaste: handlePaste,
              onClear: handleReset,
              onSave: saveMappings,
            }}
          />

          <div className={`overflow-x-auto max-h-[35vh]}`}>
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedOrgIds.length > 0 &&
                        selectedOrgIds.every((_, idx) =>
                          selectedMappingRows.includes(idx),
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMappingRows(
                            selectedOrgIds.map((_, idx) => idx),
                          );
                        } else {
                          setSelectedMappingRows([]);
                        }
                      }}
                    />
                  </th>
                  <th className="th-thead">{mappingLabel} ID</th>
                  <th className="th-thead">{mappingLabel} Name</th>
                  <th className="th-thead">Relation</th>
                  <th className="th-thead">Rights</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrgIds.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No mappings yet. Select a profile or add a mapping.
                    </td>
                  </tr>
                ) : (
                  selectedOrgIds.map((row, index) => {
                    const selected = selectedMappingRows.includes(index);
                    const selectedOption = getFilteredOrgOptions(index).find(
                      (option) => String(option.value) === String(row.id),
                    );

                    return (
                      <tr
                        key={`${row.id || "new"}-${index}`}
                        className={`${selected ? "bg-slate-100" : ""}`}
                      >
                        <td className="text-center tbody-td ">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleRowSelection(index)}
                          />
                        </td>
                        <td className="tbody-td">
                          {activeView === "orgs" ? (
                            <Select
                              options={getFilteredOrgOptions(index)}
                              value={selectedOption || null}
                              styles={customStyles}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              placeholder={mappingPlaceholder}
                              onChange={(option) =>
                                handleMappingOrgChange(index, option)
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              value={row.id || ""}
                              placeholder={mappingPlaceholder}
                              onChange={(e) =>
                                updateMappingRow(index, { id: e.target.value })
                              }
                              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                            />
                          )}
                        </td>
                        <td className="tbody-td">{row.orgName || "-"}</td>
                        <td className="tbody-td text-center min-w-[150px]">
                          <Select
                            options={relationOptions}
                            value={
                              relationOptions.find(
                                (opt) => opt.value === row.relation,
                              ) || null
                            }
                            styles={customStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            placeholder="Relation"
                            onChange={(option) =>
                              updateMappingRow(index, {
                                relation: option?.value || "",
                              })
                            }
                          />
                        </td>
                        <td className="tbody-td text-center min-w-[150px]">
                          <Select
                            options={rightsOptions}
                            value={
                              rightsOptions.find(
                                (opt) => opt.value === row.rights,
                              ) || null
                            }
                            styles={customStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            placeholder="Rights"
                            onChange={(option) =>
                              updateMappingRow(index, {
                                rights: option?.value || "",
                              })
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </SecondaryContainer>
      </div>
    </div>
  );
};

export default ManageOrganizationSecurityProfiles;
