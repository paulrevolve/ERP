import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const AccountGroupSetup = ({ canEdit }) => {
  // Global lists
  const [accountGroups, setAccountGroups] = useState([]);

  // Filter States
  const [searchGroupCode, setSearchGroupCode] = useState(""); // New: Filter for Group Code
  const [searchAccountId, setSearchAccountId] = useState(""); // New: Filter for Account ID

  // UI state
  const [activeMainTab, setActiveMainTab] = useState("accountMapping");
  const [initialLoading, setInitialLoading] = useState(false);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1); // Update this from your API response
  const [goToValue, setGoToValue] = useState("");

  const [searchTrigger, setSearchTrigger] = useState(0);

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleGoTo = (e) => {
    if (e.key === "Enter") {
      const val = parseInt(goToValue);
      if (val >= 1 && val <= totalPages) {
        setCurrentPage(val);
        setGoToValue("");
      }
    }
  };

  // ------------ DATA FETCHING ------------

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const res = await api.get(
        `https://planning-master.onrender.com/api/AccountGroupSetup/getall?pageNumber=${currentPage}&pageSize=${pageSize}`,
      );

      const groupsData = res.data?.data || [];
      if (groupsData) {
        setAccountGroups(groupsData);

        // Calculate total pages dynamically
        const total = res.data.totalRecords || 0;
        setTotalPages(Math.ceil(total / pageSize) || 1);
      } else {
        setAccountGroups([]);
        setTotalPages(1);
      }
    } catch (e) {
      console.error("Initialization failed", e);
      toast.error("Failed to load account group data.");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSearchClick = () => {
    setCurrentPage(1); // Reset to first page on new search
    setSearchTrigger((prev) => prev + 1); // Flip the trigger to fire useEffect
  };

  useEffect(() => {
    if (searchTrigger === 0) return;
    fetchInitialData();
  }, [currentPage, pageSize, searchTrigger]);

  // ------------ RENDER ------------

  const renderMappingTab = () => {
    // UPDATED: Logic to filter by BOTH columns
    const filteredAccounts = accountGroups.filter((acc) => {
      const matchesGroup = (acc.acctGroupCode || "")
        .toLowerCase()
        .includes(searchGroupCode.toLowerCase());

      const matchesAccount = (acc.accountId || "")
        .toLowerCase()
        .includes(searchAccountId.toLowerCase());

      return matchesGroup && matchesAccount;
    });

    return (
      <>
        <div className="rounded mb-2">
          <div className="flex items-center gap-x-4 mb-2">
            {/* <h3 className="text-sm font-semibold whitespace-nowrap">Filter</h3> */}

            {/* Filter Input 1: Account Group Code */}
            <div className="flex items-center ">
              <input
                type="text"
                placeholder="Search Group Code..."
                value={searchGroupCode}
                onChange={(e) => setSearchGroupCode(e.target.value)}
                className="w-[250px] border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-blue-400"
              />
            </div>

            {/* Filter Input 2: Account ID */}
            <div className="flex items-center gap-x-4">
              <input
                type="text"
                placeholder="Search Account ID..."
                value={searchAccountId}
                onChange={(e) => setSearchAccountId(e.target.value)}
                className="w-[250px] border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-blue-400"
              />
              <button
                onClick={handleSearchClick}
                className="btn1 btn-blue cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto max-h-[70vh] min-h-[70vh] border border-gray-300 rounded">
          <table className="w-full text-sm">
            <thead className="thead sticky top-0 bg-white">
              <tr className="bg-white border-b border-gray-300">
                <th className="th-thead text-left text-black text-xs">
                  Account Group Code
                </th>
                <th className="th-thead text-left text-black text-xs">
                  Account ID
                </th>
                <th className="th-thead text-left text-black text-xs">
                  Account Name
                </th>
                <th className="th-thead text-left text-black text-xs">
                  Account Type
                </th>
              </tr>
            </thead>
            <tbody>
              {initialLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Loading account groups...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Search for account groups...
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc, idx) => {
                  return (
                    <tr
                      key={`${acc.accountId}-${idx}`}
                      className="hover:bg-gray-50 border-b border-gray-200"
                    >
                      <td className="tbody-td">{acc.acctGroupCode}</td>
                      <td className="tbody-td">{acc.accountId}</td>
                      <td className="tbody-td">{acc.accountName}</td>
                      <td className="tbody-td">{acc.accountType}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {
          <div className="w-full bg-[#e5f3fb] text-white flex items-center justify-center ">
            <div className="flex items-center justify-end gap-2 px-4 py-2  border-gray-100 w-fit ml-auto mb-1 text-sm text-gray-900">
              {/* Left Arrow */}
              <button
                onClick={() => handlePageClick(currentPage - 1)}
                className="text-[#17414d] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page Numbers with Ellipsis Logic */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const showMax = 5; // Adjustment for number of visible page buttons
                  if (totalPages <= showMax + 2) {
                    // If total pages are few, show all of them
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    // Logic for large page counts (like 50)
                    pages.push(1); // Always show first page

                    if (currentPage > 3) {
                      pages.push("...");
                    }

                    // Show pages around the current page
                    let start = Math.max(2, currentPage - 1);
                    let end = Math.min(totalPages - 1, currentPage + 1);

                    // Keep a consistent number of buttons when at the edges
                    if (currentPage <= 2) end = 4;
                    if (currentPage >= totalPages - 1) start = totalPages - 3;

                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }

                    if (currentPage < totalPages - 2) {
                      pages.push("...");
                    }

                    pages.push(totalPages); // Always show last page
                  }

                  return pages.map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === "number" && handlePageClick(page)
                      }
                      disabled={page === "..."}
                      className={`w-8 h-8 flex items-center cursor-pointer justify-center rounded-full transition-all ${
                        currentPage === page
                          ? "bg-[#17414d] text-white font-bold "
                          : page === "..."
                            ? "cursor-default text-gray-400"
                            : "hover:bg-white hover:text-[#17414d]"
                      }`}
                    >
                      {page}
                    </button>
                  ));
                })()}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => handlePageClick(currentPage + 1)}
                className="text-[#17414d] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </button>

              {/* Page Size Select */}
              <div className="relative flex items-center rounded px-2 bg-white transition-colors">
                {/* bg-[#17414d] */}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-transparent py-1 pr-4 pl-1 
                          focus:outline-none cursor-pointer text-black"
                >
                  <option value={15} className="text-black bg-white">
                    15 / page
                  </option>
                  <option value={25} className="text-black bg-white">
                    25 / page
                  </option>
                  <option value={35} className="text-black bg-white">
                    35 / page
                  </option>
                </select>

                <ChevronDown
                  size={14}
                  className="absolute right-2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Go To Input */}
              <div className="flex items-center gap-2 ml-2">
                <span className="text-black font-semibold">Go to</span>
                <input
                  type="text"
                  value={goToValue}
                  onChange={(e) =>
                    setGoToValue(e.target.value.replace(/\D/g, ""))
                  }
                  onKeyDown={handleGoTo}
                  placeholder="#"
                  className="w-12 border border-gray-200 outline-none bg-white rounded py-1 text-center transition-all "
                />
                <span className="text-black font-semibold">Page</span>
              </div>
            </div>
          </div>
        }
      </>
    );
  };

  return (
    <div className="min-h-screen text-gray-900 flex w-full">
      <div className="w-full p-2 space-y-2">
        <div className="p-4 border-b w-full rounded-sm border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-lg font-normal text-gray-800 flex items-center gap-2">
            Account Group Table
          </h2>
        </div>

        <div className="bg-white p-3 w-full rounded">
          {activeMainTab === "accountMapping" && renderMappingTab()}
        </div>
      </div>
    </div>
  );
};

export default AccountGroupSetup;
