import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { backendUrl } from "../config";
import { MainContainer, Toolbar } from "../../helper/container";
import { Building2, CircleUser } from "lucide-react";
import {
  FormInput,
  FormSearchSelect,
  FormSection,
} from "../../helper/formSection";
import { toast } from "react-toastify";
import { TableSearchSelect } from "../../helper/tableSection";

const LinkOrgReorg = () => {
  const [accounts, setAccounts] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [searchAccTerm, setSearchAccTerm] = useState("");
  const [searchOrgTerm, setSearchOrgTerm] = useState("");
  const [currentAccPage, setCurrentAccPage] = useState(1);
  const [pageAccSize, setPageAccSize] = useState(15);
  const [currentOrgPage, setCurrentOrgPage] = useState(1);
  const [pageOrgSize, setPageOrgSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [selectedAccIds, setSelectedAccIds] = useState([]);
  const [selectedOrgIds, setSelectedOrgIds] = useState([]);
  const [isFormView, setIsFormView] = useState(true);
  const [linkedData, setLinkedData] = useState([]);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [searchAcc, setSearchAcc] = useState("");
  const [searchOrg, setSearchOrg] = useState("");
  // This will store strings like "R01|O99" to uniquely identify a link
  const [selectedLinks, setSelectedLinks] = useState(new Set());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const getLinkKey = (row) => `${row.reorgId || row.tempId}|${row.orgId}`;

  // Change these at the top of your component
  const normalizeOptionId = (opt, key) => {
    return (
      opt?.[key] ?? opt?.reorgId ?? opt?.orgId ?? opt?.id ?? opt?.value ?? ""
    );
  };

  const normalizeOptionName = (opt, key) => {
    return (
      opt?.[key] ??
      opt?.reorgName ??
      opt?.orgName ??
      opt?.name ??
      opt?.label ??
      ""
    );
  };

  const handleDeleteSelected = async () => {
    // 1. Identify which rows in linkedData are present in the selectedLinks Set
    const rowsToDelete = linkedData.filter((row) => {
      const key = `${row.reorgId || row.tempId}|${row.orgId}`;
      return selectedLinks.has(key);
    });

    if (rowsToDelete.length === 0) {
      toast.info("No rows selected for deletion.");
      return;
    }

    // 2. Confirm with the user
    if (
      !window.confirm(
        `Are you sure you want to delete ${rowsToDelete.length} mapping(s)?`,
      )
    ) {
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // 3. Loop through rows and delete sequentially (one by one as requested)
      for (const row of rowsToDelete) {
        try {
          // Construct the URL with both IDs
          const response = await api.delete(
            `${backendUrl}/api/Account/DeleteOrgAccount?orgId=${row.orgId}&reorgId=${row.reorgId}`,
          );

          if (response.status === 200 || response.status === 204) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          console.error(
            `Failed to delete mapping: ${row.reorgId} - ${row.orgId}`,
            err,
          );
          errorCount++;
        }
      }

      // 4. Update the UI if any deletions were successful
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} mapping(s).`);

        // Remove deleted rows from local state
        setLinkedData((prev) =>
          prev.filter((row) => {
            const key = `${row.reorgId || row.tempId}|${row.orgId}`;
            return !selectedLinks.has(key);
          }),
        );

        // Reset selection state and active row indicators
        setSelectedLinks(new Set()); // Clear the checkboxes
        setActiveRowIndex(null);
        setActiveRow(null);
      }

      if (errorCount > 0) {
        toast.error(`Failed to delete ${errorCount} mapping(s).`);
      }
    } catch (globalError) {
      console.error("Delete process encountered an error:", globalError);
      toast.error("An error occurred during the deletion process.");
    } finally {
      setLoading(false);
    }
  };

  // When clicking a row in the table to "Edit" or "View" in form
  const handleRowSelect = (index) => {
    setActiveRowIndex(index);
    setActiveRow(linkedData[index]);
    setCurrentIndex(index);
    setIsFormView(true);
  };

  const handleFieldChange = (index, field, value) => {
    // 1. Prevent updates if index is invalid
    if (index === null || index === undefined || index < 0) {
      console.warn("Attempted to update field without a valid row index");
      return;
    }

    // 2. Validation Logic
    let processedValue = value;

    // Period validation (1-12)
    if (["pdNoFr", "pdNoTo", "periodStart", "periodEnd"].includes(field)) {
      if (value !== "" && value !== null) {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 1 || numValue > 12) {
          toast.warn("Period must be between 1 and 12");
          return;
        }
        processedValue = numValue;
      }
    }

    // Fiscal Year validation (max 4 digits)
    if (
      ["fyCdFr", "fyCdTo", "fiscalYearStart", "fiscalYearEnd"].includes(field)
    ) {
      if (value !== null && String(value).length > 4) {
        toast.warn("Year cannot exceed 4 digits");
        return;
      }
    }

    // 3. Update the main list using Functional State (Source of Truth)
    setLinkedData((prevData) => {
      // Create a fresh copy of the latest data
      const newData = [...prevData];

      // Safety check for the specific row
      if (!newData[index]) return prevData;

      setIsFormDirty(true);

      // Update the specific field
      newData[index] = {
        ...newData[index],
        [field]: processedValue,
        isNew: true, // This marks the row for the Save API
      };

      // 4. Keep Form in sync (inside the setter to ensure we use the updated row)
      if (activeRowIndex === index) {
        setActiveRow(newData[index]);
      }

      return newData;
    });
  };

  const fetchLinkedData = async () => {
    setLoading(true);
    try {
      // Your specific API endpoint for existing links
      const url = `${backendUrl}/api/reorganizations/GetAllMappingByReorg`;
      const res = await api.get(url);

      if (res.data) {
        // Map the API response to your local state structure
        setLinkedData(res.data);

        const firstSelected = `${res.data[0].reorgId || res.data[0].tempId}|${res.data[0].orgId}`;
        setSelectedLinks(new Set([firstSelected]));
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLinkedData();
  }, []);

  useEffect(() => {
    if (linkedData.length > 0) {
      if (activeRowIndex === null || activeRowIndex >= linkedData.length) {
        setActiveRowIndex(0);
        setActiveRow(linkedData[0]);
        setCurrentIndex(0);
      } else {
        setActiveRow(linkedData[activeRowIndex]);
        setCurrentIndex(activeRowIndex);
      }
    } else {
      setActiveRowIndex(null);
      setActiveRow(null);
      setCurrentIndex(0);
    }
  }, [linkedData, activeRowIndex]);

  useEffect(() => {
    const getAccoutns = async () => {
      setLoading(true);
      const term = searchAccTerm.trim();
      try {
        const url = `${backendUrl}/api/reorganizations/GetAllReOrgs`;
        const res = await api.get(url);

        if (res.data) {
          console.log(res);
          setAccounts(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getOrganization = async () => {
      setLoading(true);
      const term = searchOrgTerm.trim();
      try {
        const url = `${backendUrl}/Orgnization/SearchOrganizations?search=${term}&startsWith=${term}&sortBy=OrgId&sortOrder=asc&page=${currentOrgPage}&pageSize=${pageOrgSize}`;
        const res = await api.get(url);

        if (res.data.data) {
          setOrganizations(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAccoutns();
    getOrganization();
  }, []);

  const handleAddNew = () => {
    // Check if there is already an unsaved new row in the list
    const hasUnsavedNewRow = linkedData.some((item) => item.isNew === true);

    if (hasUnsavedNewRow) {
      toast.warn(
        "Please save or discard the current new entry before adding another.",
      );
      return;
    }

    const newRow = {
      reorgId: "",
      reorgName: "",
      orgId: "",
      orgName: "",
      // activeFl: true,
      isNew: true,
      tempId: Date.now(),
    };

    setLinkedData((prev) => [newRow, ...prev]);

    setActiveRowIndex(0);
    setActiveRow(newRow);
    if (typeof setCurrentIndex === "function") setCurrentIndex(0);
    setIsFormView(true);
  };

  const handleSave = async () => {
    // 1. Identify only the new records
    const newRecords = linkedData.filter((item) => item.isNew === true);

    if (newRecords.length === 0) {
      toast.info("No new records to save.");
      return;
    }

    // 2. Validate that required IDs are present before saving
    const invalidRows = newRecords.filter((row) => !row.reorgId || !row.orgId);
    if (invalidRows.length > 0) {
      toast.error(
        "Please select both Account and Organization for all new rows.",
      );
      return;
    }

    setLoading(true);
    try {
      // 3. Map to the API payload format
      const payload = newRecords.map((item) => ({
        reorgId: item.reorgId,
        orgId: item.orgId,
        companyId: "1",
        //   activeFlag: item.activeFl ? "Y" : "N",
      }));

      // 4. API Call
      const res = await api.post(
        `${backendUrl}/api/reorganizations/BulkCreateMapping`,
        payload,
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("New links saved successfully!");

        // 5. Update local state: remove 'isNew' status or refresh data
        setLinkedData((prev) =>
          prev.map((item) => (item.isNew ? { ...item, isNew: false } : item)),
        );
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to save new links.",
      );
    } finally {
      setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = linkedData.find(
      (item) => String(item.orgId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.orgId; //

      // 1. Update Form View linkedData
      setActiveRow(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = linkedData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setActiveRow(new Set([id]));
    } else {
      toast.error(`Organization ID "${code}" not found.`); //
    }
  };

  const handleNavigate = (direction) => {
    if (isFormDirty) {
      if (!window.confirm("You have unsaved changes. Discard them and move?")) {
        return;
      }
    }

    // 1. Find index based on a unique identifier (tempId or acctId+orgId combo)
    const idx = linkedData.findIndex((x) => {
      if (x.tempId && activeRow?.tempId) return x.tempId === activeRow.tempId;
      return x.reorgId === activeRow?.reorgId && x.orgId === activeRow?.orgId;
    });

    if (idx === -1) return;

    // 2. Determine the new index
    let newIdx = idx;
    if (direction === "next" && idx < linkedData.length - 1) {
      newIdx = idx + 1;
    } else if (direction === "prev" && idx > 0) {
      newIdx = idx - 1;
    } else if (direction === "start") {
      newIdx = 0;
    } else if (direction === "end") {
      newIdx = linkedData.length - 1;
    }

    // 3. Update if the index actually changed
    if (newIdx !== idx) {
      const nextRecord = linkedData[newIdx];

      // Update the index state
      setActiveRowIndex(newIdx);

      // Update the data object for the form
      setActiveRow(nextRecord);

      // Update current index for toolbar
      setCurrentIndex(newIdx);

      const rowKey = getLinkKey(nextRecord);
      setSelectedLinks(new Set(rowKey));

      // Reset dirty flag
      setIsFormDirty(false);

      // Scroll into view if needed (Optional)
      // You can use a ref on your table rows to ensure the highlighted row stays visible
    }
  };

  const handleDiscard = () => {
    // if (!activeRow) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to discard changes?",
    );
    if (!isConfirmed) return;

    setLinkedData((prevData) => {
      const newData = [...prevData];

      // Scenario A: If it's a brand-new, unsaved row, remove it entirely
      if (activeRow.isNew) {
        const filteredData = newData.filter(
          (item) => item.tempId !== activeRow.tempId,
        );

        // Reset selection to the next available row or null
        if (filteredData.length > 0) {
          setActiveRowIndex(0);
          setActiveRow(filteredData[0]);
        } else {
          setActiveRowIndex(null);
          setActiveRow(null);
        }

        setIsFormDirty(false);
        return filteredData;
      }

      // Scenario B: If it's an existing row, we refresh it from the last saved state
      // Note: This assumes you have a way to identify the original data.
      // If you don't have a 're-fetch' ready, you can just reset the dirty flag.
      setIsFormDirty(false);
      toast.info(
        "Changes discarded. Note: For existing records, values revert only if you re-select the row.",
      );

      return newData;
    });
  };

  // Get Organization Name from the 'org' state array
  const getOrgName = (id) => {
    if (!id) return "";
    const match = organizations.find((o) => String(o.orgId) === String(id));
    return match ? match.orgName : "";
  };

  // Get Reorganization Name from the 'data' (allData) state array
  const getReorgName = (id) => {
    if (!id) return "";
    const match = accounts.find((r) => String(r.reorgId) === String(id));
    return match ? match.reorgName : "";
  };

  // Helper to create the unique key combining Reorg and Org

  const handleToggleAll = (e) => {
    if (e.target.checked) {
      // 1. Create an array of composite keys for every row currently in linkedData
      const allKeys = linkedData.map((row) => getLinkKey(row));

      // 2. Pass that array into the Set constructor to select everything
      setSelectedLinks(new Set(allKeys));
    } else {
      // 3. Clear the selection
      setSelectedLinks(new Set());
    }
  };

  const handleSelectRow = (row) => {
    const key = getLinkKey(row);
    setSelectedLinks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleRowDoubleClick = (item, index) => {
    setActiveRow(item);
    const currentId = item.orgId;
    setSelectedLinks(new Set([currentId]));
    setCurrentIndex(index);

    setIsFormView(true);
  };

  return (
    <div className="p-4 space-y-4 mt-10 animate-in z-10 fade-in duration-500">
      <MainContainer
        icon={CircleUser}
        title="Link Reorganization/Organizations"
      >
        <Toolbar
          isFormView={isFormView}
          currentIndex={currentIndex}
          totalRecords={linkedData.length}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          buttonsDisable={["copy", "paste"]}
          selectedRow={activeRow}
          isDirty={isFormDirty}
          hasSelectedRows={linkedData.some((row) => row.isSelected)}
          actions={{
            onAdd: handleAddNew, // Pass the function directly instead of wrapping it in an object
            onSave: handleSave,
            onDelete: handleDeleteSelected,
            onClear: handleDiscard,
            onToggleView: () => {
              setIsFormView((prev) => {
                const nextView = !prev;

                // If we are switching TO the Form View (nextView is true)
                // and we have data, select the first row automatically
                if (nextView && linkedData.length > 0) {
                  const firstRow = linkedData[0];
                  const row = getLinkKey(firstRow);

                  setActiveRowIndex(0);
                  setActiveRow(firstRow);

                  // Also ensure it's marked in your selection Set if needed
                  setSelectedLinks(new Set([row]));
                }

                return nextView;
              });
            },
          }}
        />
        {isFormView ? (
          <div className="space-y-4 animate-in fade-in">
            {/* Account & Organization Selection */}
            <FormSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
                {/* Account Group */}
                <div className="flex gap-2 items-center">
                  <FormSearchSelect
                    label="Reorganization"
                    value={activeRow?.reorgId || ""}
                    searchTerm={searchAcc}
                    setSearchTerm={setSearchAcc}
                    disabled={!activeRow?.isNew}
                    options={accounts.filter(
                      (t) =>
                        String(t.reorgId)
                          .toLowerCase()
                          .includes(searchAcc.toLowerCase()) ||
                        t.reorgName
                          .toLowerCase()
                          .includes(searchAcc.toLowerCase()),
                    )}
                    displayKey="reorgId"
                    secondaryKey="reorgName"
                    onSelect={(opt) => {
                      if (activeRowIndex !== null) {
                        // Pass 'reorgId' as the preferred key
                        handleFieldChange(
                          activeRowIndex,
                          "reorgId",
                          normalizeOptionId(opt, "reorgId"),
                        );
                        handleFieldChange(
                          activeRowIndex,
                          "reorgName",
                          normalizeOptionName(opt, "reorgName"),
                        );
                      }
                    }}
                  />
                  <FormInput
                    label=""
                    value={
                      activeRow?.reorgName ||
                      getReorgName(activeRow?.reorgId) ||
                      ""
                    }
                    readOnly
                    className="flex-[2] bg-gray-50"
                  />
                </div>

                {/* Organization Group */}
                <div className="flex gap-x-2 items-center">
                  <FormSearchSelect
                    label="Organization"
                    value={activeRow?.orgId || ""}
                    disabled={!activeRow?.isNew}
                    searchTerm={searchOrg}
                    setSearchTerm={setSearchOrg}
                    options={organizations.filter(
                      (t) =>
                        String(t.orgId)
                          .toLowerCase()
                          .includes(searchOrg.toLowerCase()) ||
                        t.orgName
                          .toLowerCase()
                          .includes(searchOrg.toLowerCase()),
                    )}
                    displayKey="orgId"
                    secondaryKey="orgName"
                    onSelect={(opt) => {
                      if (activeRowIndex !== null) {
                        handleFieldChange(
                          activeRowIndex,
                          "orgId",
                          normalizeOptionId(opt, "orgId"),
                        );
                        handleFieldChange(
                          activeRowIndex,
                          "orgName",
                          normalizeOptionName(opt, "orgName"),
                        );
                      }
                    }}
                  />
                  <FormInput
                    label=""
                    value={
                      activeRow?.orgName || getOrgName(activeRow?.orgId) || ""
                    }
                    readOnly
                    className="flex-[2] bg-gray-50"
                  />
                </div>
              </div>
            </FormSection>

            {/* Status and Financial Period Details */}
            {/* <FormSection title="Status/Fiscal Year/Period">
              <div className="p-2 space-y-6"> */}
            {/* <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={activeRow?.activeFl || false}
                    onChange={(e) =>
                      handleFieldChange(
                        activeRowIndex,
                        "activeFl",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 mt-1"
                  />
                  <label className="text-[10px] font-[400] text-black">Active</label>
                </div> */}

            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4"> */}
            {/* Start Period */}
            {/* <div className="flex items-center gap-2">
                    <FormInput
                      label="Fiscal Year Start"
                      value={activeRow?.fyCdFr || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          activeRowIndex,
                          "fyCdFr",
                          e.target.value,
                        )
                      }
                      className="w-32"
                    />
                    <FormInput
                      label="Period Start"
                      value={activeRow?.pdNoFr || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          activeRowIndex,
                          "pdNoFr",
                          e.target.value,
                        )
                      }
                      className="w-24"
                    />
                    <span className="text-xs text-gray-400 self-end mb-3">
                      (Leave blank for no restrictions)
                    </span> */}
            {/* </div> */}

            {/* End Period */}
            {/* <div className="flex items-center gap-2">
                    <FormInput
                      label="Fiscal Year End"
                      value={activeRow?.fyCdTo || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          activeRowIndex,
                          "fyCdTo",
                          e.target.value,
                        )
                      }
                      className="w-32"
                    />
                    <FormInput
                      label="Period End"
                      value={activeRow?.pdNoTo || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          activeRowIndex,
                          "pdNoTo",
                          e.target.value,
                        )
                      }
                      className="w-24"
                    />
                    <span className="text-xs text-gray-400 self-end mb-3">
                      (Leave blank for no restrictions)
                    </span>
                  </div> */}
            {/* </div> */}
            {/* </div> */}
            {/* // </FormSection> */}
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-l border-gray-300">
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr className="text-xs uppercase font-bold text-gray-700">
                  <th className="th-thead w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleToggleAll}
                      className="w-3 h-3 accent-blue-500"
                    />
                  </th>
                  <th className="th-thead">Reorganization</th>
                  <th className="th-thead">Reorganization Name</th>
                  <th className="th-thead">Organization</th>
                  <th className="th-thead">Organization Name</th>
                  {/* <th className="th-thead w-16">Active</th>
                  <th className="th-thead">Fiscal Year Start</th>
                  <th className="th-thead">Period Start</th>
                  <th className="th-thead">Fiscal Year End</th>
                  <th className="th-thead">Period End</th> */}
                </tr>
              </thead>
              <tbody className="tbody">
                {linkedData.map((row, index) => {
                  const rowKey = getLinkKey(row);
                  const isChecked = selectedLinks.has(rowKey);
                  return (
                    <tr
                      key={index}
                      className={`tr-tbody ${activeRowIndex === index ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        // Optional: Set this row as active for the form when clicking the row
                        setActiveRowIndex(index);
                        setActiveRow(row);
                      }}
                      onDoubleClick={() => handleRowDoubleClick(row, index)}
                    >
                      {/* Selection Checkbox */}
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-blue-500"
                          checked={isChecked}
                          onChange={() => handleSelectRow(row)}
                        />
                      </td>

                      {/* Read-Only Fields */}
                      <td className="tbody-td">
                        <TableSearchSelect
                          id={index}
                          value={row.reorgId || ""}
                          options={accounts}
                          displayKey="reorgId"
                          secondaryKey="reorgName"
                          disabled={!row.isNew}
                          onSelect={(opt, rowId) => {
                            handleFieldChange(
                              rowId,
                              "reorgId",
                              normalizeOptionId(opt, "reorgId"),
                            );
                            handleFieldChange(
                              rowId,
                              "reorgName",
                              normalizeOptionName(opt, "reorgName"),
                            );
                          }}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          type="text"
                          className="td-input bg-gray-100"
                          readonly
                          value={
                            row.reorgName || getReorgName(row.reorgId) || ""
                          }
                          onChange={() => {}}
                        />
                      </td>
                      <td className="tbody-td">
                        <TableSearchSelect
                          id={index}
                          value={row.orgId || ""}
                          options={organizations}
                          disabled={!row.isNew}
                          displayKey="orgId"
                          secondaryKey="orgName"
                          onSelect={(opt, rowId) => {
                            handleFieldChange(
                              rowId,
                              "orgId",
                              normalizeOptionId(opt, "orgId"),
                            );
                            handleFieldChange(
                              rowId,
                              "orgName",
                              normalizeOptionName(opt, "orgName"),
                            );
                          }}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          type="text"
                          className="td-input bg-gray-100"
                          value={row.orgName || getOrgName(row.orgId) || ""}
                          onChange={() => {}}
                        />
                      </td>
                      {/* Active Checkbox */}
                      {/* <td className="tbody-td text-center">
                      <input
                        type="checkbox"
                        checked={row.activeFl || false}
                        onChange={(e) =>
                          handleFieldChange(index, "activeFl", e.target.checked)
                        }
                        className="w-3 h-3 mt-1"
                      />
                    </td> */}

                      {/* Fiscal Year Start */}
                      {/* <td className="tbody-td">
                      <input
                        type="text"
                        className="td-input"
                        value={row.fyCdFr || ""}
                        onChange={(e) =>
                          handleFieldChange(index, "fyCdFr", e.target.value)
                        }
                      />
                    </td> */}

                      {/* Period Start */}
                      {/* <td className="tbody-td">
                      <input
                        type="number"
                        className="td-input"
                        value={row.pdNoFr || ""}
                        onChange={(e) =>
                          handleFieldChange(index, "pdNoFr", e.target.value)
                        }
                      />
                    </td> */}

                      {/* Fiscal Year End */}
                      {/* <td className="tbody-td">
                      <input
                        type="text"
                        className="td-input"
                        value={row.fyCdTo || ""}
                        onChange={(e) =>
                          handleFieldChange(index, "fyCdTo", e.target.value)
                        }
                      />
                    </td> */}

                      {/* Period End */}
                      {/* <td className="tbody-td">
                      <input
                        type="number"
                        className="td-input"
                        value={row.pdNoTo || ""}
                        onChange={(e) =>
                          handleFieldChange(index, "pdNoTo", e.target.value)
                        }
                      />
                    </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default LinkOrgReorg;
