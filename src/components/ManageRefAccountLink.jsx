import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { backendUrl } from "./config";
import { MainContainer, Toolbar } from "../helper/container";
import { Building2, CircleUser } from "lucide-react";
import {
    FormInput,
    FormSearchSelect,
    FormSection,
} from "../helper/formSection";
import { toast } from "react-toastify";
import { TableSearchSelect } from "../helper/tableSection";

const getCompanyId = () => {
    try {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        return user?.companyId || "1";
    } catch (e) {
        return "1";
    }
};

const AccountLink = () => {
    const [accounts, setAccounts] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [searchAccTerm, setSearchAccTerm] = useState("");
    const [searchOrgTerm, setSearchOrgTerm] = useState("");
    const [currentAccPage, setCurrentAccPage] = useState(1);
    const [pageAccSize, setPageAccSize] = useState(15);
    const [currentOrgPage, setCurrentOrgPage] = useState(1);
    const [pageOrgSize, setPageOrgSize] = useState(15);

    // New parameters for dynamic RefStruc integration
    const [refPage, setRefPage] = useState(1);
    const [refSize, setRefSize] = useState(100);
    const [refStrucLinks, setRefStrucLinks] = useState([]);
    const [allRefStrucs, setAllRefStrucs] = useState([]);

    const [loading, setLoading] = useState(false);
    const [selectedAccIds, setSelectedAccIds] = useState([]);
    const [selectedOrgIds, setSelectedOrgIds] = useState([]);
    const [isFormView, setIsFormView] = useState(true);
    const [linkedData, setLinkedData] = useState([]);
    const [activeRowIndex, setActiveRowIndex] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [searchAcc, setSearchAcc] = useState("");
    const [searchOrg, setSearchOrg] = useState("");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [selectedLinks, setSelectedLinks] = useState(new Set());
    const [searchRef, setSearchRef] = useState("");

    const getLinkKey = (row) => `${row.acctId || row.tempId}|${row.orgId}`;

    // Change these at the top of your component
    const normalizeOptionId = (opt, key) => {
        return (
            opt?.[key] ?? opt?.acctId ?? opt?.orgId ?? opt?.id ?? opt?.value ?? ""
        );
    };

    const normalizeOptionName = (opt, key) => {
        return (
            opt?.[key] ??
            opt?.acctName ??
            opt?.orgName ??
            opt?.name ??
            opt?.label ??
            ""
        );
    };

    const handleDeleteSelected = async () => {
        // 1. Identify rows based on the keys in the selectedLinks Set
        // We use the same composite key: "acctId|orgId"
        const rowsToDelete = linkedData.filter((row) => {
            const key = `${row.acctId}|${row.orgId}`;
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
            // 3. Loop through filtered rows and delete sequentially
            for (const row of rowsToDelete) {
                try {
                    // Construct the URL using row data
                    const response = await api.delete(
                        `${backendUrl}/api/Account/DeleteOrgAccount?orgId=${row.orgId}&acctId=${row.acctId}`,
                    );

                    if (response.status === 200 || response.status === 204) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (err) {
                    console.error(
                        `Failed to delete mapping: ${row.acctId} - ${row.orgId}`,
                        err,
                    );
                    errorCount++;
                }
            }

            // 4. Update the UI and clean up state
            if (successCount > 0) {
                toast.success(`Successfully deleted ${successCount} mapping(s).`);

                // Remove the rows that were just successfully deleted
                setLinkedData((prev) =>
                    prev.filter((row) => {
                        const key = `${row.acctId}|${row.orgId}`;
                        return !selectedLinks.has(key);
                    }),
                );

                // 5. Reset selection and active row states
                setSelectedLinks(new Set()); // Clear checkboxes
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
            const url = `${backendUrl}/Orgnization/GetAllOrgAccounts`;
            const res = await api.get(url);

            if (res.data) {
                // Sort purely descending by timeStamp so latest additions appear at the very top
                const sortedData = res.data.sort((a, b) => {
                    const timeA = a.timeStamp ? new Date(a.timeStamp).getTime() : 0;
                    const timeB = b.timeStamp ? new Date(b.timeStamp).getTime() : 0;
                    return timeB - timeA;
                });

                // Map the API response to your local state structure
                setLinkedData(sortedData);

                if (sortedData.length > 0) {
                    const firstSelected = `${sortedData[0].acctId || sortedData[0].tempId}|${sortedData[0].orgId}`;
                    setSelectedLinks(new Set([firstSelected]));
                }
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
            // setLinkedData([])
            setCurrentIndex(0);
        }
    }, [linkedData, activeRowIndex]);

    useEffect(() => {
        const getAccoutns = async () => {
            setLoading(true);
            const term = searchAccTerm.trim();
            try {
                const url = `${backendUrl}/api/Account/GetAllAccounts`;
                const res = await api.get(url);

                if (res.data) {
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

    const fetchRefStrucLinks = async () => {
        try {
            const url = `${backendUrl}/api/RefStruc/org-acct-ref-struc/paged?page=${refPage}&size=${refSize}`;
            const res = await api.get(url);
            if (res.data) {
                const items = res.data.items || res.data.data || res.data;
                if (Array.isArray(items)) {
                    setRefStrucLinks(items);
                }
            }
        } catch (error) {
            console.error("Error fetching RefStruc links:", error);
        }
    };

    const fetchAllRefStrucs = async () => {
        try {
            const res = await api.get(`${backendUrl}/api/RefStruc`);
            if (res.data) {
                setAllRefStrucs(res.data);
            }
        } catch (error) {
            console.error("Error fetching all RefStrucs:", error);
        }
    };

    // New useEffect to fetch dynamic RefStruc Links GET API
    useEffect(() => {
        fetchRefStrucLinks();
        fetchAllRefStrucs();
    }, [refPage, refSize]);

    useEffect(() => {
        if (accounts.length > 0 && organizations.length > 0 && linkedData.length > 0) {
            let needsUpdate = false;
            const enriched = linkedData.map(row => {
                let updated = { ...row };
                if (row.acctId) {
                    const matchedAcc = accounts.find(a => String(a.acctId) === String(row.acctId));
                    if (matchedAcc) {
                        if (updated.acctName !== matchedAcc.acctName) {
                            updated.acctName = matchedAcc.acctName;
                            needsUpdate = true;
                        }
                        // Set the active flag from the Account API for existing untouched records
                        if (!row.isNew && updated.activeFlag !== matchedAcc.activeFlag) {
                            updated.activeFlag = matchedAcc.activeFlag || "N";
                            needsUpdate = true;
                        }
                    }
                }
                if (!row.orgName && row.orgId) {
                    const matchedOrg = organizations.find(o => String(o.orgId) === String(row.orgId));
                    if (matchedOrg) {
                        updated.orgName = matchedOrg.orgName;
                        needsUpdate = true;
                    }
                }

                // Dynamic integration from GET API
                if (refStrucLinks && refStrucLinks.length > 0) {
                    const matchedRef = refStrucLinks.find(
                        (r) => String(r.orgId) === String(row.orgId) && String(r.acctId) === String(row.acctId)
                    );
                    if (matchedRef) {
                        if (updated.refNo !== matchedRef.refStrucId) {
                            updated.refNo = matchedRef.refStrucId;
                            needsUpdate = true;
                        }

                        if (allRefStrucs && allRefStrucs.length > 0) {
                            const actualRef = allRefStrucs.find(r => String(r.refStrucId) === String(matchedRef.refStrucId));
                            if (actualRef && updated.refName !== actualRef.refStrucName) {
                                updated.refName = actualRef.refStrucName;
                                needsUpdate = true;
                            }
                        }
                    }
                }

                return updated;
            });

            if (needsUpdate) {
                setLinkedData(enriched);
            }
        }
    }, [accounts, organizations, linkedData, refStrucLinks, allRefStrucs]);

    const handleAddNew = () => {
        const hasUnsavedNewRow = linkedData.some((item) => item.isNew === true);

        if (hasUnsavedNewRow) {
            toast.warn("Please save or discard the current new entry before adding another.");
            return;
        }

        const newRow = {
            refNo: "",
            refName: "",
            acctId: "",
            acctName: "",
            orgId: "",
            orgName: "",
            activeFlag: "Y",
            isNew: true,
            tempId: Date.now(),
        };

        setLinkedData((prev) => [newRow, ...prev]);

        setActiveRowIndex(0);
        setActiveRow(newRow);
        if (typeof setCurrentIndex === "function") setCurrentIndex(0);
        // Note: Do not force setIsFormView(true) here to maintain user's current view
    };

    const handleSave = async () => {
        // 1. Identify only the new records
        const newRecords = linkedData.filter((item) => item.isNew === true);

        if (newRecords.length === 0) {
            toast.info("No new records to save.");
            return;
        }

        // 2. Validate that required IDs are present before saving
        const invalidRows = newRecords.filter((row) => !row.acctId || !row.orgId);
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
                refNo: item.refNo || null,
                refName: item.refName || null,
                acctId: item.acctId,
                acctName: item.acctName || null,
                orgId: item.orgId,
                orgName: item.orgName || null,
                activeFlag: item.activeFlag === "Y" ? "Y" : "N",
                companyId: getCompanyId()
            }));

            // 4. API Call
            const res = await api.post(
                `${backendUrl}/api/Account/SyncOrgAccounts`,
                payload,
            );

            // New POST integration for RefStruc without breaking existing logic
            try {
                const refStrucPayload = newRecords.map((item) => {
                    return {
                        orgId: item.orgId || "",
                        acctId: item.acctId || "",
                        refStrucId: item.refNo || "",
                        companyId: getCompanyId(), 
                        modifiedBy: "SystemUser",
                        timeStamp: new Date().toISOString().split('T')[0],
                        rowVersion: 0,
                        refStruc: {
                            refStrucId: item.refNo || "",
                            companyId: getCompanyId(),
                            refStrucName: item.refName || "",
                            refStrucTopFl: "N",
                            refDataEntryFl: "Y",
                            sRefEntryCd: "1",
                            modifiedBy: "SystemUser",
                            timeStamp: new Date().toISOString().split('T')[0],
                            rowVersion: 0
                        }
                    };
                });

                await api.post(
                    `${backendUrl}/api/RefStruc/sync-org-acct-ref-struc`,
                    refStrucPayload
                );
            } catch (refErr) {
                console.error("Secondary POST RefStruc Error:", refErr);
            }

            if (res.status === 200 || res.status === 201) {
                toast.success("New links saved successfully!");

                // 5. Update local state: remove 'isNew' status or refresh data
                // setLinkedData((prev) =>
                //   prev.map((item) => (item.isNew ? { ...item, isNew: false } : item)),
                // );
                fetchLinkedData();
                fetchRefStrucLinks();
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
            return x.acctId === activeRow?.acctId && x.orgId === activeRow?.orgId;
        });

        console.log(idx);

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

        console.log(direction);
        console.log(newIdx);

        // 3. Update if the index actually changed
        if (newIdx !== idx) {
            const nextRecord = linkedData[newIdx];
            console.log(nextRecord);

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
        if (!activeRow) {
            // If they discard when nothing is selected but there might be a new row somewhere
            const newRowIndex = linkedData.findIndex(r => r.isNew);
            if (newRowIndex !== -1) {
                const isConfirmed = window.confirm("Are you sure you want to discard the new entry?");
                if (!isConfirmed) return;
                setLinkedData(prev => prev.filter(r => !r.isNew));
                setIsFormDirty(false);
                toast.success("Discarded new entry.");
            }
            return;
        }

        const isConfirmed = window.confirm(
            "Are you sure you want to discard changes?",
        );
        if (!isConfirmed) return;

        if (activeRow.isNew) {
            setLinkedData((prevData) => {
                const filteredData = prevData.filter(
                    (item) => item.tempId !== activeRow.tempId,
                );

                if (filteredData.length > 0) {
                    setActiveRowIndex(0);
                    setActiveRow(filteredData[0]);
                } else {
                    setActiveRowIndex(null);
                    setActiveRow(null);
                }

                setIsFormDirty(false);
                return filteredData;
            });
            toast.success("Discarded new entry.");
        } else {
            // Re-fetch to guarantee pristine state for existing rows
            fetchLinkedData();
            setIsFormDirty(false);
            toast.success("Discarded unsaved changes.");
        }
    };

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

    return (
        <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
            <MainContainer icon={CircleUser} title="Link Account/Organization">
                <Toolbar
                    isFormView={isFormView}
                    currentIndex={currentIndex}
                    totalRecords={linkedData.length}
                    handleNavigate={handleNavigate}
                    jumpToCode={jumpToCode}
                    selectedRow={activeRow}
                    isDirty={isFormDirty}
                    buttonsDisable={["copy", "paste"]}
                    // hasSelectedRows={linkedData.some((row) => row.isSelected)}
                    // Use this if you are using the Set approach
                    hasSelectedRows={selectedLinks.size > 0}
                    actions={{
                        onAdd: handleAddNew, // Pass the function directly instead of wrapping it in an object
                        onSave: handleSave,
                        onDelete: handleDeleteSelected,
                        onDiscard: handleDiscard,
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
                                {/* Reference Group */}
                                <div className="flex gap-2 items-end">
                                    <FormSearchSelect
                                        label="Reference Number *"
                                        value={activeRow?.refNo}
                                        disabled={!activeRow?.isNew}
                                        searchTerm={searchRef}
                                        setSearchTerm={setSearchRef}
                                        options={allRefStrucs.filter(
                                            (t) =>
                                                String(t.refStrucId)
                                                    .toLowerCase()
                                                    .includes(searchRef.toLowerCase()) ||
                                                String(t.refStrucName)
                                                    .toLowerCase()
                                                    .includes(searchRef.toLowerCase()),
                                        )}
                                        displayKey="refStrucId"
                                        secondaryKey="refStrucName"
                                        onSelect={(opt) => {
                                            if (activeRowIndex !== null) {
                                                handleFieldChange(
                                                    activeRowIndex,
                                                    "refNo",
                                                    opt?.refStrucId || "",
                                                );
                                                handleFieldChange(
                                                    activeRowIndex,
                                                    "refName",
                                                    opt?.refStrucName || "",
                                                );
                                            }
                                        }}
                                    />
                                    <FormInput
                                        label="Reference Name"
                                        value={activeRow?.refName || ""}
                                        readOnly
                                        placeholder="Reference Name"
                                        className="flex-[2] bg-gray-50"
                                    />
                                </div>

                                {/* Active Flag */}
                                <div className="flex gap-2 items-center h-full">
                                    <div className="flex items-center gap-2 mb-2 ml-4">
                                        <input
                                            type="checkbox"
                                            checked={activeRow?.activeFlag === "Y"}
                                            disabled={!activeRow?.isNew}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    activeRowIndex,
                                                    "activeFlag",
                                                    e.target.checked ? "Y" : "N",
                                                )
                                            }
                                            className="w-4 h-4 mt-1"
                                            name="Active"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Active</label>
                                    </div>
                                </div>

                                {/* Account Group */}
                                <div className="flex gap-2 items-end">
                                    <FormSearchSelect
                                        label="Account"
                                        value={activeRow?.acctId}
                                        disabled={!activeRow?.isNew}
                                        searchTerm={searchAcc}
                                        setSearchTerm={setSearchAcc}
                                        options={accounts.filter(
                                            (t) =>
                                                String(t.acctId)
                                                    .toLowerCase()
                                                    .includes(searchAcc.toLowerCase()) ||
                                                t.acctName
                                                    .toLowerCase()
                                                    .includes(searchAcc.toLowerCase()),
                                        )}
                                        displayKey="acctId"
                                        secondaryKey="acctName"
                                        onSelect={(opt) => {
                                            if (activeRowIndex !== null) {
                                                // Pass 'acctId' as the preferred key
                                                handleFieldChange(
                                                    activeRowIndex,
                                                    "acctId",
                                                    normalizeOptionId(opt, "acctId"),
                                                );
                                                handleFieldChange(
                                                    activeRowIndex,
                                                    "acctName",
                                                    normalizeOptionName(opt, "acctName"),
                                                );
                                                // Store the entire option if possible, specifically activeFlag
                                                handleFieldChange(
                                                    activeRowIndex,
                                                    "activeFlag",
                                                    opt?.activeFlag || "Y",
                                                );
                                            }
                                        }}
                                    />
                                    <FormInput
                                        label="Account Name"
                                        value={activeRow?.acctName || ""}
                                        readOnly
                                        placeholder="Account Name"
                                        className="flex-[2] bg-gray-50"
                                    />
                                </div>

                                {/* Organization Group */}
                                <div className="flex gap-2 items-end">
                                    <FormSearchSelect
                                        label="Organization"
                                        value={activeRow?.orgId}
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
                                        label="Organization Name"
                                        value={activeRow?.orgName || ""}
                                        readOnly
                                        placeholder="Organization Name"
                                        className="flex-[2] bg-gray-50"
                                    />
                                </div>
                            </div>
                        </FormSection>

                        {/* Form Section Removed */}
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
                                    <th className="th-thead w-32">Reference Number</th>
                                    <th className="th-thead min-w-[150px]">Reference Name</th>
                                    <th className="th-thead min-w-[160px]">Account</th>
                                    <th className="th-thead min-w-[150px]">Account Name</th>
                                    <th className="th-thead min-w-[160px]">Organization</th>
                                    <th className="th-thead min-w-[150px]">Organization Name</th>
                                    <th className="th-thead w-16 text-center">Active</th>
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

                                            {/* Reference Number */}
                                            <td className="tbody-td">
                                                <TableSearchSelect
                                                    id={index}
                                                    value={row.refNo || ""}
                                                    disabled={!row?.isNew}
                                                    options={allRefStrucs}
                                                    displayKey="refStrucId"
                                                    secondaryKey="refStrucName"
                                                    onSelect={(opt, rowId) => {
                                                        handleFieldChange(
                                                            rowId,
                                                            "refNo",
                                                            opt?.refStrucId || "",
                                                        );
                                                        handleFieldChange(
                                                            rowId,
                                                            "refName",
                                                            opt?.refStrucName || "",
                                                        );
                                                    }}
                                                />
                                            </td>

                                            {/* Reference Name */}
                                            <td className="tbody-td">
                                                <input
                                                    type="text"
                                                    className="td-input bg-gray-50"
                                                    value={row.refName || ""}
                                                    disabled
                                                />
                                            </td>

                                            {/* Account */}
                                            <td className="tbody-td">
                                                <TableSearchSelect
                                                    id={index}
                                                    value={row.acctId || ""}
                                                    disabled={!row?.isNew}
                                                    options={accounts}
                                                    displayKey="acctId"
                                                    secondaryKey="acctName"
                                                    onSelect={(opt, rowId) => {
                                                        handleFieldChange(
                                                            rowId,
                                                            "acctId",
                                                            normalizeOptionId(opt, "acctId"),
                                                        );
                                                        handleFieldChange(
                                                            rowId,
                                                            "acctName",
                                                            normalizeOptionName(opt, "acctName"),
                                                        );
                                                        handleFieldChange(
                                                            rowId,
                                                            "activeFlag",
                                                            opt?.activeFlag || "Y",
                                                        );
                                                    }}
                                                />
                                            </td>

                                            {/* Account Name */}
                                            <td className="tbody-td">
                                                <input
                                                    type="text"
                                                    className="td-input bg-gray-50"
                                                    value={row.acctName || ""}
                                                    disabled
                                                />
                                            </td>

                                            {/* Organization */}
                                            <td className="tbody-td">
                                                <TableSearchSelect
                                                    id={index}
                                                    value={row.orgId || ""}
                                                    disabled={!row?.isNew}
                                                    options={organizations}
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

                                            {/* Organization Name */}
                                            <td className="tbody-td">
                                                <input
                                                    type="text"
                                                    className="td-input bg-gray-50"
                                                    value={row.orgName || ""}
                                                    disabled
                                                />
                                            </td>

                                            {/* Active Checkbox */}
                                            <td className="tbody-td text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={row.activeFlag === "Y"}
                                                    disabled={!row?.isNew}
                                                    onChange={(e) =>
                                                        handleFieldChange(index, "activeFlag", e.target.checked ? "Y" : "N")
                                                    }
                                                    className="w-3 h-3 mt-1"
                                                />
                                            </td>
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

export default AccountLink;
