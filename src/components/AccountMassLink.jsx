import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { backendUrl } from "./config";
import {
  ActionButton,
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import { Building2, CircleUser, Save } from "lucide-react";
import {
  ActionDetailButton,
  FormInput,
  FormSearchSelect,
  FormSection,
} from "../helper/formSection";
import { toast } from "react-toastify";
import { TableSearchSelect } from "../helper/tableSection";

const AccountMassLink = () => {
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
  const [linkedData, setLinkedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle changes in the third table
  const handleLinkedFieldChange = (index, field, value) => {
    const updatedData = [...linkedData];

    // Convert to number for Period fields, keep others as is
    const finalValue =
      field === "periodStart" || field === "periodEnd"
        ? value === ""
          ? ""
          : parseInt(value, 10)
        : value;

    updatedData[index][field] = finalValue;
    setLinkedData(updatedData);
  };

  const handleGenerateLinks = () => {
    // 1. Create a temporary array to hold the new rows
    const newLinks = [];
    // 2. Map every selected Account to every selected Organization
    selectedAccIds.forEach((acctId) => {
      selectedOrgIds.forEach((orgId) => {
        newLinks.push({
          acctId: acctId,
          orgId: orgId,
          isActive: true, // Defaulting to true as requested
          fiscalYearStart: "",
          periodStart: "",
          fiscalYearEnd: "",
          periodEnd: "",
        });
      });
    });

    setLinkedData(newLinks);
  };

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

  // Header Checkbox: Toggle between selecting all visible accounts and none
  const handleHeaderCheckboxChange = (e) => {
    if (e.target.checked) {
      const allIds = accounts.map((acc) => acc.acctId);
      setSelectedAccIds(allIds);
    } else {
      setSelectedAccIds([]);
    }
  };

  // Row Checkbox: Selecting a row clears others and selects only that one
  const handleRowCheckboxChange = (id) => {
    setSelectedAccIds((prev) => {
      // If the ID is already in the array, filter it out (uncheck)
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      }
      // Otherwise, add the new ID to the existing array (check)
      else {
        return [...prev, id];
      }
    });
  };

  // Organization Header: Select All / None
  const handleOrgHeaderChange = (e) => {
    if (e.target.checked) {
      const allIds = organizations.map((org) => org.orgId);
      setSelectedOrgIds(allIds);
    } else {
      setSelectedOrgIds([]);
    }
  };

  const handleOrgRowChange = (id) => {
    setSelectedOrgIds((prev) => {
      // If the ID is already in the array, filter it out (uncheck)
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      }
      // Otherwise, add the new ID to the existing array (check)
      else {
        return [...prev, id];
      }
    });
  };

  const handleSaveLinks = async () => {
    setIsLoading(true);
    try {
      // Format the payload to match your API's expected DTO
      const payload = linkedData.map((link) => ({
        acctId: link.acctId,
        orgId: link.orgId,
        activeFlag: link.isActive ? "Y" : "N",
        // Ensure numeric values for periods if required by backend
        fyCdFr: link.fiscalYearStart || null,
        pdNoFr: link.periodStart ? Number(link.periodStart) : 0,
        fyCdTo: link.fiscalYearEnd || null,
        pdNoTo: link.periodEnd ? Number(link.periodEnd) : 0,
      }));

      // console.log(payload)
      // Example API endpoint: /api/Organization/BulkCreateOrgAccounts
      const res = await api.post(
        `${backendUrl}/api/Account/SyncOrgAccounts`,
        payload,
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Links saved successfully!");

        setLinkedData([]);
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to save links.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <div className="flex gap-2">
        <MainContainer icon={CircleUser} title="Accounts">
          <div className="overflow-x-auto max-h-[35vh] border-t border-l border-gray-300 ">
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-8">
                    <input
                      type="checkbox"
                      className="w-3 h-3 accent-blue-500"
                      checked={
                        accounts.length > 0 &&
                        selectedAccIds.length === accounts.length
                      }
                      onChange={handleHeaderCheckboxChange}
                    />
                  </th>
                  <th className="th-thead">Account</th>
                  <th className="th-thead">Account Name</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {accounts?.map((acc) => (
                  <tr className="tr-tbody">
                    <td className="tbody-td w-8">
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-blue-500"
                        checked={selectedAccIds.includes(acc.acctId)}
                        onChange={() => handleRowCheckboxChange(acc.acctId)}
                      />
                    </td>
                    <td className="tbody-td">{acc.acctId}</td>
                    <td className="tbody-td">{acc.acctName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MainContainer>
        <MainContainer icon={Building2} title="Organization">
          <div className="overflow-x-auto max-h-[35vh] border-t border-l border-gray-300">
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-8">
                    <input
                      type="checkbox"
                      onChange={handleOrgHeaderChange}
                      className="h-3 w-3 accent-blue-500"
                      checked={
                        organizations.length > 0 &&
                        selectedOrgIds.length === organizations.length
                      }
                    />
                  </th>
                  <th className="th-thead">Organization</th>
                  <th className="th-thead">Organization Name</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {organizations?.map((org) => (
                  <tr className="tr-tbody">
                    <td className="tbody-td w-8">
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-blue-500"
                        checked={selectedOrgIds.includes(org.orgId)}
                        onChange={() => handleOrgRowChange(org.orgId)}
                      />
                    </td>
                    <td className="tbody-td">{org.orgId}</td>
                    <td className="tbody-td">{org.orgName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MainContainer>
      </div>
      <SecondaryContainer title="Mass Link Accounts/Organizations">
        <div className="flex justify-between mx-2 mb-1">
          <div>
            <ActionDetailButton
              label="Select"
              disabled={
                selectedAccIds.length === 0 || selectedOrgIds.length === 0
              }
              onClick={handleGenerateLinks}
            />
          </div>
          <div>
            <ActionButton
              icon={Save}
              // disabled={selectedAccIds.length === 0 || selectedOrgIds.length === 0}
              onClick={handleSaveLinks}
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[35vh] border-t border-l border-gray-300 ">
          <table className="min-w-full table-auto divide-gray-200">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="th-thead">Account</th>
                <th className="th-thead">Organization</th>
                <th className="th-thead w-16">Active</th>
                <th className="th-thead">Fiscal Year Start</th>
                <th className="th-thead">Period Start</th>
                <th className="th-thead">Fiscal Year End</th>
                <th className="th-thead">Period End</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {linkedData.map((row, index) => (
                <tr key={index} className="tr-tbody">
                  {/* Read-Only Fields */}
                  <td className="tbody-td bg-gray-50">{row.acctId}</td>
                  <td className="tbody-td bg-gray-50">{row.orgId}</td>

                  {/* Active Checkbox */}
                  <td className="tbody-td text-center">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={row.isActive}
                      onChange={(e) =>
                        handleLinkedFieldChange(
                          index,
                          "isActive",
                          e.target.checked,
                        )
                      }
                    />
                  </td>

                  {/* Fiscal Year (Text) */}
                  <td className="tbody-td">
                    <input
                      type="text"
                      className="td-input"
                      value={row.fiscalYearStart || ""}
                      onChange={(e) =>
                        handleLinkedFieldChange(
                          index,
                          "fiscalYearStart",
                          e.target.value,
                        )
                      }
                    />
                  </td>

                  {/* Period Start (Number) */}
                  <td className="tbody-td">
                    <input
                      type="number"
                      className="td-input"
                      value={row.periodStart || ""}
                      onChange={(e) =>
                        handleLinkedFieldChange(
                          index,
                          "periodStart",
                          e.target.value,
                        )
                      }
                    />
                  </td>

                  {/* Fiscal Year End (Text) */}
                  <td className="tbody-td">
                    <input
                      type="text"
                      className="td-input"
                      value={row.fiscalYearEnd || ""}
                      onChange={(e) =>
                        handleLinkedFieldChange(
                          index,
                          "fiscalYearEnd",
                          e.target.value,
                        )
                      }
                    />
                  </td>

                  {/* Period End (Number) */}
                  <td className="tbody-td">
                    <input
                      type="number"
                      className="td-input"
                      value={row.periodEnd || ""}
                      onChange={(e) =>
                        handleLinkedFieldChange(
                          index,
                          "periodEnd",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SecondaryContainer>
    </div>
  );
};

export default AccountMassLink;
