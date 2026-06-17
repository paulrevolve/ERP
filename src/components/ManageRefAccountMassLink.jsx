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

const getCompanyId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user?.companyId || "1";
  } catch (e) {
    return "1";
  }
};

const AccountMassLink = () => {
  const [orgAccData, setOrgAccData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrgAccKeys, setSelectedOrgAccKeys] = useState(new Set());
  const [linkedData, setLinkedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allRefStrucs, setAllRefStrucs] = useState([]);

  const [selectedRefId, setSelectedRefId] = useState(null);

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

  const handleLinkedFieldChange = (index, field, value) => {
    const updatedData = [...linkedData];
    updatedData[index][field] = value;
    setLinkedData(updatedData);
  };

  const handleOrgAccSelect = (acctId, orgId) => {
    const key = `${acctId}|${orgId}`;
    setSelectedOrgAccKeys(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) newSet.delete(key);
        else newSet.add(key);
        return newSet;
    });
  };

  const handleOrgAccSelectAll = (e) => {
    if (e.target.checked) {
        const newSet = new Set(orgAccData.map(oa => `${oa.acctId}|${oa.orgId}`));
        setSelectedOrgAccKeys(newSet);
    } else {
        setSelectedOrgAccKeys(new Set());
    }
  };

  const handleGenerateLinks = () => {
    if (!selectedRefId) {
        toast.warning("Please select a Reference first.");
        return;
    }
    if (selectedOrgAccKeys.size === 0) {
        toast.warning("Please select at least one Account/Organization pair.");
        return;
    }

    const refObj = allRefStrucs.find(r => String(r.refStrucId) === String(selectedRefId));
    
    const newLinks = [];
    selectedOrgAccKeys.forEach(key => {
        const [acctId, orgId] = key.split('|');
        const oa = orgAccData.find(item => String(item.acctId) === acctId && String(item.orgId) === orgId);
        
        if (oa) {
            newLinks.push({
                refNo: refObj?.refStrucId || "",
                refName: refObj?.refStrucName || "",
                acctId: oa.acctId,
                acctName: oa.acctName || "",
                orgId: oa.orgId,
                orgName: oa.orgName || "",
                isActive: true,
                companyId: getCompanyId()
            });
        }
    });

    setLinkedData(newLinks);
  };

  const [accounts, setAccounts] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orgAccRes, accRes, orgRes] = await Promise.all([
          api.get(`${backendUrl}/Orgnization/GetAllOrgAccounts`),
          api.get(`${backendUrl}/api/Account/GetAllAccounts`),
          api.get(`${backendUrl}/Orgnization/SearchOrganizations?search=&startsWith=&sortBy=OrgId&sortOrder=asc&page=1&pageSize=15`)
        ]);

        if (accRes.data) setAccounts(accRes.data);
        if (orgRes.data?.data) setOrganizations(orgRes.data.data);

        if (orgAccRes.data) {
          // Enrich the combined data with names from master lists
          const accList = accRes.data || [];
          const orgList = orgRes.data?.data || orgRes.data || []; // Handle both direct array or nested data
          
          const enrichedData = orgAccRes.data.map(item => {
            const accInfo = accList.find(a => String(a.acctId) === String(item.acctId));
            const orgInfo = orgList.find(o => String(o.orgId) === String(item.orgId));
            return {
              ...item,
              acctName: item.acctName || accInfo?.acctName || "",
              orgName: item.orgName || orgInfo?.orgName || ""
            };
          });
          setOrgAccData(enrichedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchAllRefStrucs();
  }, []);

  const handleSaveLinks = async () => {
    if (linkedData.length === 0) return;
    setIsLoading(true);
    try {
      const payload = linkedData.map((link) => ({
        refNo: link.refNo || null,
        refName: link.refName || null,
        acctId: link.acctId,
        acctName: link.acctName || null,
        orgId: link.orgId,
        orgName: link.orgName || null,
        activeFlag: link.isActive ? "Y" : "N",
        companyId: getCompanyId()
      }));

      const res = await api.post(
        `${backendUrl}/api/Account/SyncOrgAccounts`,
        payload,
      );

      try {
          const refStrucPayload = linkedData.map((link) => {
              return {
                  orgId: link.orgId || "",
                  acctId: link.acctId || "",
                  refStrucId: link.refNo || "",
                  companyId: getCompanyId(),
                  modifiedBy: "SystemUser",
                  timeStamp: new Date().toISOString().split('T')[0],
                  rowVersion: 0,
                  refStruc: {
                      refStrucId: link.refNo || "",
                      companyId: getCompanyId(),
                      refStrucName: link.refName || "",
                      refStrucTopFl: "N",
                      refDataEntryFl: "Y",
                      sRefEntryCd: "1",
                      modifiedBy: "SystemUser",
                      timeStamp: new Date().toISOString().split('T')[0],
                      rowVersion: 0
                  }
              };
          });
          
          await api.post(`${backendUrl}/api/RefStruc/sync-org-acct-ref-struc`, refStrucPayload);
      } catch (refErr) {
          console.error("Secondary POST RefStruc Error:", refErr);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success("Links saved successfully!");
        setLinkedData([]);
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to save links.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <div className="flex gap-2">
        <MainContainer icon={CircleUser} title="References">
          <div className="overflow-x-auto max-h-[35vh] border-t border-l border-gray-300">
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-8"></th>
                  <th className="th-thead">Reference</th>
                  <th className="th-thead">Reference Name</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {allRefStrucs?.map((ref) => (
                  <tr key={ref.refStrucId} className="tr-tbody">
                    <td className="tbody-td w-8">
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-blue-500"
                        checked={selectedRefId === ref.refStrucId}
                        onChange={() => setSelectedRefId(prev => (prev === ref.refStrucId ? null : ref.refStrucId))}
                      />
                    </td>
                    <td className="tbody-td">{ref.refStrucId}</td>
                    <td className="tbody-td">{ref.refStrucName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MainContainer>
        <MainContainer icon={Building2} title="Accounts/Organizations">
          <div className="overflow-x-auto max-h-[35vh] border-t border-l border-gray-300 ">
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-8">
                    <input
                      type="checkbox"
                      className="w-3 h-3 accent-blue-500"
                      checked={
                        orgAccData.length > 0 &&
                        selectedOrgAccKeys.size === orgAccData.length
                      }
                      onChange={handleOrgAccSelectAll}
                    />
                  </th>
                  <th className="th-thead">Account</th>
                  <th className="th-thead">Organization</th>
                  <th className="th-thead">Account Name</th>
                  <th className="th-thead">Organization Name</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {orgAccData?.map((oa) => {
                  const key = `${oa.acctId}|${oa.orgId}`;
                  return (
                    <tr key={key} className="tr-tbody">
                      <td className="tbody-td w-8">
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-blue-500"
                          checked={selectedOrgAccKeys.has(key)}
                          onChange={() => handleOrgAccSelect(oa.acctId, oa.orgId)}
                        />
                      </td>
                      <td className="tbody-td">{oa.acctId}</td>
                      <td className="tbody-td">{oa.orgId}</td>
                      <td className="tbody-td">{oa.acctName}</td>
                      <td className="tbody-td">{oa.orgName}</td>
                    </tr>
                  );
                })}
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
              onClick={handleGenerateLinks}
            />
          </div>
          <div>
            <ActionButton
              icon={Save}
              onClick={handleSaveLinks}
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[35vh] border-t border-l border-gray-300 ">
          <table className="min-w-full table-auto divide-gray-200">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="th-thead">Reference</th>
                <th className="th-thead">Reference Name</th>
                <th className="th-thead">Account</th>
                <th className="th-thead">Account Name</th>
                <th className="th-thead">Organization</th>
                <th className="th-thead">Organization Name</th>
                <th className="th-thead w-16 text-center">Active</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {linkedData.map((row, index) => (
                <tr key={index} className="tr-tbody">
                  <td className="tbody-td">{row.refNo}</td>
                  <td className="tbody-td">{row.refName}</td>
                  <td className="tbody-td">{row.acctId}</td>
                  <td className="tbody-td">{row.acctName}</td>
                  <td className="tbody-td">{row.orgId}</td>
                  <td className="tbody-td">{row.orgName}</td>
                  <td className="tbody-td text-center">
                    <input
                      type="checkbox"
                      className="w-3 h-3 accent-blue-500"
                      checked={row.isActive}
                      onChange={(e) => handleLinkedFieldChange(index, "isActive", e.target.checked)}
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
