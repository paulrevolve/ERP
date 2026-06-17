import api from "../utils/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BriefcaseBusiness } from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ManageAccountGroupForm from "./ManageAccountGroupForm";

const ManageAccountGroup = ({ canEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPopup, setShowNewPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedAcctGrp, setselectedAcctGrp] = useState(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1); // Update this from your API response
  const [goToValue, setGoToValue] = useState("");

  const [searchTrigger, setSearchTrigger] = useState(0);

  // Column keys based on your C# 'Account' model
  const [columns] = useState(["acctGrpCd", "acctGrpDesc", "companyId"]);

  const COLUMN_LABELS = {
    acctGrpCd: "Account Group ID",
    acctGrpDesc: "Description",
    companyId: "Company ID",
  };

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const showEdit = selectedRows.size === 1;
  const showDelete = selectedRows.size >= 1;

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

  const handleSearch = async () => {
    const term = searchTerm.trim();
    try {
      setIsLoading(true);
      setSelectedRows(new Set());

      // Construct the URL with current pagination state
      // const url = `https://planning-master.onrender.com/api/AcctGrp/search${term ? `?acctGrpCd=${term}` : ''}`;
      const url = `https://planning-master.onrender.com/api/AcctGrp/search_paged?${term ? `acctGrpCd=${term}&` : ``}pageNumber=${currentPage}&pageSize=${pageSize}`;

      const res = await api.get(url);

      // MAPPING LOGIC:
      // res.data is the whole object { totalRecords: 2, data: [...] }
      if (res.data && res.data.data) {
        setData(res.data.data);

        // Calculate total pages dynamically
        const total = res.data.totalRecords || 0;
        setTotalPages(Math.ceil(total / pageSize) || 1);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Accoutn Group not found.";
      toast.error(msg);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    setCurrentPage(1); // Reset to first page on new search
    setSearchTrigger((prev) => prev + 1); // Flip the trigger to fire useEffect
  };

  useEffect(() => {
    if (searchTrigger === 0) return;
    handleSearch();
  }, [currentPage, pageSize, searchTrigger]);

  const toggleRow = (item) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item.acctGrpCd)) {
        newSet.delete(item.acctGrpCd);
      } else {
        newSet.add(item.acctGrpCd);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((d) => d.acctGrpCd)));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${selectedRows.size} Account Group(s)?`))
      return;

    setIsDeleting(true);
    try {
      for (let id of selectedRows) {
        await api.delete(
          `https://planning-master.onrender.com/api/AcctGrp/delete?acctGrpCd=${id}`,
        );
      }
      toast.success("Account Group Deleted Successfully!");
      handleSearch();
    } catch (error) {
      const msg = error.response?.data?.message || "Error during deletion.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // if (!canEdit("manageAccount")) return;
    const id = [...selectedRows][0];
    const acctGrpToEdit = data.find((item) => item.acctGrpCd === id);
    setselectedAcctGrp(acctGrpToEdit);
    setEditPopup(true);
  };

  return (
    <div className="p-1 sm:p-2 space-y-2 text-sm sm:text-base text-gray-800 font-inter">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-2 bg-white rounded-sm p-4">
          <BriefcaseBusiness size={20} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">
            Manage Account Group
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative w-full sm:w-auto">
          <label className="input-label">Account Group ID:</label>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
              autoComplete="off"
            />
          </div>
          <button
            onClick={handleSearchClick}
            className="btn1 btn-blue cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1">
        <div className="flex items-center mb-2 gap-1 w-full flex-nowrap">
          {/* {canEdit("manageAccount") && ( */}
          <button
            onClick={() => setShowNewPopup(true)}
            className="btn1 btn-blue shrink-0"
          >
            New Account Group
          </button>
          {/* )} */}

          <div
            className={`flex gap-1 items-center ${showDelete ? "inline-flex" : "hidden"}`}
          >
            {/* {showEdit && canEdit("manageAccount") && ( */}
            {showEdit && (
              <button className="btn1 btn-blue mr-2" onClick={handleEdit}>
                Edit
              </button>
            )}
            {/* {canEdit("manageAccount") && ( */}
            {/* {canEdit("manageAccount") && ( */}
            <button
              onClick={handleDelete}
              className="btn1 px-4 py-1.5 btn-red"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : `Delete (${selectedRows.size})`}
            </button>
            {/* )} */}
          </div>
        </div>

        <div className="rounded border border-gray-200 overflow-hidden relative">
          {/* Create/Edit Popups */}
          {(showNewPopup || editPopup) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Modal Container: Sets the boundaries */}
              <div className="relative bg-white w-full max-w-3xl h-fit max-h-[95vh]  lg:max-h-[90vh] flex flex-col animate-premium-popup shadow-2xl rounded-lg overflow-hidden">
                <ManageAccountGroupForm
                  onClose={() => {
                    setShowNewPopup(false);
                    setEditPopup(false);
                  }}
                  selectedAcctGrp={editPopup ? selectedAcctGrp : null}
                  onSaveSuccess={() => {
                    handleSearch();
                    setShowNewPopup(false);
                    setEditPopup(false);
                  }}
                />
              </div>
            </div>
          )}

          <div
            className={`overflow-x-auto max-h-[70vh] min-h-[70vh] ${showNewPopup ? "pointer-events-none" : ""}`}
          >
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0">
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
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="th-thead text-xs font-bold text-gray-600 text-center"
                    >
                      {COLUMN_LABELS[col] || col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="text-center py-10"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="p-8 text-center text-gray-500"
                    >
                      Search for an Account Group to view the details.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.acctGrpCd}
                      className={`cursor-pointer hover:bg-blue-50 ${selectedRows.has(item.acctGrpCd) ? "bg-blue-200" : "bg-white"}`}
                      onDoubleClick={() => {
                        setselectedAcctGrp(item);
                        setEditPopup(true);
                      }}
                    >
                      {/* {canEdit("manageAccount") && ( */}
                      <td className="tbody-td-fun text-center">
                        <input
                          type="checkbox"
                          onClick={() => toggleRow(item)}
                          checked={selectedRows.has(item.acctGrpCd)}
                          readOnly
                        />
                      </td>
                      {/* )} */}
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center"
                        >
                          {col === "active" ? (
                            <input
                              type="checkbox"
                              checked={Boolean(item[col])} // Robust check for true/false
                              readOnly
                              className="h-3 w-3 accent-blue-600"
                            />
                          ) : col === "updatedat" ? (
                            item[col]?.split("T")[0]
                          ) : col === "endDate" ? (
                            `${new Date(item.fyCdTo, item.pdNoTo, 0).getDate()}-${item.pdNoTo}-${item.fyCdTo}`
                          ) : (
                            item[col]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
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
        </div>
      </div>
    </div>
  );
};

export default ManageAccountGroup;
