import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { LayoutGrid, Link2, Database, Code } from "lucide-react";
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import {
  FormSection,
  FormInput,
  ActionDetailButton,
} from "../helper/formSection";
import ReusableTable from "../helper/tableSection";
import { backendUrl } from "./config";

const ManageProjectAccountGroups = () => {
  // --- States ---
  const [acctGroups, setAcctGroups] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [functionCodes, setFunctionCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroupRows, setSelectedGroupRows] = useState([]);
  const [selectedAccountRows, setSelectedAccountRows] = useState([]);
  const [selectedFunctionRow, setSelectedFunctionRow] = useState(null);
  const [mappingData, setMappingData] = useState([]);
  const [clipboard, setClipboard] = useState([]);
  const [isFormView, setIsFormView] = useState(true);

  const [searchColumn, setSearchColumn] = useState("acctGrpCode");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);

  // --- Column Definitions ---
  const groupColumns = [
    { label: "Group Code", key: "acctGrpCode", readOnlyIfExisting: true },
    { label: "Description", key: "acctGrpDesc", readOnly: false },
    {
      label: "Active",
      key: "activeFl",
      type: "checkbox",
      value: (row) => row.activeFl === "Y",
      // Updates the state back to 'Y' or 'N' when clicked
      onToggle: (id, currentValue) => {
        handleFieldChange(id, "activeFl", currentValue ? "N" : "Y");
      },
      //   render: (row) => <input type="checkbox" checked={row.activeFl === "Y"} />,
    },
  ];

  const accountColumns = [
    { label: "Account ID", key: "acctId", width: "80px" },
    { label: "Acccount Name", key: "acctName" },
    // { label: "Description", key: "acctDesc" },
  ];

  const funcColumns = [{ label: "Function Code", key: "funcCode" }];

  //   const mappingColumns = [
  //     { label: "Account ID", key: "accountId" },
  //     { label: "Account", key: "acctName" },
  //     { label: "Function Code", key: "funcCode" },
  //     { label: "Project Account Abbreviation" },
  //     { label: "Revenue Account Mapping" },
  //     { label: "Salary Cap Account Mapping" },
  //     { label: "Active", key: "activeFl" },
  //   ];

  const mappingColumns = [
    { label: "Account ID", key: "accountId" },
    { label: "Name", key: "acctName" },
    { label: "Function Code", key: "funcCode" },
    {
      label: "Project Account Abbreviation",
      key: "projectAccountAbbreviation",
      type: "text",
    },
    {
      label: "Revenue Account Mapping",
      key: "revenueMappedAccount", // This displays the ID/Value currently in state
      type: "search-select",
      options: accounts,
      displayKey: "acctName",
      secondaryKey: "acctId",
      // Use onSelect to update the state with the specific ID when a name is picked
      onSelect: (opt, id) => {
        handleMappingFieldChange(id, "revenueMappedAccount", opt.acctId);
      },
    },
    {
      label: "Salary Cap Account Mapping",
      key: "salaryCapMappedAccount",
      type: "search-select",
      options: accounts,
      displayKey: "acctName",
      secondaryKey: "acctId",
      // Similarly for this column
      onSelect: (opt, id) => {
        handleMappingFieldChange(id, "salaryCapMappedAccount", opt.acctId);
      },
    },
    {
      label: "Active",
      key: "activeFlag",
      render: (row) => (
        <input
          type="checkbox"
          checked={row.activeFlag}
          onChange={(e) =>
            handleMappingFieldChange(row.id, "activeFlag", e.target.checked)
          }
        />
      ),
    },
  ];

  const handleMappingFieldChange = (rowId, field, value) => {
    setMappingData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    );
  };
  // --- 1. Fetch Initial Data Function ---
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [grpRes, accRes, funcRes] = await Promise.all([
        axios.get(`${backendUrl}/api/AcctGrp/getall`),
        axios.get(`${backendUrl}/api/Account/GetAllAccounts`),
        axios.get(`${backendUrl}/api/AccountLevel/GetAllAcctFunctionCode`),
      ]);

      const groups = grpRes.data?.data || [];
      setAcctGroups(grpRes.data?.data || []);
      setAccounts(accRes.data || []);

      if (groups.length > 0) {
        setSelectedGroupRows([groups[0]]);
      }

      const mappedFuncs = (funcRes.data || []).map((str, index) => ({
        id: index,
        funcCode: str,
      }));
      setFunctionCodes(mappedFuncs);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load project account data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMappingsForGroup = async (groupCode) => {
    if (!groupCode) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/AccountGroupSetup/getall?pageNumber=1&pageSize=9999999`,
      );

      // 1. Extract the array from response.data.data (based on your JSON)
      const allMappings = response.data?.data || [];

      // 2. Filter locally for the specific group and map keys correctly
      const filteredMappings = allMappings
        .filter((m) => m.acctGroupCode === groupCode)
        .map((m, index) => ({
          id: `existing_${index}`,
          acctGroupCode: m.acctGroupCode,
          accountId: m.accountId,
          // Match API "accountName" to local "acctName"
          acctName: m.accountName || m.acctName,
          // Match API "accountFunctionDescription" to local "funcCode"
          funcCode: m.accountFunctionDescription || m.funcCode,
          activeFlag: m.activeFlag,
          companyId: m.companyId,
        }));

      setMappingData(filteredMappings);
    } catch (error) {
      console.error("Error fetching mappings:", error);
      setMappingData([]);
    }
  };

  // --- 2. UseEffect to trigger on mount ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  // --- 3. UseEffect to fetch mappings when group is selected ---
  useEffect(() => {
    if (selectedGroupRows.length > 0) {
      const group = selectedGroupRows[0];
      fetchMappingsForGroup(group.acctGrpCode);
    } else {
      setMappingData([]);
      setSelectedAccountRows([]);
      setSelectedFunctionRow(null);
    }
  }, [selectedGroupRows]);

  // --- Helper for Table Rows ---
  const getRowKey = (row) => row.acctGrpCode || row.tempId;

  // --- Handle Add New Group ---
  const handleAdd = () => {
    const newRow = {
      tempId: `TEMP_${Date.now()}`,
      acctGrpCode: "",
      acctGrpDesc: "",
      activeFl: "Y",
      isDirty: true,
      isNew: true,
    };
    setAcctGroups((prev) => [newRow, ...prev]);
    setSelectedGroupRows([newRow]);
    setSelectedAccountRows([]);
    setSelectedFunctionRow(null);
    setMappingData([]);
  };

  // --- Handle Copy ---
  const handleCopy = () => {
    if (selectedGroupRows.length === 0)
      return toast.warn("Select at least one record to copy.");
    setClipboard([...selectedGroupRows]);
    toast.success(`${selectedGroupRows.length} record(s) copied to clipboard`);
  };

  // --- Handle Paste ---
  const handlePaste = () => {
    if (!clipboard.length) return toast.warn("Clipboard is empty.");

    const pasted = clipboard.map((row, i) => {
      const { tempId, acctGrpCode, ...restProps } = row;
      return {
        ...restProps,
        acctGrpCode: "",
        tempId: `PASTE_${Date.now()}_${i}`,
        isDirty: true,
      };
    });

    setAcctGroups((prev) => [...pasted, ...prev]);
    setSelectedGroupRows([pasted[0]]);
    setSelectedAccountRows([]);
    setSelectedFunctionRow(null);
    setMappingData([]);
    // setIsFormView(true);
    toast.success(
      `${pasted.length} record(s) pasted. Please enter new Group Code.`,
    );
  };

  // --- Handle Clear ---
  const handleClear = () => {
    const hasNew = acctGroups.some((f) => f.tempId);
    const hasEdits = acctGroups.some((f) => f.isDirty === true);

    if (!hasNew && !hasEdits) return;

    if (window.confirm("Discard unsaved changes and new rows?")) {
      fetchInitialData();
      setSelectedGroupRows([]);
      setSelectedAccountRows([]);
      setSelectedFunctionRow(null);
      setMappingData([]);
      toast.info("Changes discarded.");
    }
  };

  const handleFind = () => {
    if (!searchValue) return;
    const foundIndex = acctGroups.findIndex((item) =>
      String(item[searchColumn])
        .toLowerCase()
        .includes(searchValue.toLowerCase()),
    );
    if (foundIndex !== -1) {
      setSelectedGroupRows([acctGroups[foundIndex]]);
      toast.success("Record found");
    } else {
      toast.warn("No matching record found");
    }
  };

  const handleBulkReplace = () => {
    if (!searchValue || !replaceValue)
      return toast.warn("Enter search and replace values");

    // Block replacement for unique identifiers
    if (searchColumn === "acctGrpCode") {
      return toast.error(
        "Account Group Code is a unique identifier and cannot be bulk replaced.",
      );
    }

    const updatedGroups = acctGroups.map((group) => {
      const currentValue = String(group[searchColumn] || "").toLowerCase();
      if (currentValue === searchValue.toLowerCase()) {
        return { ...group, [searchColumn]: replaceValue, isDirty: true };
      }
      return group;
    });

    setAcctGroups(updatedGroups);
    toast.success("Bulk replace completed");
    setIsReplaceMode(false);
  };

  const handleSave = async () => {
    const changedGroups = acctGroups.filter((g) => g.isDirty || g.tempId);

    // Validation: Check if there is anything to save
    if (changedGroups.length === 0 && mappingData.length === 0) {
      return toast.warn("No changes to save");
    }

    setLoading(true);
    try {
      // 1. Save Group Master (Post/Put)
      const groupPromises = changedGroups.map((group) => {
        const payload = {
          acctGrpCode: group.acctGrpCode,
          companyId: group.companyId || "1",
          acctGrpDesc: group.acctGrpDesc || "",
          modifiedBy: "Admin",
          timeStamp: new Date().toISOString(),
          rowversion: 0,
          activeFl: group.activeFl === "Y" ? "Y" : "N",
        };

        return group.tempId
          ? axios.post(`${backendUrl}/api/AcctGrp/create`, payload)
          : axios.put(`${backendUrl}/api/AcctGrp/update`, payload);
      });

      // 2. Save ALL Mappings (Passes the entire array to Replace API)
      // Inside handleSave function
      let mappingPromise = null;
      if (mappingData.length > 0) {
        const mappingPayload = mappingData.map((m) => {
          // Ensure we are sending strings/booleans as the API expects based on your JSON example
          return {
            acctGroupCode: m.acctGroupCode,
            accountId: String(m.accountId), // Ensure ID is a string
            accountFunctionDescription: m.funcCode || "",
            modifiedBy: "Admin",
            timeStamp: new Date().toISOString(),
            companyId: m.companyId || "1",
            projectAccountAbbreviation: m.projectAccountAbbreviation || "",

            // Correctly handle the boolean flag for the API
            activeFlag: m.activeFlag === "Y" || m.activeFlag === true,

            // Pass the IDs captured from your Search-Select columns
            revenueMappedAccount: m.revenueMappedAccount || "",
            salaryCapMappedAccount: m.salaryCapMappedAccount || "",

            // acctType: {
            //   funcCode: m.funcCode || "",
            // },
          };
        });

        mappingPromise = axios.post(
          `${backendUrl}/api/AccountGroupSetup/Replace`,
          mappingPayload,
        );
      }

      await Promise.all([...groupPromises, mappingPromise].filter(Boolean));

      toast.success("Saved successfully");

      // Refresh UI
      fetchInitialData();
      if (selectedGroupRows.length > 0) {
        fetchMappingsForGroup(selectedGroupRows[0].acctGrpCode);
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedGroupRows.length === 0) return toast.warn("Select a record");
    const target = selectedGroupRows[0];
    if (!window.confirm(`Delete ${target.acctGrpCode}?`)) return;

    setLoading(true);
    try {
      await axios.delete(`${backendUrl}/api/AcctGrp/delete`, {
        params: { acctGrpCd: target.acctGrpCode },
      });
      toast.success("Deleted successfully");
      fetchInitialData();
    } catch (e) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Mapping Logic ---
  const handleAddMapping = () => {
    const group = selectedGroupRows[0];

    // Validation
    if (!group?.acctGrpCode) {
      return toast.warn("Please select or enter a Group Code first");
    }
    if (selectedAccountRows.length === 0 || !selectedFunctionRow) {
      return toast.warn("Select Account and Function");
    }

    // Create new objects for the array
    const newMappings = selectedAccountRows.map((acc) => ({
      id: `new_${Date.now()}_${acc.acctId}`, // Unique ID for local list
      acctGroupCode: group.acctGrpCode,
      accountId: acc.acctId,
      acctName: acc.acctName,
      funcCode: selectedFunctionRow.funcCode,
      activeFlag: "Y",
      companyId: group.companyId || "1",
    }));

    // Append new mappings to existing list
    setMappingData((prev) => [...prev, ...newMappings]);

    // Clear selection to avoid duplicates
    setSelectedAccountRows([]);
    toast.success(`${newMappings.length} mapping(s) added to list`);
  };

  const handleRemoveMapping = (id) =>
    setMappingData((prev) => prev.filter((m) => m.id !== id));
  // Add this inside your ManageProjectAccountGroups component
  const currentIndex = acctGroups.findIndex(
    (f) => getRowKey(f) === getRowKey(selectedGroupRows[0] || {}),
  );

  const handleNavigate = (dir) => {
    const newIdx = dir === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIdx >= 0 && newIdx < acctGroups.length) {
      // Set the selected row to the new index
      setSelectedGroupRows([acctGroups[newIdx]]);
    }
  };

  const handleFieldChange = (rowId, field, value) => {
    // 1. Update the main list of groups
    const updatedGroups = acctGroups.map((row) =>
      getRowKey(row) === rowId
        ? { ...row, [field]: value, isDirty: true }
        : row,
    );
    setAcctGroups(updatedGroups);

    // 2. Sync the change to the selection state so the FormInput reflects the new value immediately
    setSelectedGroupRows((prev) =>
      prev.map((row) =>
        getRowKey(row) === rowId
          ? { ...row, [field]: value, isDirty: true }
          : row,
      ),
    );
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500">
      <MainContainer icon={LayoutGrid} title="Manage Project Account Groups">
        <Toolbar
          // 1. Core Data & View
          clipboard={clipboard}
          rowKey={"acctGrpCode"}
          isFormView={isFormView}
          totalRecords={acctGroups.length}
          loading={loading}
          // 2. Add Dirty State (Enables the Save button when changes exist)
          //   isDirty={
          //     acctGroups.some((f) => f.isDirty || f.tempId) ||
          //     mappingData.length > 0
          //   }
          isDirty={
            // Check if any existing row was modified
            acctGroups.some((f) => f.isDirty === true) ||
            // Check if there are any brand-new (unsaved) rows
            acctGroups.some((f) => f.isNew === true) ||
            // Check if there are unsaved mappings
            mappingData.some((m) => m.id.toString().startsWith("new_"))
          }
          // 3. Selection Logic (Match the reference's robust check)
          selectedRow={selectedGroupRows.length > 0 ? selectedGroupRows[0] : {}}
          // 4. Find & Replace / Navigation Props
          // (Ensure these states exist in your component or set to default if not used)
          columns={groupColumns} // Assuming groupColumns is defined as [{label, key}, ...]
          searchColumn={searchColumn || "acctGrpCode"}
          setSearchColumn={setSearchColumn}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          replaceValue={replaceValue}
          setReplaceValue={setReplaceValue}
          isReplaceMode={isReplaceMode}
          setIsReplaceMode={setIsReplaceMode}
          handleFind={handleFind}
          handleBulkReplace={handleBulkReplace}
          currentIndex={currentIndex}
          handleNavigate={handleNavigate}
          // 5. Actions
          actions={{
            onAdd: handleAdd,
            onSave: handleSave, // Make sure you have a handleSave function defined
            onToggleView: () => setIsFormView(!isFormView),
            onDelete: handleDelete,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleClear,
            onRefresh: fetchInitialData,
          }}
        />

        {isFormView ? (
          <div className="space-y-4 py-2">
            {/* {selectedGroupRows.length > 0 && (
              <div className="mb-2 text-sm text-gray-600">
                {selectedGroupRows.length} group(s) selected
              </div>
            )} */}

            {/* Top Form */}
            <FormSection>
              {/* title="Group Master Details" */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <FormInput
                  label="Group Code"
                  required
                  value={selectedGroupRows[0]?.acctGrpCode || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      getRowKey(selectedGroupRows[0]),
                      "acctGrpCode",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  label="Description"
                  value={selectedGroupRows[0]?.acctGrpDesc || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      getRowKey(selectedGroupRows[0]),
                      "acctGrpDesc",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  label="Active"
                  type="checkbox"
                  checked={selectedGroupRows[0]?.activeFl === "Y"}
                  onChange={(e) =>
                    handleFieldChange(
                      getRowKey(selectedGroupRows[0]),
                      "activeFl",
                      e.target.checked ? "Y" : "N",
                    )
                  }
                />
              </div>
            </FormSection>

            {/* Side by Side Selectors */}
          </div>
        ) : (
          /* List View */
          <div className="mt-2">
            <ReusableTable
              data={acctGroups}
              columns={groupColumns}
              selectedRows={selectedGroupRows}
              onRowSelect={(item) => {
                const isSelected = selectedGroupRows.some(
                  (r) => getRowKey(r) === getRowKey(item),
                );
                if (isSelected) {
                  setSelectedGroupRows(
                    selectedGroupRows.filter(
                      (r) => getRowKey(r) !== getRowKey(item),
                    ),
                  );
                } else {
                  // In list view, you might want to only select one at a time or many
                  setSelectedGroupRows([...selectedGroupRows, item]);
                }
              }}
              rowKey={getRowKey}
              maxHeight="max-h-[500px]"
              onFieldChange={handleFieldChange}
            />
          </div>
        )}
      </MainContainer>

      {selectedGroupRows.length > 0 && (
        <>
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SecondaryContainer title="Project Account">
                <div>
                  <ReusableTable
                    data={accounts}
                    columns={accountColumns}
                    // minHeight="min-h-48"
                    showCheckboxes={true}
                    selectedRows={selectedAccountRows}
                    onRowSelect={(item) => {
                      // Check if already selected
                      const isSelected = selectedAccountRows.some(
                        (r) => r.acctId === item.acctId,
                      );
                      if (isSelected) {
                        setSelectedAccountRows(
                          selectedAccountRows.filter(
                            (r) => r.acctId !== item.acctId,
                          ),
                        );
                      } else {
                        setSelectedAccountRows([...selectedAccountRows, item]);
                      }
                    }}
                    rowKey="acctId"
                  />
                </div>
              </SecondaryContainer>
              <SecondaryContainer title="Account Functions">
                <div>
                  <ReusableTable
                    data={functionCodes}
                    columns={funcColumns}
                    // minHeight="min-h-48"
                    showCheckboxes={true}
                    selectedRows={
                      selectedFunctionRow ? [selectedFunctionRow] : []
                    }
                    onRowSelect={(item) => {
                      // Toggle logic for single selection
                      if (selectedFunctionRow?.id === item.id) {
                        setSelectedFunctionRow(null);
                      } else {
                        setSelectedFunctionRow(item);
                      }
                    }}
                    rowKey="id"
                    showCheckboxesHeader={false}
                  />
                  {/* Add Mapping Button */}
                  <ActionDetailButton label="Add" onClick={handleAddMapping} />
                </div>
              </SecondaryContainer>
            </div>
          </div>

          <SecondaryContainer title="Selected Project Accounts  ">
            {/* Final Mapping Table */}
            <div>
              <ReusableTable
                data={mappingData}
                columns={mappingColumns}
                rowKey="id"
                maxHeight="max-h-64"
                showCheckboxes={false}
                // This handles the Search-Select updates
                onFieldChange={(id, field, valueObj) => {
                  // For account selects, we usually want the ID
                  const val =
                    typeof valueObj === "object" ? valueObj.acctId : valueObj;
                  handleMappingFieldChange(id, field, val);
                }}
                renderEmptyState={() => (
                  <div className="py-8 text-center bg-gray-50/50 rounded-lg">
                    <p className="text-[11px] font-bold text-gray-400 tracking-widest">
                      No Mappings
                    </p>
                  </div>
                )}
              />
              {mappingData.length > 0 && (
                <div className="px-3 py-2 bg-gray-50 border-t flex gap-2 flex-wrap">
                  {mappingData.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleRemoveMapping(m.id)}
                      className="px-2 py-1 bg-red-50 text-red-600 text-[9px] font-semibold rounded hover:bg-red-100 transition-all"
                    >
                      ✕ {m.acctName} ({m.funcCode})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </SecondaryContainer>
        </>
      )}
    </div>
  );
};

export default ManageProjectAccountGroups;
