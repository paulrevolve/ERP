import { backendUrl } from "./config";
import { toast } from "react-toastify";
import { Building2 } from "lucide-react";
import Select from "react-select";
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ActionDetailButton,
  FormInput,
  FormSearchSelect,
  FormSection,
} from "../helper/formSection";
import { TableSearchSelect } from "../helper/tableSection";

const ApproveVendorEmployee = ({ canEdit }) => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTermType, setSearchTermType] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Column keys based on your C# 'Account' model
  const columns = [
    "vendApprvlCd", // Editable via dropdown
    "vendId",
    "vendName",
    "vendGrpCd",
    "payApprovalCode",
    "payVendId",
    "payVendName",
  ];

  const COLUMN_LABELS = {
    vendApprvlCd: "Approve Status",
    vendId: "Vendor",
    vendName: "Active SAM.gov Exclusion",
    vendGrpCd: "Vendor Employee",
    payApprovalCode: "Vendor Employee Name",
    payVendId: "Approver",
    payVendName: "Status Date",
  };

  const approvalCode = [
    { label: "Select", value: "" },
    { label: "Pending", value: "P" },
    { label: "Approved", value: "A" },
    { label: "Rejected", value: "N" },
  ];
  const payApprovalCode = [
    { label: "Select", value: "" },
    { label: "Pending", value: "P" },
    { label: "Approved", value: "A" },
    { label: "Rejected", value: "N" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "24px",
      height: "24px",
      backgroundColor: state.isDisabled ? "#fcfcfc" : "#ffffff",
      color: state.isDisabled ? "##D9DCE3" : "back",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      boxShadow: "none",
      borderColor: state.isFocused ? "#ccc" : "#ccc",
      "&:hover": {
        borderColor: "#ccc",
      },
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

  const handleBulkApprove = (code) => {
    if (data.length === 0) return;

    // Determine scope: if user has selected specific rows, only update those.
    // Otherwise, update the entire dataset.
    const updateAll = selectedRows.size === 0;

    const updatedData = data.map((row) => {
      if (updateAll || selectedRows.has(row.vendId)) {
        return { ...row, vendApprvlCd: code };
      }
      return row;
    });

    setData(updatedData);
    setIsDirty(true);

    // If we updated everything, it's helpful to select them all for the user
    if (updateAll) {
      setSelectedRows(new Set(data.map((row) => row.vendId)));
    }

    const scopeText = updateAll ? "All vendors" : "Selected vendors";
    const statusText = code === "A" ? "Approved" : "Not Approved";
    toast.info(`${scopeText} set to ${statusText}`);
  };

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      // Note: Added page=1 and a high pageSize as per your snippet
      const response = await axios.get(
        `${backendUrl}/api/vendor-transactions/GetAllVendors?page=1&pageSize=9999&sortBy=vend_id&sortOrder=asc`,
      );

      // Based on your previous JSON: { data: [...] }
      const fetchedData = response.data.data || [];
      setData(fetchedData);
      setIsDirty(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load vendor data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // 3. Selection & Table Logic
  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((row) => row.vendId)));
    }
  };

  const toggleRow = (vendId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(vendId)) newSelected.delete(vendId);
    else newSelected.add(vendId);
    setSelectedRows(newSelected);
  };

  const handleTableChange = (vendId, field, value) => {
    setData((prev) =>
      prev.map((row) =>
        row.vendId === vendId ? { ...row, [field]: value } : row,
      ),
    );

    // Automatically select the row if it's being edited
    // This ensures handleSave picks it up even if the checkbox wasn't clicked
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.add(vendId);
      return newSet;
    });

    setIsDirty(true);
  };

  const handleSave = async () => {
    // 1. Filter only rows that the user checked
    const selectedData = data.filter((row) => selectedRows.has(row.vendId));

    if (selectedData.length === 0) {
      return toast.warning("Please select vendors to update");
    }

    // 2. Map data to match the API Schema: [{ vendId, companyId, vendApprvlCd }]
    const payload = selectedData.map((row) => ({
      vendId: row.vendId,
      // Use the companyId from your data or the user object
      companyId: row.companyId || user.companyId || "1",
      vendApprvlCd: row.vendApprvlCd,
    }));

    try {
      await axios.put(
        `${backendUrl}/api/vendor-transactions/BulkUpdateVendorApproval`,
        payload,
      );
      toast.success("Vendors updated successfully");
      setIsDirty(false);
      fetchVendors(); // Refresh data
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Error saving changes");
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer title="Approve Vendor Employess">
        <FormSection>
          <FormInput label="Approver" value={user.name} readOnly></FormInput>
        </FormSection>
      </MainContainer>
      <MainContainer icon={Building2} title="Vendor Employees">
        <Toolbar
          actions={{
            onSave: handleSave,
          }}
          //   isDirty={isFormDirty || isTableDirty}
          //   loading={isAnyLoading}
        />

        <div className="flex gap-1">
          <ActionDetailButton
            label="Approve"
            onClick={() => handleBulkApprove("A")}
          />
          <ActionDetailButton
            label="Set to Pending"
            onClick={() => handleBulkApprove("P")}
          />
        </div>

        <div className={`overflow-x-auto max-h-[35vh] `}>
          <table className="min-w-full text-sm border border-gray-300 rounded">
            <thead className="bg-gray-200 sticky top-0 z-10 ">
              <tr>
                {/* {canEdit("manageAccount") && ( */}
                <th className="th-thead w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                {/* )} */}
                {columns.map((col) => {
                  // List of columns that should have a "Check All" header

                  const isRequired = [
                    "approvalCode",
                    "payApprovalCode",
                  ].includes(col);

                  return (
                    <th key={col} className="th-thead">
                      <div className="flex">
                        <span>{COLUMN_LABELS[col] || col}</span>
                        <span className="text-red-500">
                          {isRequired ? "*" : ""}
                        </span>
                      </div>
                      {/* </div> */}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.vendId}
                  className={`hover:bg-blue-50 transition-colors ${selectedRows.has(row.vendId) ? "bg-blue-50/50" : ""}`}
                >
                  <td className="tbody-td">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.vendId)}
                      onChange={() => toggleRow(row.vendId)}
                    />
                  </td>

                  <td className="tbody-td text-center min-w-[150px]">
                    <TableSearchSelect
                      options={approvalCode}
                      value={row.vendApprvlCd}
                      displayKey="label" // This tells the component to show "Approved"
                      secondaryKey="value" // This shows the code in the dropdown list
                      onSelect={(selectedOption) =>
                        handleTableChange(
                          row.vendId,
                          "vendApprvlCd",
                          selectedOption.value,
                        )
                      }
                    />
                  </td>

                  {/* READ ONLY FIELDS */}
                  <td className="tbody-td text-center">{row.vendId}</td>

                  {/* Read Only: Vendor Name */}
                  <td className="tbody-td text-center">{row.vendName}</td>
                  <td className="tbody-td text-center">{row.vendGrpCd}</td>

                  {/* EDITABLE DROPDOWNS */}
                  <td className="tbody-td text-center min-w-[150px]">
                    <TableSearchSelect
                      options={payApprovalCode}
                      value={row.vendApprvlCd}
                      displayKey="label" // This tells the component to show "Approved"
                      secondaryKey="value" // This shows the code in the dropdown list
                      onSelect={(selectedOption) =>
                        handleTableChange(
                          row.vendId,
                          "payApprovalCode",
                          selectedOption.value,
                        )
                      }
                    />
                  </td>

                  <td className="tbody-td text-center">{row.vendId}</td>

                  {/* Read Only: Vendor Name */}
                  <td className="tbody-td text-center">{row.vendName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MainContainer>
    </div>
  );
};

export default ApproveVendorEmployee;
