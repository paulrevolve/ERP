import {
  BarChart2,
  BriefcaseBusiness,
  ChevronRight,
  Layers,
  Plus,
  Settings,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const recentlyVisited = [
    { label: "Org Master", path: "/dashboard/org-master" },
    { label: "Account Master", path: "/dashboard/account-master" },
    { label: "Project Planning", path: "/dashboard/project-budget-status" },
  ];

  const modules = [
    {
      id: "planning",
      label: "Planning",
      icon: <BarChart2 size={20} />,
      items: [
        { label: "Project Planning", path: "/dashboard/project-budget-status" },
        {
          label: "Reporting",
          path: "/dashboard/project-report",
          permission: "projectReport",
        },
        {
          label: "Mass Utility",
          path: "/dashboard/mass-utility",
          permission: "massUtility",
        },
        { label: "Pricing", path: "/dashboard/pricing", permission: "pricing" },
        {
          label: "Financial Report",
          path: "/dashboard/financial-report",
          permission: "financialReport",
        },
      ],
    },
    {
      id: "business",
      label: "New Business",
      icon: <BriefcaseBusiness size={20} />,
      items: [
        {
          label: "Import Opportunity",
          path: "/dashboard/import-opportunity",
          permission: "impOpportunity",
        },
        {
          label: "Manage New Business",
          path: "/dashboard/new-business",
          permission: "manageNewBusiness",
        },
        {
          label: "Transfer Project Budget",
          path: "/dashboard/create-project-budget",
          permission: "transferUtility",
        },
      ],
    },
    {
      id: "manage",
      label: "Manage",
      icon: <Users size={20} />,
      items: [
        {
          label: "Manage Groups",
          path: "/dashboard/manage-groups",
          permission: "manageGroups",
        },
        {
          label: "Manage Users",
          path: "/dashboard/manage-users",
          permission: "manageUser",
        },
        { label: "Manage Accounts", path: "/dashboard/account-master" },
        { label: "Manage Orgs", path: "/dashboard/org-master" },
        { label: "Manage Employees", path: "/dashboard/employee-master" },
      ],
    },
    {
      id: "settings",
      label: "Admin",
      icon: <Settings size={20} />,
      items: [
        {
          label: "Configuration",
          // Example of a menu with sub-items
          subItems: [
            {
              label: "Global Settings",
              path: "/dashboard/global-configuration",
              permission: "globalConfiguration",
            },
            { label: "System Logs", path: "/dashboard/system-logs" },
          ],
        },
        {
          label: "Burden Setup",
          path: "/dashboard/pool-rate-tabs",
          permission: "poolRateTabs",
        },
        {
          label: "Rights Settings",
          path: "/dashboard/role-rights",
          permission: "roleRights",
        },
      ],
    },
  ];

  // 1. Load existing shortcuts from storage or set defaults
  const [shortcuts, setShortcuts] = useState(() => {
    const saved = localStorage.getItem("finaxis_shortcuts");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  // Create a flat list of all pages for the "Add Shortcut" modal
  const allAvailablePages = [...modules].flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      moduleLabel: section.label,
      moduleIcon: section.icon, // We'll use the parent icon for the shortcut tile
    })),
  );

  const addShortcut = (page) => {
    // Prevent duplicates
    if (!shortcuts.find((s) => s.path === page.path)) {
      setShortcuts([
        ...shortcuts,
        {
          label: page.label,
          path: page.path,
          icon: page.moduleLabel, // Storing the label to map icons later
        },
      ]);
    }
    setIsModalOpen(false);
    setModalSearch("");
  };

  const removeShortcut = (path) => {
    setShortcuts(shortcuts.filter((s) => s.path !== path));
  };

  // 2. Sync shortcuts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("finaxis_shortcuts", JSON.stringify(shortcuts));
  }, [shortcuts]);
  return (
    <div className="p-6 flex flex-col gap-y-6 items-center justify-center min-h-screen">
      <div className="shadow-sm border border-gray-200 rounded-xl w-[100%] h-[35vh] bg-[#104e64] p-4">
        <h2 className="text-sm font-bold text-gray-50 uppercase  mb-4">
          Financial Overview
        </h2>
        <div className="bg-white w-[100%] h-[85%] rounded"></div>
      </div>

      <div className="flex gap-x-6 w-[95%] h-[50vh]">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl w-[70%] p-4 overflow-hidden">
          <h2 className="text-sm font-bold text-gray-700 mb-2">Pinned Pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
            {/* Existing Shortcuts */}

            {/* "Add New" Button Tile */}
            {shortcuts.length < 8 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#104e64] hover:bg-[#104e64]/5 transition-all cursor-pointer h-28 group"
              >
                <Plus
                  size={24}
                  className="text-gray-300 group-hover:text-[#104e64]"
                />
                <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase group-hover:text-[#104e64]">
                  Add Page
                </span>
              </button>
            )}
            {shortcuts.map((s) => (
              <div key={s.path} className="group relative">
                <button
                  onClick={() => navigate(s.path)}
                  className="w-full flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-[#104e64] hover:shadow-md transition-all cursor-pointer h-28"
                >
                  <div className="text-[#104e64] mb-2 opacity-80 group-hover:opacity-100">
                    <Layers size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 text-center line-clamp-2">
                    {s.label}
                  </span>
                </button>
                <button
                  onClick={() => removeShortcut(s.path)}
                  className="absolute -top-2 cursor-pointer -right-2 bg-white border border-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {isModalOpen && (
            <div
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-[100] flex rounded items-center justify-center bg-black/20 pointer-events-auto p-4"
            >
              <div className="bg-white w-full max-w-md rounded shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-[#104e64]">
                  <h3 className="text-xs font-bold uppercase text-white tracking-widest">
                    Select Page to Pin
                  </h3>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X size={18} className="text-gray-400 cursor-pointer" />
                  </button>
                </div>

                <div className="p-2">
                  <input
                    placeholder="Search all pages..."
                    className="w-full text-xs p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#104e64]/20"
                    onChange={(e) =>
                      setModalSearch(e.target.value.toLowerCase())
                    }
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  {allAvailablePages
                    .filter((p) => p.label.toLowerCase().includes(modalSearch))
                    .map((page) => (
                      <button
                        key={page.path}
                        disabled={shortcuts.some((s) => s.path === page.path)}
                        onClick={() => addShortcut(page)}
                        className={`w-full text-left p-3 rounded-xl text-xs flex justify-between items-center group mb-1 ${
                          shortcuts.some((s) => s.path === page.path)
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-[#104e64] hover:text-white cursor-pointer"
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{page.label}</p>
                          <p
                            className={`text-[9px] uppercase ${shortcuts.some((s) => s.path === page.path) ? "" : "text-gray-400 group-hover:text-white/70"}`}
                          >
                            {page.moduleLabel}
                          </p>
                        </div>
                        {shortcuts.some((s) => s.path === page.path) ? (
                          <span className="text-[9px] font-bold">Pinned</span>
                        ) : (
                          <Plus size={14} />
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Utilities: Shortcuts & Info */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl w-[30%] p-4">
          <h2 className="text-sm font-bold text-gray-700 mb-2">
            Recently Visited
          </h2>

          <div className="flex flex-col gap-y-2">
            {recentlyVisited.map((page) => (
              <button
                key={page.path}
                onClick={() => (window.location.href = page.path)}
                className="group flex items-center cursor-pointer justify-between w-full p-3 bg-gray-50 hover:bg-[#104e64] border border-gray-100 rounded-lg transition-all duration-200"
              >
                <span className="text-[12px] font-medium text-gray-700 group-hover:text-white">
                  {page.label}
                </span>
                <ChevronRight
                  size={14}
                  className="text-gray-300 group-hover:text-white"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
