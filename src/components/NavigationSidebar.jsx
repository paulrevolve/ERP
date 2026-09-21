import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  BarChart2,
  Layers,
  BriefcaseBusiness,
  Users,
  Home,
  LayoutDashboard,
  Star,
  Clock,
  Search,
  Settings,
  HomeIcon,
  Calculator,
  FileText,
  Trash2,
  CornerDownLeft,
} from "lucide-react";
import { useRecentStore } from "../store/useRecentStore";

const NavigationSidebar = ({ canView, isSidebarOpen, setIsSidebarOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { recentPages, clearRecentPages } = useRecentStore();

  // State for collapse / expand matching sidebar.jsx
  const [isCollapsed, setIsCollapsed] = useState(true);

  // State for which main module is active/open in the flyout
  const [activeModule, setActiveModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRailHovered, setIsRailHovered] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});

  const HIDDEN_FEATURES =
    import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
  const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

  const toggleSubMenu = (key) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Define the structure based on your current logic
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
        {
          label: "Manage Project Roles",
          path: "/dashboard/manage-project-role",
        },
        { label: "Manage Revenue", path: "/dashboard/manage-revenue" },
        {
          label: "Manage Revenue Formulas",
          path: "/dashboard/manage-revenue-formulas",
        },
        {
          label: "Print Project Revenue & Billing Formulas",
          path: "/dashboard/print-revenue-billing-formulas",
        },
        {
          label: "Manage Rate Sequence Orders",
          path: "/dashboard/manage-rate-sequence-orders",
        },
        { label: "Manage Cost of Goods Sold", path: "/dashboard/manage-cogs" },
        {
          label: "Manage Alternate Project Revenue Profiles",
          path: "/dashboard/manage-alternate-project-revenue-profiles",
        },
        {
          label: "Manage Alternate Revenue Profile Prior Year History",
          path: "/dashboard/manage-alternate-revenue-profile-prior-year-history",
        },
        {
          label: "Manage Project Revenue Calculation Value History",
          path: "/dashboard/manage-project-revenue-calculation-value-history",
        },
        {
          label: "Manage Revenue Evaluation Info and Disclosures",
          path: "/dashboard/manage-revenue-evaluation-info-and-disclosures",
        },
        {
          label: "Manage Revenue Evaluation Status Codes",
          path: "/dashboard/manage-revenue-evaluation-status-codes",
        },
        {
          label: "Manage Performance Obligation Type Codes",
          path: "/dashboard/manage-performance-obligation-type-codes",
        },
        {
          label: "Manage Total Ceilings",
          path: "/dashboard/manage-total-ceilings",
        },
        {
          label: "Manage Burden Cost Ceilings",
          path: "/dashboard/manage-burden-cost-ceilings",
        },
        {
          label: "Manage Direct Cost Ceilings",
          path: "/dashboard/manage-direct-cost-ceilings",
        },
        {
          label: "Manage Burden Fee Overrides",
          path: "/dashboard/manage-burden-fee-overrides",
        },
        {
          label: "Manage Cost Fee Overrides",
          path: "/dashboard/manage-cost-fee-overrides",
        },
        {
          label: "Manage Multiplier Overrides",
          path: "/dashboard/manage-multiplier-overrides",
        },
        {
          label: "Manage Hours Ceilings",
          path: "/dashboard/manage-hours-ceilings",
        },
        {
          label: "Manage Employee Hours Ceilings",
          path: "/dashboard/manage-employee-hours-ceilings",
        },
        {
          label: "Manage Vendor Hours Ceilings",
          path: "/dashboard/manage-vendor-hours-ceilings",
        },
        {
          label: "Project Labor Categories (PLC)",
          path: "/dashboard/manage-plc",
        },
        {
          label: "Link PLCs to Projects",
          path: "/dashboard/link-plc-to-projects",
        },
        {
          label: "Link PLC Rates to Projects",
          path: "/dashboard/link-plc-rates-to-projects",
        },
      ],
    },
    {
      id: "accounts",
      label: "Accounting",
      icon: <Calculator size={20} />,
      items: [
        {
          label: "General Ledger",
          subItems: [
            {
              label: "Company Calendar",
              subItems: [
                {
                  label: "Fiscal Year",
                  path: "/dashboard/fiscalyear",
                  permission: "fiscalYear",
                },
                {
                  label: "Period",
                  path: "/dashboard/period",
                  permission: "fiscalYear",
                },
                {
                  label: "Subperiod",
                  path: "/dashboard/subperiod",
                  permission: "fiscalYear",
                },
              ],
            },
            {
              label: "Organizations",
              subItems: [
                {
                  label: "Organization Setup",
                  path: "/dashboard/org-master",
                  permission: "organization",
                },
                {
                  label: "User Define Label",
                  path: "/dashboard/userdefinedlabels/organization",
                  permission: "organization",
                },
                {
                  label: "User Define Information",
                  path: "/dashboard/userdefinedinformation/organization",
                  permission: "organization",
                },
              ],
            },
            {
              label: "Reorganization",
              subItems: [
                {
                  label: "Reorganization Setup",
                  path: "/dashboard/reorganization/reorg-setup",
                  permission: "reorganization",
                },
                {
                  label: "Link Reorganization/Organizations",
                  path: "/dashboard/reorganization/link-org-reorg",
                  permission: "reorganization",
                },
                {
                  label: "Mass Link Reorganization/Organizations",
                  path: "/dashboard/reorganization/masslink-org-reorg",
                  permission: "reorganization",
                },
              ],
            },
            {
              label: "Accounts",
              subItems: [
                {
                  label: "Accounts",
                  path: "/dashboard/account-master",
                  permission: "account",
                },
                {
                  label: "Link Accounts/Organizations",
                  path: "/dashboard/account-org-link",
                  permission: "account",
                },
                {
                  label: "Mass Link Accounts/Organizations",
                  path: "/dashboard/accounts-orgs-link",
                  permission: "account",
                },
                {
                  label: "User Define Label",
                  path: "/dashboard/userdefinedlabels/account",
                  permission: "account",
                },
                {
                  label: "User Define Information",
                  path: "/dashboard/userdefinedinformation/account",
                  permission: "account",
                },
              ],
            },
            // {
            //   label: "Vendor",
            //   subItems: [
            //     {
            //       label: "Vendor",
            //       path: "/dashboard/vendor/manage-vendors",
            //       permission: "vendor",
            //     },
            //     {
            //       label: "User Define Label",
            //       path: "/dashboard/userdefinedlabels/vendor",
            //       permission: "vendor",
            //     },
            //     {
            //       label: "User Define Information",
            //       path: "/dashboard/userdefinedinformation/vendor",
            //       permission: "vendor",
            //     },
            //   ],
            // },
            {
              label: "Employee",
              subItems: [
                {
                  label: "User Define Label",
                  path: "/dashboard/userdefinedlabels/employee",
                  permission: "employee",
                },
                {
                  label: "User Define Information",
                  path: "/dashboard/userdefinedinformation/employee",
                  permission: "employee",
                },
              ],
            },
            {
              label: "Reference Number",
              subItems: [
                {
                  label: "Reference",
                  path: "/dashboard/manage-reference",
                  permission: "employee",
                },
                // {
                //   label: "User Define Information",
                //   path: "/dashboard/userdefinedinformation/employee",
                //   permission: "employee",
                // },
              ],
            },
            {
              label: "Countries",
              path: "/dashboard/manage-countries",
              permission: "organization",
            },

            // {
            //   label: "Project",
            //   subItems: [
            //     {
            //       label: "Project",
            //       path: "/dashboard/project-master",
            //       permission: "project",
            //     },
            //     {
            //       label: "project Template",
            //       path: "/dashboard/manage-proj-template",
            //       permission: "project",
            //     },
            //   ],
            // },
            // {
            //   label: "Prospective Vendor",
            //   subItems: [
            //     {
            //       label: "Prospective Vendor",
            //       path: "/dashboard/prospective-vendor/manage-prospective-vendor",
            //       permission: "prospectiveVendor",
            //     },
            //     {
            //       label: "Approve Prospective Vendor",
            //       path: "/dashboard/prospective-vendor/approve-prospective-vendor",
            //       permission: "prospectiveVendor",
            //     },
            //   ],
            // },
          ],
        },
        {
          label: "Accounts Payable",
          subItems: [
            // {
            //   label: "Vendor",
            //   subItems: [
            //     // {
            //     //   label: "Fiscal Year",
            //     //   path: "/dashboard/manage-fiscalyear",
            //     //   permission: "fiscalYear",
            //     // },
            //     // {
            //     //   // label: "Accounting Period",
            //     //   path: "/dashboard/manage-accountingperiod",
            //     //   permission: "fiscalYear",
            //     // },
            //     // {
            //     //   label: "Subperiod",
            //     //   path: "/dashboard/manage-subperiod",
            //     //   permission: "fiscalYear",
            //     // },
            //   ],
            // },

            {
              label: "Accounts Payable Controls",
              subItems: [
                {
                  label: "Configure Accounts Payable Settings",
                  path: "/dashboard/accts-payable/accounts-payable-configure",
                  permission: "organization",
                },
                {
                  label: "Configure Check/EFT Email Settings",
                  path: "/dashboard/accts-payable/check-email-setting",
                  permission: "organization",
                },
                {
                  label: "Accounts Payable Accounts",
                  path: "/dashboard/accts-payable/accounts-payable-settings",
                  permission: "organization",
                },
                {
                  label: "Cash Accounts",
                  path: "/dashboard/accts-payable/cash-accounts",
                  permission: "organization",
                },
                // {
                //   label: "Cash Requirements Rpt Supplemental Amounts",
                //   path: "/dashboard/accts-payable/cash-supp-amounts",
                //   permission: "organization",
                // },
                {
                  label: "Configure Accounts Payable Voucher Settings",
                  path: "/dashboard/accts-payable/accts-payable-voucher",
                  permission: "organization",
                },
                {
                  label: "Configure Purchase Order Voucher Settings",
                  path: "/dashboard/accts-payable/purchas-ord-vouch-sett",
                  permission: "organization",
                },
                {
                  label: "Configure Voucher Approver Settings",
                  path: "/dashboard/accts-payable/voucher-approver-sett",
                  permission: "organization",
                },
                {
                  label: "Recurring A/P Voucher Codes",
                  path: "/dashboard/accts-payable/recc-apV-code",
                  permission: "organization",
                },
                // {
                //   label: "Credit Card Import Information",
                //   path: "/dashboard/accts-payable/credit-card-imp-info",
                //   permission: "organization",
                // },
                {
                  label: "Insurance Carrier Information",
                  path: "/dashboard/accts-payable/insurance-carr-info",
                  permission: "organization",
                },
                {
                  label: "Construction Industry Scheme Codes",
                  path: "/dashboard/accts-payable/const-industry-sch-code",
                  permission: "organization",
                },
              ],
            },
            {
              label: "Vouchers",
              subItems: [
                {
                  label: "Accounts Payable Vouchers",
                  path: "/dashboard/accts-payable/accounts-payable-vouchers",
                  permission: "organization",
                },
                {
                  label: "Approve Vouchers",
                  path: "/dashboard/accts-payable/approve-vouchers",
                  permission: "organization",
                },
              ],
            },

            {
              label: "Vendor",
              subItems: [
                {
                  label: "Prospective Vendor",
                  path: "/dashboard/vendor/manage-prospective-vendors",
                  permission: "vendor",
                },
                {
                  label: "Vendor",
                  path: "/dashboard/vendor/manage-vendors",
                  permission: "vendor",
                },
                {
                  label: "Approve Vendor",
                  path: "/dashboard/vendor/approve-vendor",
                  permission: "vendor",
                },
                {
                  label: "User Define Label",
                  path: "/dashboard/userdefinedlabels/vendor",
                  permission: "vendor",
                },
                {
                  label: "User Define Information",
                  path: "/dashboard/userdefinedinformation/vendor",
                  permission: "vendor",
                },
                {
                  label: "Vendor Employee",
                  path: "/dashboard/vendor-employee/manage-vendor-employee",
                  permission: "vendor",
                },
                {
                  label: "Approve Vendor Employee",
                  path: "/dashboard/vendor-employee/approve-vendor-employee",
                  permission: "vendor",
                },
              ],
            },
            {
              label: "Vendor and Subcontractor Controls",
              subItems: [
                {
                  label: "Configure Vendor Settings",
                  path: "/dashboard/vendSubControls/configVendSetting",
                  permission: "organization",
                },
                {
                  label: "Manage Vendor Terms",
                  path: "/dashboard/vendSubControls/manage-vendor-terms",
                  permission: "organization",
                },
                {
                  label: "Subcontractor Insurance Types",
                  path: "/dashboard/vendSubControls/insuranceTypes",
                  permission: "organization",
                },
                {
                  label: "Subcontractor Bond Types",
                  path: "/dashboard/vendSubControls/bondTypes",
                  permission: "organization",
                },
                {
                  label: "Prospective Vendor Rejection Reasons",
                  path: "/dashboard/vendSubControls/reasonCode",
                  permission: "organization",
                },
                {
                  label: "Security Clearance Settings",
                  path: "/dashboard/vendSubControls/secClearSettings",
                  permission: "organization",
                },
                {
                  label: "SCI/SAP Clearance Codes",
                  path: "/dashboard/vendSubControls/scisapSettings",
                  permission: "organization",
                },
                {
                  label: "Vendor Employee Aproval Groups",
                  path: "/dashboard/vendSubControls/vendoremplAprvlGrps",
                  permission: "organization",
                },
                {
                  label: "Vendor Terms",
                  path: "/dashboard/manage-vendor-terms",
                  permission: "organization",
                },
                {
                  label: "Profession Organizations",
                  path: "/dashboard/vendSubControls/profOrg",
                  permission: "organization",
                },
                {
                  label: "Skill Codes",
                  path: "/dashboard/vendSubControls/skillCodes",
                  permission: "organization",
                },
                {
                  label: "Skill Levels",
                  path: "/dashboard/vendSubControls/skillLevels",
                  permission: "organization",
                },
                {
                  label: "Training Codes",
                  path: "/dashboard/vendSubControls/trainingCodes",
                  permission: "organization",
                },
                {
                  label: "Training Sources",
                  path: "/dashboard/vendSubControls/trainingSource",
                  permission: "organization",
                },
                {
                  label: "Company Property",
                  path: "/dashboard/vendSubControls/companyProperty",
                  permission: "organization",
                },
              ],
            },
            // {
            //   label: "Vendor Employee",
            //   subItems: [
            //     {
            //       label: "Vendor Employee",
            //       path: "/dashboard/vendor-employee/manage-vendor-employee",
            //       permission: "vendor",
            //     },
            //     {
            //       label: "Approve Vendor Employee",
            //       path: "/dashboard/vendor-employee/approve-vendor-employee",
            //       permission: "vendor",
            //     },
            //   ],
            // },
            // {
            //   label: "Prospective Vendors",
            //   subItems: [
            //     {
            //       label: "Prospective Vendor",
            //       path: "/dashboard/vendor/manage-prospective-vendors",
            //       permission: "vendor",
            //     },
            //   ],
            // },
            {
              label: "Employee",
              subItems: [
                {
                  label: "User Define Label",
                  path: "/dashboard/userdefinedlabels/employee",
                  permission: "employee",
                },
                {
                  label: "User Define Information",
                  path: "/dashboard/userdefinedinformation/employee",
                  permission: "employee",
                },
              ],
            },
            {
              label: "Reference Number",
              subItems: [
                {
                  label: "Reference",
                  path: "/dashboard/manage-reference",
                  permission: "employee",
                },
                // {
                //   label: "User Define Information",
                //   path: "/dashboard/userdefinedinformation/employee",
                //   permission: "employee",
                // },
              ],
            },

            // {
            //   label: "Project",
            //   subItems: [
            //     {
            //       label: "Project",
            //       path: "/dashboard/project-master",
            //       permission: "project",
            //     },
            //     {
            //       label: "project Template",
            //       path: "/dashboard/manage-proj-template",
            //       permission: "project",
            //     },
            //   ],
            // },
            // {
            //   label: "Prospective Vendor",
            //   subItems: [
            //     {
            //       label: "Prospective Vendor",
            //       path: "/dashboard/prospective-vendor/manage-prospective-vendor",
            //       permission: "prospectiveVendor",
            //     },
            //     {
            //       label: "Approve Prospective Vendor",
            //       path: "/dashboard/prospective-vendor/approve-prospective-vendor",
            //       permission: "prospectiveVendor",
            //     },
            //   ],
            // },
          ],
        },
        {
          label: "Accounts Receivable",
          subItems: [
            {
              label: "Customers",
              subItems: [
                {
                  label: "Customers",
                  path: "/dashboard/customer/manage-customer",
                  permission: "fiscalYear",
                },
                // {
                //   // label: "Accounting Period",
                //   path: "/dashboard/manage-accountingperiod",
                //   permission: "fiscalYear",
                // },
                // {
                //   label: "Subperiod",
                //   path: "/dashboard/manage-subperiod",
                //   permission: "fiscalYear",
                // },
              ],
            },
            {
              label: "Accounts Receivable Controls",
              subItems: [
                {
                  label: "Customers Types",
                  path: "/dashboard/customer/manage-customer-types",
                  permission: "fiscalYear",
                },
                {
                  label: "Customers Credit Limits",
                  path: "/dashboard/customer/manage-customer-crLimts",
                  permission: "fiscalYear",
                },
                {
                  label: "Customers Credit Ratings",
                  path: "/dashboard/customer/manage-customer-crRating",
                  permission: "fiscalYear",
                },
                {
                  label: "Sales Territories",
                  path: "/dashboard/customer/manage-customer-sTerr",
                  permission: "fiscalYear",
                },
                {
                  label: "Shipping Methods",
                  path: "/dashboard/customer/manage-customer-sMethod",
                  permission: "fiscalYear",
                },
                {
                  label: "Customer Terms",
                  path: "/dashboard/customer/manage-customer-terms",
                  permission: "fiscalYear",
                },
                // {
                //   // label: "Accounting Period",
                //   path: "/dashboard/manage-accountingperiod",
                //   permission: "fiscalYear",
                // },
                // {
                //   label: "Subperiod",
                //   path: "/dashboard/manage-subperiod",
                //   permission: "fiscalYear",
                // },
              ],
            },
          ],
        },
      ],
    },
  ];

  const Admin = [
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
            {
              label: "Sales Taxes",
              path: "/dashboard/manage-sales-taxes",
              permission: "organization",
            },
          ],
        },
        {
          label: "Orgnaization Security",
          // Example of a menu with sub-items
          subItems: [
            {
              label: "Organization",
              subItems: [
                {
                  label: "Organization Security Profile",
                  path: "/dashboard/prof-org-sec",
                  permission: "globalConfiguration",
                },
                {
                  label: "Organization Security Groups",
                  path: "/dashboard/groups-org-sec",
                  permission: "globalConfiguration",
                },
              ],
            },
          ],
        },
        {
          label: "Security",
          // Example of a menu with sub-items
          subItems: [
            {
              label: "System Security",
              subItems: [
                {
                  label: "User Groups",
                  path: "/dashboard/manage-user-groups",
                  permission: "globalConfiguration",
                },
                // {
                //   label: "Organization Security Groups",
                //   path: "/dashboard/org-security-groups",
                //   permission: "globalConfiguration",
                // },
              ],
            },
          ],
        },
        {
          label: "System Administration",
          // Example of a menu with sub-items
          subItems: [
            {
              label: "System Administration Controls",
              subItems: [
                {
                  label: "Set Up Company",
                  path: "/dashboard/company-master",
                  permission: "globalConfiguration",
                },
                // {
                //   label: "Manage Organization Security Groups",
                //   path: "/dashboard/org-security-groups",
                //   permission: "globalConfiguration",
                // },
              ],
            },
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

  const handleLinkClick = (path) => {
    navigate(path);
    setActiveModule(null); // Close flyout on click
  };

  const isExpanded = !isCollapsed || isRailHovered;

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (setIsSidebarOpen) setIsSidebarOpen(!next);
      return next;
    });
  };

  return (
    <div className="flex fixed inset-y-0 left-0 items-center ml-1 mt-5 z-50 font-sans pointer-events-none">
      {/* PANEL 1: STATIC ICON RAIL */}
      <div
        onMouseEnter={() => setIsRailHovered(true)}
        onMouseLeave={() => setIsRailHovered(false)}
        className={`h-[90%] bg-white rounded-xl border border-slate-200/90 flex flex-col items-center py-2.5 shadow-lg pointer-events-auto transition-all ease-in-out duration-300 ${
          isExpanded ? "w-48 px-2" : "w-14 px-1"
        }`}
      >
        {/* Rail Branding Header with Chevron Toggle Button */}
        <div className="w-full px-1.5 pt-0.5 pb-2 border-b border-slate-200/80 flex items-center justify-between overflow-hidden select-none mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 min-w-[32px] bg-[#0f49a3] rounded-lg flex items-center justify-center shadow-xs">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 pointer-events-none"
              }`}
            >
              <h2 className="font-bold text-xs text-slate-800 tracking-tight">FinAxis ERP</h2>
            </div>
          </div>
          {isExpanded && (
            <button
              onClick={toggleCollapse}
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer shrink-0"
              title={isCollapsed ? "Pin sidebar open" : "Collapse sidebar"}
            >
              <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {/* Dynamic Modules */}
        <div className="flex flex-col h-full w-full justify-between overflow-y-auto custom-scrollbar">
          <div>
            <RailIcon
              icon={<HomeIcon size={18} />}
              isHovered={isExpanded}
              active={pathname === "/dashboard"}
              label="Home"
              onClick={() => {
                setActiveModule(null); // Close any open flyouts
                navigate("/dashboard");
              }}
            />

            <div className="flex justify-center py-0.5">
              <div
                className={`h-[1px] bg-slate-200 transition-all duration-300 ${
                  isExpanded ? "w-full mx-2" : "w-6"
                }`}
              />
            </div>

            <RailIcon
              icon={<Search size={18} />}
              label="Search"
              isHovered={isExpanded}
              active={activeModule === "global-search"}
              onClick={() => {
                setSearchTerm("");
                setActiveModule(
                  activeModule === "global-search" ? null : "global-search",
                );
              }}
            />
            <RailIcon
              icon={<Clock size={18} />}
              label="Recent"
              isHovered={isExpanded}
              active={activeModule === "recent-history"}
              onClick={() => {
                setSearchTerm("");
                setActiveModule(
                  activeModule === "recent-history" ? null : "recent-history",
                );
              }}
            />
            {modules.map((mod) => (
              <RailIcon
                key={mod.id}
                icon={mod.icon}
                label={mod.label}
                active={activeModule === mod.id}
                isHovered={isExpanded}
                onClick={() => {
                  setSearchTerm("");
                  setActiveModule(activeModule === mod.id ? null : mod.id);
                }}
              />
            ))}
          </div>
          <div className="pt-2 border-t border-slate-200/80">
            {Admin.map((mod) => (
              <RailIcon
                key={mod.id}
                icon={mod.icon}
                label={mod.label}
                active={activeModule === mod.id}
                isHovered={isExpanded}
                onClick={() => {
                  setSearchTerm("");
                  setActiveModule(activeModule === mod.id ? null : mod.id);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* PANEL 2: THE FLYOUT (Triggered by activeModule) */}
      {activeModule && (
        <div className="flex items-center h-[80%] ml-1 pointer-events-auto">
          {/* Backdrop to close when clicking away */}
          <div
            className="fixed inset-0 bg-transparent z-[-1]"
            onClick={() => {
              setSearchTerm("");
              setActiveModule(null);
            }}
          />

          <div className="relative w-64 bg-white shadow-2xl border border-slate-200/90 rounded-xl flex flex-col animate-in slide-in-from-left-2 duration-200 h-full overflow-hidden">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-200/80 flex justify-between items-center bg-[#0f49a3]/5 select-none">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 min-w-[24px] bg-[#0f49a3] rounded-md flex items-center justify-center shadow-2xs">
                  {activeModule === "recent-history" ? (
                    <Clock size={13} className="text-white" />
                  ) : (
                    <Layers size={13} className="text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xs font-bold text-slate-800 tracking-wide truncate">
                    {activeModule === "recent-history"
                      ? "Recent Pages"
                      : [...modules, ...Admin].find((m) => m.id === activeModule)?.label ||
                        (activeModule === "global-search" ? "Global Search" : "Menu")}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveModule(null);
                }}
                className="p-1 hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-3 flex-1 flex flex-col min-h-0">
              {/* Search Bar */}
              {(activeModule === "global-search" || activeModule === "recent-history") && (
                <div className="relative mb-3">
                  <Search
                    className="absolute left-3 top-2.5 text-slate-400"
                    size={14}
                  />
                  <input
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0f49a3]/30 focus:border-[#0f49a3] transition-all"
                    placeholder={
                      activeModule === "recent-history"
                        ? "Filter recent pages..."
                        : "Quick find..."
                    }
                    autoFocus
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value.toLowerCase())
                    }
                  />
                </div>
              )}

              {/* Scrollable Navigation Area */}
              {activeModule === "recent-history" ? (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                    {recentPages
                      .filter((p) =>
                        !searchTerm.trim()
                          ? true
                          : p.title.toLowerCase().includes(searchTerm)
                      )
                      .map((page, idx) => (
                        <button
                          key={page.path + idx}
                          onClick={() => handleLinkClick(page.path)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                            pathname === page.path
                              ? "bg-[#0f49a3] text-white font-semibold"
                              : "text-slate-700 hover:bg-[#0f49a3]/10 hover:text-[#0f49a3]"
                          }`}
                        >
                          <span className="truncate text-xs">
                            {page.title}
                          </span>
                        </button>
                      ))}

                    {recentPages.length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        <Clock size={24} className="mx-auto mb-2 opacity-40" />
                        No recent pages visited yet
                      </div>
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-200/80 flex items-center justify-between text-[10.5px] text-slate-500">
                    <span className="font-semibold text-slate-400">
                      Shortcut: <span className="text-[#0f49a3]">Alt + R</span>
                    </span>
                    {recentPages.length > 0 && (
                      <button
                        onClick={clearRecentPages}
                        className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={11} /> Clear
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <nav className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                {(activeModule === "global-search"
                  ? [...modules, ...Admin]
                  : [[...modules, ...Admin].find((m) => m.id === activeModule)]
                )
                  .filter(Boolean)
                  .map((section) => {
                    const isSearching = activeModule === "global-search" && Boolean(searchTerm.trim());
                    const filteredItems = (section.items || []).filter(
                      (item) => {
                        const hasPerm = !item.permission || (typeof canView === "function" ? canView(item.permission) : true);
                        const notHidden = !isHidden(item.permission);
                        const matchSearch = isSearching
                          ? item.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
                          : true;
                        return hasPerm && notHidden && matchSearch;
                      }
                    );

                    if (filteredItems.length === 0) return null;

                    return (
                      <div key={section.id} className="space-y-1">
                        {activeModule === "global-search" && (
                          <div className="px-3 py-1 text-[10px] font-semibold text-[#0f49a3] uppercase tracking-wider">
                            {section.label}
                          </div>
                        )}

                        {filteredItems.map((item) => {
                          const hasSubItems = item.subItems?.length > 0;
                          const itemKey = item.path || item.label;
                          const isSubOpen = openSubMenus[itemKey];

                          return (
                            <div key={itemKey} className="flex flex-col">
                              {/* LEVEL 1 */}
                              <button
                                onClick={() =>
                                  hasSubItems
                                    ? toggleSubMenu(itemKey)
                                    : handleLinkClick(item.path)
                                }
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                  pathname === item.path
                                    ? "bg-[#0f49a3] text-white shadow-xs font-semibold"
                                    : "text-slate-700 hover:bg-[#0f49a3]/10 hover:text-[#0f49a3]"
                                }`}
                              >
                                <span className="truncate">{item.label}</span>

                                {hasSubItems && (
                                  <ChevronRight
                                    size={14}
                                    className={`transition-transform duration-200 ${
                                      isSubOpen ? "rotate-90 text-[#0f49a3]" : "text-slate-400"
                                    }`}
                                  />
                                )}
                              </button>

                              {/* LEVEL 2 */}
                              {hasSubItems && isSubOpen && (
                                <div className="ml-3 mt-1 space-y-1 pl-2 border-l border-slate-200/80 animate-in slide-in-from-top-1">
                                  {item.subItems.map((sub) => {
                                    const hasNested = sub.subItems?.length > 0;
                                    const subKey = sub.path || sub.label;
                                    const isNestedOpen = openSubMenus[subKey];

                                    // ✅ NORMAL SUB ITEM
                                    if (!hasNested) {
                                      return (
                                        <button
                                          key={subKey}
                                          onClick={() =>
                                            handleLinkClick(sub.path)
                                          }
                                          className={`w-full text-left px-3.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                                            pathname === sub.path
                                              ? "bg-[#0f49a3] text-white font-semibold shadow-2xs"
                                              : "text-slate-600 hover:text-[#0f49a3] hover:bg-[#0f49a3]/10"
                                          }`}
                                        >
                                          {sub.label}
                                        </button>
                                      );
                                    }

                                    // ✅ LEVEL 3 DROPDOWN
                                    return (
                                      <div
                                        key={subKey}
                                        className="flex flex-col"
                                      >
                                        <button
                                          onClick={() => toggleSubMenu(subKey)}
                                          className="w-full flex items-center justify-between px-3.5 py-1.5 text-[11px] font-medium text-slate-600 hover:text-[#0f49a3] hover:bg-[#0f49a3]/10 rounded-lg cursor-pointer transition-all"
                                        >
                                          <span>{sub.label}</span>

                                          <ChevronRight
                                            size={12}
                                            className={`transition-transform duration-200 ${
                                              isNestedOpen ? "rotate-90 text-[#0f49a3]" : "text-slate-400"
                                            }`}
                                          />
                                        </button>

                                        {isNestedOpen && (
                                          <div className="ml-3 mt-1 space-y-1 pl-2 border-l border-slate-200/60">
                                            {sub.subItems.map((deep) => (
                                              <button
                                                key={deep.path}
                                                onClick={() =>
                                                  handleLinkClick(deep.path)
                                                }
                                                className={`w-full text-left px-3.5 py-1 rounded-md text-[10.5px] font-medium transition-all cursor-pointer ${
                                                  pathname === deep.path
                                                    ? "bg-[#0f49a3] text-white font-semibold"
                                                    : "text-slate-500 hover:text-[#0f49a3] hover:bg-[#0f49a3]/10"
                                                }`}
                                              >
                                                {deep.label}
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
              </nav>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Sub-component for the Rail Icons */
const RailIcon = ({ icon, label, onClick, active, isHovered }) => (
  <div className="flex flex-col mb-1.5 items-center w-full px-1.5">
    <button
      onClick={onClick}
      className={`w-full flex items-center cursor-pointer p-2 rounded-lg transition-all duration-200 group relative ${
        active
          ? "bg-[#0f49a3] text-white shadow-xs font-semibold"
          : "text-slate-600 hover:bg-[#0f49a3]/10 hover:text-[#0f49a3]"
      }`}
    >
      <div className="min-w-[20px] h-4 flex items-center justify-center">
        {icon}
      </div>

      <div
        className={`ml-2.5 transition-all duration-200 overflow-hidden whitespace-nowrap ${
          isHovered ? "opacity-100 w-auto" : "opacity-0 w-0 pointer-events-none"
        }`}
      >
        <span className="text-xs font-medium tracking-wide">{label}</span>
      </div>
    </button>
  </div>
);

export default NavigationSidebar;
