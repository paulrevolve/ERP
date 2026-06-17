import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const Pagination = ({
  totalPages,
  setCurrentPage,
  currentPage,
  goToValue,
  setGoToValue,
  pageSize,
  setPageSize,
}) => {
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

  return (
    <div className="w-full flex items-center justify-center mt-1 ">
      <div className="flex items-center justify-end gap-1 px-2 py-1  border-gray-100 w-fit ml-auto text-sm text-gray-900">
        {/* Left Arrow */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          className="text-[#17414d] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
          disabled={currentPage === 1}
        >
          <ChevronLeft size={14} />
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
                className={`w-4 h-4 flex items-center text-[12px] cursor-pointer justify-center rounded-full transition-all ${
                  currentPage === page
                    ? "bg-[#17414d] text-white  "
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
          <ChevronRight size={14} />
        </button>

        {/* Page Size Select */}
        <div className="relative flex border border-gray-200 items-center rounded px-2 bg-white transition-colors">
          {/* bg-[#17414d] */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="appearance-none bg-transparent pr-4 pl-1 
                              focus:outline-none cursor-pointer text-black text-[10px]"
          >
            <option value={15} className="text-black bg-white  text-[10px]">
              15 / page
            </option>
            <option value={25} className="text-black bg-white  text-[10px]">
              25 / page
            </option>
            <option value={35} className="text-black bg-white  text-[10px]">
              35 / page
            </option>
          </select>

          <ChevronDown
            size={12}
            className="absolute right-2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Go To Input */}
        <div className="flex items-center gap-1 text-[10px] ml-2">
          <span className="text-black">Go to</span>
          <input
            type="text"
            value={goToValue}
            onChange={(e) => setGoToValue(e.target.value.replace(/\D/g, ""))}
            onKeyDown={handleGoTo}
            placeholder="#"
            className="w-12 border border-gray-200 outline-none bg-white rounded text-center transition-all "
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
