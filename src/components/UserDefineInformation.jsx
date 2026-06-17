import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { backendUrl } from "./config";
import { ActionButton, MainContainer } from "../helper/container";
import { Save } from "lucide-react";

const UserDefineInformation = ({ master = "ACCOUNT" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [labelData, setLabelData] = useState([]);

  // Fetch Employees or Accounts based on master type
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        let url =
          master === "EMPLOYEE"
            ? `${backendUrl}/Employee/GetAllEmployees`
            : master === "ORGANIZATION"
              ? `${backendUrl}/Orgnization/GetAllOrgs`
              : master === "VENDOR"
                ? `${backendUrl}/api/vendor-transactions?page=1&pageSize=2000&sortBy=vend_id&sortOrder=asc`
                : `${backendUrl}/api/Account/GetAllAccounts`;

        const res = await api.get(url);
        const response = master === "VENDOR" ? res.data.data : res.data;
        if (response) {
          const formattedData = response.map((item) => ({
            id:
              master === "EMPLOYEE"
                ? item.empId
                : master === "ORGANIZATION"
                  ? item.orgId
                  : master === "VENDOR"
                    ? item.vendor.vendId
                    : item.acctId,
            name:
              master === "EMPLOYEE"
                ? item.empName
                : master === "ORGANIZATION"
                  ? item.orgName
                  : master === "VENDOR"
                    ? item.vendor.vendName
                    : item.acctName,
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Data Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
    setSelectedId(null);
  }, [master]);

  // Fetch Labels
  const fetchAccountLabels = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(
        `${backendUrl}/api/UserDefinedLabels/GetUdefValuesBYEntityId?tableId=${master}&entityId=${selectedId}&companyId=1`,
      );
      if (res.data) {
        // Initialize rows with an empty values array if not present
        const initializedLabels = res.data.map((label) => ({
          ...label,
          values: label.values || [],
        }));
        setLabelData(initializedLabels);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountLabels();
  }, [selectedId]);

  const handleCheckboxChange = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const handleValueChange = (rowId, clickedValue, isMulti) => {
    setLabelData((prevData) =>
      prevData.map((row) => {
        if (row.id === rowId) {
          let newValues;
          if (isMulti) {
            const currentValues = row.values || [];
            newValues = currentValues.includes(clickedValue)
              ? currentValues.filter((v) => v !== clickedValue)
              : [...currentValues, clickedValue];
          } else {
            newValues = [clickedValue];
          }
          return { ...row, values: newValues };
        }
        return row;
      }),
    );
  };

  const handleSave = async () => {
    if (!selectedId) {
      alert("Please select a record first.");
      return;
    }

    // 1. Construct the Request Body based on the Swagger Schema
    // The API expects: [{ fieldId, genId, fieldName, dataType, isMultiSelect, values: [] }]
    const requestBody = labelData.map((row) => ({
      fieldId: row.id || 0, // Mapped to Swagger 'fieldId'
      // genId: selectedId || "", // Mapped to Swagger 'genId'
      // fieldName: row.fieldName, // Mapped to Swagger 'fieldName'
      // dataType: row.dataType, // Mapped to Swagger 'dataType'
      // isMultiSelect: row.isMultiSelect || false, // Mapped to Swagger 'isMultiSelect'
      // options: row.options,
      values: row.values || [], // Mapped to Swagger 'values' (Array of strings)
    }));

    console.log("Saving Request Body:", requestBody);

    try {
      setIsLoading(true);

      // 2. Construct the URL with Query Parameters as seen in Swagger
      // Swagger shows parameters: entityId, tableId, companyId
      const queryParams = new URLSearchParams({
        entityId: String(selectedId), // The ID of the employee/account selected
        tableId: master, // 'EMPLOYEE' or 'ACCOUNT'
        companyId: "1", // Hardcoded or from your auth context
      }).toString();

      const url = `${backendUrl}/api/UserDefinedLabels/udefV1?${queryParams}`;

      // 3. Make the POST request
      const response = await api.post(url, requestBody);

      if (response.status === 200 || response.status === 201) {
        alert("Information saved successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to save information.";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 mt-10 space-y-4 animate-in z-10 fade-in duration-500">
      {/* Table 1: Master Selection */}
      <div className="">
        <MainContainer
          title={
            master === "EMPLOYEE"
              ? "Employee List"
              : master === "ORGANIZATION"
                ? "Organization List"
                : master === "VENDOR"
                  ? "Vendor list"
                  : "Account List"
          }
        >
          <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-10">Select</th>
                  <th className="th-thead">ID</th>
                  <th className="th-thead">Name</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {data?.map((dt) => (
                  <tr
                    key={dt.id}
                    className={`tr-tbody w-10 ${selectedId === dt.id ? "bg-blue-50" : ""}`}
                  >
                    <td className="tbody-td text-center">
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-blue-500"
                        checked={selectedId === dt.id}
                        onChange={() => handleCheckboxChange(dt.id)}
                      />
                    </td>
                    <td className="tbody-td text-center">{dt.id}</td>
                    <td className="tbody-td text-center">{dt.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MainContainer>
      </div>

      {/* Table 2: Conditional Rendering - Only shows when a row is selected */}
      <MainContainer title={`User Defined Information`}>
        <div className="flex justify-end mb-1 mr-2">
          <ActionButton icon={Save} onClick={handleSave} />
        </div>
        <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
          <table className="min-w-full table-auto divide-gray-200">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="th-thead w-14">Sequence</th>
                <th className="th-thead w-14">Data Type</th>
                <th className="th-thead">Label</th>
                <th className="th-thead">Value</th>
                <th className="th-thead">Multi</th>
                <th className="th-thead">Req.</th>
              </tr>
            </thead>
            {selectedId && (
              <tbody className="tbody">
                {labelData.map((lvl) => (
                  <tr key={lvl.id} className="tr-tbody">
                    <td className="tbody-td text-center w-14">{lvl.id}</td>
                    <td className="tbody-td text-center w-14">
                      {lvl.dataType === "L"
                        ? "List"
                        : lvl.dataType === "T"
                          ? "Text"
                          : "Number"}
                    </td>
                    <td className="tbody-td text-center">{lvl.fieldName}</td>

                    <td className="tbody-td text-center">
                      {lvl.options && lvl.options.length > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-center w-full">
                          {lvl.isMultiSelect ? (
                            /* --- RENDER CHECKBOXES FOR MULTI-SELECT --- */
                            <select
                              multiple
                              className="td-input min-h-[24px] py-1 text-[10px]"
                              value={
                                Array.isArray(lvl.values) ? lvl.values : []
                              }
                              onMouseDown={(e) => {
                                e.preventDefault(); // Prevent the default "select only" behavior

                                const clickedValue = e.target.value;
                                if (!clickedValue) return;

                                const currentValues = Array.isArray(lvl.values)
                                  ? [...lvl.values]
                                  : [];
                                const index =
                                  currentValues.indexOf(clickedValue);

                                let nextValues;
                                if (index > -1) {
                                  // If already there, remove it (Unselect)
                                  nextValues = currentValues.filter(
                                    (v) => v !== clickedValue,
                                  );
                                } else {
                                  // If not there, add it (Select)
                                  nextValues = [...currentValues, clickedValue];
                                }

                                handleValueChange(lvl.id, nextValues[0], true);
                                // setIsDirty(true);
                              }}
                            >
                              {lvl.options.map((opt) => (
                                <option
                                  key={opt.value}
                                  value={opt.value}
                                  className="py-0.5 checked:bg-blue-500 checked:text-white cursor-pointer"
                                >
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            /* --- RENDER DROPDOWN FOR SINGLE-SELECT --- */
                            <select
                              className="td-input"
                              value={lvl.values?.[0] || ""} // Values is usually an array, take the first item
                              onChange={(e) =>
                                handleValueChange(
                                  lvl.id,
                                  e.target.value,
                                  false, // isMultiSelect is false
                                )
                              }
                            >
                              <option value="">Select</option>
                              {lvl.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      ) : (
                        <input
                          type={lvl.dataType === "N" ? "number" : "text"}
                          className="td-input"
                          placeholder="Enter value..."
                          value={lvl.values?.[0] || ""}
                          onChange={(e) =>
                            handleValueChange(lvl.id, e.target.value, false)
                          }
                        />
                      )}
                    </td>

                    <td className="tbody-td text-center">
                      {lvl.isMultiSelect ? "Y" : "N"}
                    </td>
                    <td className="tbody-td text-center">
                      {lvl.isRequired ? "Y" : "N"}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </MainContainer>
    </div>
  );
};

export default UserDefineInformation;
