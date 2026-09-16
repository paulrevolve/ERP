import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Search, X, ArrowRight, Trash2, Sparkles, CornerDownLeft } from "lucide-react";
import { useRecentStore } from "../store/useRecentStore";

export const RecentQuickSwitcher = () => {
  const navigate = useNavigate();
  const {
    recentPages,
    isQuickSwitcherOpen,
    setQuickSwitcherOpen,
    clearRecentPages,
    initRecentPages,
  } = useRecentStore();

  const [filterText, setFilterText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    initRecentPages();
  }, [initRecentPages]);

  // Global keydown listener for Alt + R
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Alt + R or Option + R
      if (e.altKey && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        setQuickSwitcherOpen(!isQuickSwitcherOpen);
      }

      if (isQuickSwitcherOpen && e.key === "Escape") {
        e.preventDefault();
        setQuickSwitcherOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isQuickSwitcherOpen, setQuickSwitcherOpen]);

  useEffect(() => {
    if (isQuickSwitcherOpen) {
      setFilterText("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isQuickSwitcherOpen]);

  const filteredPages = recentPages.filter((item) => {
    if (!filterText.trim()) return true;
    const query = filterText.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.path.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  });

  const handleSelect = (page) => {
    setQuickSwitcherOpen(false);
    navigate(page.path);
  };

  const handleModalKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredPages.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : Math.max(0, filteredPages.length - 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredPages[selectedIndex]) {
        handleSelect(filteredPages[selectedIndex]);
      }
    }
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (!isQuickSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setQuickSwitcherOpen(false)}
      />

      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200"
        onKeyDown={handleModalKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50/70">
          <Clock size={18} className="text-[#0f49a3] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
            placeholder="Search recently visited pages..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {filterText && (
            <button
              onClick={() => setFilterText("")}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={14} />
            </button>
          )}
          <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5 border border-slate-200 rounded bg-white shrink-0">
            ESC
          </span>
        </div>

        {/* List Content */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredPages.length > 0 ? (
            filteredPages.map((page, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={page.path + idx}
                  onClick={() => handleSelect(page)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-[#0f49a3] text-white shadow-xs font-semibold"
                      : "text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Clock
                      size={14}
                      className={isSelected ? "text-white" : "text-slate-400"}
                    />
                    <span className="text-xs font-medium truncate">
                      {page.title}
                    </span>
                  </div>

                  {isSelected && (
                    <CornerDownLeft size={13} className="text-white shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400">
              <Clock size={28} className="mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-xs font-medium">No recent pages found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Navigate to screens across ERP to build your history
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 select-none">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-medium">
              <span className="px-1 py-0.5 bg-white border border-slate-200 rounded font-bold text-[9px] text-slate-600">
                Alt
              </span>
              +
              <span className="px-1 py-0.5 bg-white border border-slate-200 rounded font-bold text-[9px] text-slate-600">
                R
              </span>
              <span className="text-slate-400 ml-1">Quick Switcher</span>
            </span>
          </div>

          {recentPages.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearRecentPages();
              }}
              className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors p-1 rounded cursor-pointer"
              title="Clear all recent page history"
            >
              <Trash2 size={12} />
              <span className="text-[10px]">Clear History</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentQuickSwitcher;
