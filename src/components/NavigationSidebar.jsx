// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   X,
//   ChevronDown,
//   ChevronRight,
//   BarChart2,
//   Layers,
//   BriefcaseBusiness,
//   Users,
//   Home,
//   LayoutDashboard,
//   Star,
//   Clock,
//   Search,
//   Settings,
//   HomeIcon,
//   Calculator,
// } from "lucide-react";

// const NavigationSidebar = ({ canView }) => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   // State for which main module is active/open in the flyout
//   const [activeModule, setActiveModule] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isRailHovered, setIsRailHovered] = useState(false);
//   const [openSubMenus, setOpenSubMenus] = useState({});

//   const HIDDEN_FEATURES =
//     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
//   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

//   const toggleSubMenu = (key) => {
//     setOpenSubMenus((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   // Define the structure based on your current logic
//   const modules = [
//     {
//       id: "planning",
//       label: "Planning",
//       icon: <BarChart2 size={20} />,
//       items: [
//         { label: "Project Planning", path: "/dashboard/project-budget-status" },
//         {
//           label: "Reporting",
//           path: "/dashboard/project-report",
//           permission: "projectReport",
//         },
//         {
//           label: "Mass Utility",
//           path: "/dashboard/mass-utility",
//           permission: "massUtility",
//         },
//         { label: "Pricing", path: "/dashboard/pricing", permission: "pricing" },
//         {
//           label: "Financial Report",
//           path: "/dashboard/financial-report",
//           permission: "financialReport",
//         },
//       ],
//     },
//     {
//       id: "business",
//       label: "New Business",
//       icon: <BriefcaseBusiness size={20} />,
//       items: [
//         {
//           label: "Import Opportunity",
//           path: "/dashboard/import-opportunity",
//           permission: "impOpportunity",
//         },
//         {
//           label: "Manage New Business",
//           path: "/dashboard/new-business",
//           permission: "manageNewBusiness",
//         },
//         {
//           label: "Transfer Project Budget",
//           path: "/dashboard/create-project-budget",
//           permission: "transferUtility",
//         },
//       ],
//     },
//     {
//       id: "manage",
//       label: "Manage",
//       icon: <Users size={20} />,
//       items: [
//         {
//           label: "Manage Groups",
//           path: "/dashboard/manage-groups",
//           permission: "manageGroups",
//         },
//         {
//           label: "Manage Users",
//           path: "/dashboard/manage-users",
//           permission: "manageUser",
//         },
//         { label: "Manage Accounts", path: "/dashboard/account-master" },
//         { label: "Manage Orgs", path: "/dashboard/org-master" },
//         { label: "Manage Employees", path: "/dashboard/employee-master" },
//         {
//           label: "Manage Project Roles",
//           path: "/dashboard/manage-project-role",
//         },
//         { label: "Manage Revenue", path: "/dashboard/manage-revenue" },
//         {
//           label: "Manage Revenue Formulas",
//           path: "/dashboard/manage-revenue-formulas",
//         },
//         {
//           label: "Print Project Revenue & Billing Formulas",
//           path: "/dashboard/print-revenue-billing-formulas",
//         },
//         {
//           label: "Manage Rate Sequence Orders",
//           path: "/dashboard/manage-rate-sequence-orders",
//         },
//         { label: "Manage Cost of Goods Sold", path: "/dashboard/manage-cogs" },
//         {
//           label: "Manage Alternate Project Revenue Profiles",
//           path: "/dashboard/manage-alternate-project-revenue-profiles",
//         },
//         {
//           label: "Manage Alternate Revenue Profile Prior Year History",
//           path: "/dashboard/manage-alternate-revenue-profile-prior-year-history",
//         },
//         {
//           label: "Manage Project Revenue Calculation Value History",
//           path: "/dashboard/manage-project-revenue-calculation-value-history",
//         },
//         {
//           label: "Manage Revenue Evaluation Info and Disclosures",
//           path: "/dashboard/manage-revenue-evaluation-info-and-disclosures",
//         },
//         {
//           label: "Manage Revenue Evaluation Status Codes",
//           path: "/dashboard/manage-revenue-evaluation-status-codes",
//         },
//         {
//           label: "Manage Performance Obligation Type Codes",
//           path: "/dashboard/manage-performance-obligation-type-codes",
//         },
//         {
//           label: "Manage Total Ceilings",
//           path: "/dashboard/manage-total-ceilings",
//         },
//         {
//           label: "Manage Burden Cost Ceilings",
//           path: "/dashboard/manage-burden-cost-ceilings",
//         },
//         {
//           label: "Manage Direct Cost Ceilings",
//           path: "/dashboard/manage-direct-cost-ceilings",
//         },
//         {
//           label: "Manage Burden Fee Overrides",
//           path: "/dashboard/manage-burden-fee-overrides",
//         },
//         {
//           label: "Manage Cost Fee Overrides",
//           path: "/dashboard/manage-cost-fee-overrides",
//         },
//         {
//           label: "Manage Multiplier Overrides",
//           path: "/dashboard/manage-multiplier-overrides",
//         },
//         {
//           label: "Manage Hours Ceilings",
//           path: "/dashboard/manage-hours-ceilings",
//         },
//         {
//           label: "Manage Employee Hours Ceilings",
//           path: "/dashboard/manage-employee-hours-ceilings",
//         },
//         {
//           label: "Manage Vendor Hours Ceilings",
//           path: "/dashboard/manage-vendor-hours-ceilings",
//         },
//         {
//           label: "Project Labor Categories (PLC)",
//           path: "/dashboard/manage-plc",
//         },
//         {
//           label: "Link PLCs to Projects",
//           path: "/dashboard/link-plc-to-projects",
//         },
//         {
//           label: "Link PLC Rates to Projects",
//           path: "/dashboard/link-plc-rates-to-projects",
//         },
//       ],
//     },
//     {
//       id: "accounts",
//       label: "Accounting",
//       icon: <Calculator size={20} />,
//       items: [
//         {
//           label: "General Ledger",
//           subItems: [
//             {
//               label: "Company Calendar",
//               subItems: [
//                 {
//                   label: "Fiscal Year",
//                   path: "/dashboard/manage-fiscalyear",
//                   permission: "fiscalYear",
//                 },
//                 {
//                   label: "Accounting Period",
//                   path: "/dashboard/manage-accountingperiod",
//                   permission: "fiscalYear",
//                 },
//                 {
//                   label: "Subperiod",
//                   path: "/dashboard/manage-subperiod",
//                   permission: "fiscalYear",
//                 },
//               ],
//             },
//             {
//               label: "Organizations",
//               subItems: [
//                 {
//                   label: "Organization Setup",
//                   path: "/dashboard/org-master",
//                   permission: "organization",
//                 },
//                 {
//                   label: "User Define Label",
//                   path: "/dashboard/userdefinedlabels/organization",
//                   permission: "organization",
//                 },
//                 {
//                   label: "User Define Information",
//                   path: "/dashboard/userdefinedinformation/organization",
//                   permission: "organization",
//                 },
//               ],
//             },
//             {
//               label: "Reorganization",
//               subItems: [
//                 {
//                   label: "Reorganization Setup",
//                   path: "/dashboard/reorganization/reorg-setup",
//                   permission: "reorganization",
//                 },
//                 {
//                   label: "Link Reorganization/Organizations",
//                   path: "/dashboard/reorganization/link-org-reorg",
//                   permission: "reorganization",
//                 },
//                 {
//                   label: "Mass Link Reorganization/Organizations",
//                   path: "/dashboard/reorganization/masslink-org-reorg",
//                   permission: "reorganization",
//                 },
//               ],
//             },
//             {
//               label: "Accounts",
//               subItems: [
//                 {
//                   label: "Accounts",
//                   path: "/dashboard/account-master",
//                   permission: "account",
//                 },
//                 {
//                   label: "Link Accounts/Organizations",
//                   path: "/dashboard/account-org-link",
//                   permission: "account",
//                 },
//                 {
//                   label: "Mass Link Accounts/Organizations",
//                   path: "/dashboard/accounts-orgs-link",
//                   permission: "account",
//                 },
//                 {
//                   label: "User Define Label",
//                   path: "/dashboard/userdefinedlabels/account",
//                   permission: "account",
//                 },
//                 {
//                   label: "User Define Information",
//                   path: "/dashboard/userdefinedinformation/account",
//                   permission: "account",
//                 },
//               ],
//             },
//             // {
//             //   label: "Vendor",
//             //   subItems: [
//             //     {
//             //       label: "Vendor",
//             //       path: "/dashboard/vendor/manage-vendors",
//             //       permission: "vendor",
//             //     },
//             //     {
//             //       label: "User Define Label",
//             //       path: "/dashboard/userdefinedlabels/vendor",
//             //       permission: "vendor",
//             //     },
//             //     {
//             //       label: "User Define Information",
//             //       path: "/dashboard/userdefinedinformation/vendor",
//             //       permission: "vendor",
//             //     },
//             //   ],
//             // },
//             {
//               label: "Employee",
//               subItems: [
//                 {
//                   label: "User Define Label",
//                   path: "/dashboard/userdefinedlabels/employee",
//                   permission: "employee",
//                 },
//                 {
//                   label: "User Define Information",
//                   path: "/dashboard/userdefinedinformation/employee",
//                   permission: "employee",
//                 },
//               ],
//             },
//             {
//               label: "Reference Number",
//               subItems: [
//                 {
//                   label: "Reference",
//                   path: "/dashboard/manage-reference",
//                   permission: "employee",
//                 },
//                 // {
//                 //   label: "User Define Information",
//                 //   path: "/dashboard/userdefinedinformation/employee",
//                 //   permission: "employee",
//                 // },
//               ],
//             },

//             // {
//             //   label: "Project",
//             //   subItems: [
//             //     {
//             //       label: "Project",
//             //       path: "/dashboard/project-master",
//             //       permission: "project",
//             //     },
//             //     {
//             //       label: "project Template",
//             //       path: "/dashboard/manage-proj-template",
//             //       permission: "project",
//             //     },
//             //   ],
//             // },
//             // {
//             //   label: "Prospective Vendor",
//             //   subItems: [
//             //     {
//             //       label: "Prospective Vendor",
//             //       path: "/dashboard/prospective-vendor/manage-prospective-vendor",
//             //       permission: "prospectiveVendor",
//             //     },
//             //     {
//             //       label: "Approve Prospective Vendor",
//             //       path: "/dashboard/prospective-vendor/approve-prospective-vendor",
//             //       permission: "prospectiveVendor",
//             //     },
//             //   ],
//             // },
//           ],
//         },
//         {
//           label: "Accounts Payable",
//           subItems: [
//             // {
//             //   label: "Vendor",
//             //   subItems: [
//             //     // {
//             //     //   label: "Fiscal Year",
//             //     //   path: "/dashboard/manage-fiscalyear",
//             //     //   permission: "fiscalYear",
//             //     // },
//             //     // {
//             //     //   // label: "Accounting Period",
//             //     //   path: "/dashboard/manage-accountingperiod",
//             //     //   permission: "fiscalYear",
//             //     // },
//             //     // {
//             //     //   label: "Subperiod",
//             //     //   path: "/dashboard/manage-subperiod",
//             //     //   permission: "fiscalYear",
//             //     // },
//             //   ],
//             // },

//             {
//               label: "Accounts Payable Controls",
//               subItems: [
//                 {
//                   label: "Configure Accounts Payable Settings",
//                   path: "/dashboard/accts-payable/accounts-payable-configure",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Configure Check/EFT Email Settings",
//                   path: "/dashboard/accts-payable/check-email-setting",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Accounts Payable Accounts",
//                   path: "/dashboard/accts-payable/accounts-payable-settings",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Cash Accounts",
//                   path: "/dashboard/accts-payable/cash-accounts",
//                   permission: "organization",
//                 },
//                 // {
//                 //   label: "Cash Requirements Rpt Supplemental Amounts",
//                 //   path: "/dashboard/accts-payable/cash-supp-amounts",
//                 //   permission: "organization",
//                 // },
//                 {
//                   label: "Configure Accounts Payable Voucher Settings",
//                   path: "/dashboard/accts-payable/accts-payable-voucher",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Configure Purchase Order Voucher Settings",
//                   path: "/dashboard/accts-payable/purchas-ord-vouch-sett",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Configure Voucher Approver Settings",
//                   path: "/dashboard/accts-payable/voucher-approver-sett",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Recurring A/P Voucher Codes",
//                   path: "/dashboard/accts-payable/recc-apV-code",
//                   permission: "organization",
//                 },
//                 // {
//                 //   label: "Credit Card Import Information",
//                 //   path: "/dashboard/accts-payable/credit-card-imp-info",
//                 //   permission: "organization",
//                 // },
//                 {
//                   label: "Insurance Carrier Information",
//                   path: "/dashboard/accts-payable/insurance-carr-info",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Construction Industry Scheme Codes",
//                   path: "/dashboard/accts-payable/const-industry-sch-code",
//                   permission: "organization",
//                 },
//               ],
//             },

//             {
//               label: "Vendor",
//               subItems: [
//                 {
//                   label: "Prospective Vendor",
//                   path: "/dashboard/vendor/manage-prospective-vendors",
//                   permission: "vendor",
//                 },
//                 {
//                   label: "Vendor",
//                   path: "/dashboard/vendor/manage-vendors",
//                   permission: "vendor",
//                 },
//                 {
//                   label: "Approve Vendor",
//                   path: "/dashboard/vendor/approve-vendor",
//                   permission: "vendor",
//                 },
//                 {
//                   label: "User Define Label",
//                   path: "/dashboard/userdefinedlabels/vendor",
//                   permission: "vendor",
//                 },
//                 {
//                   label: "User Define Information",
//                   path: "/dashboard/userdefinedinformation/vendor",
//                   permission: "vendor",
//                 },
//                 {
//                   label: "Vendor Employee",
//                   path: "/dashboard/vendor-employee/manage-vendor-employee",
//                   permission: "vendor",
//                 },
//                 {
//                   label: "Approve Vendor Employee",
//                   path: "/dashboard/vendor-employee/approve-vendor-employee",
//                   permission: "vendor",
//                 },
//               ],
//             },
//             {
//               label: "Vendor and Subcontractor Controls",
//               subItems: [
//                 {
//                   label: "Configure Vendor Settings",
//                   path: "/dashboard/vendSubControls/configVendSetting",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Manage Vendor Terms",
//                   path: "/dashboard/vendSubControls/manage-vendor-terms",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Subcontractor Insurance Types",
//                   path: "/dashboard/vendSubControls/insuranceTypes",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Subcontractor Bond Types",
//                   path: "/dashboard/vendSubControls/bondTypes",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Prospective Vendor Rejection Reasons",
//                   path: "/dashboard/vendSubControls/reasonCode",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Security Clearance Settings",
//                   path: "/dashboard/vendSubControls/secClearSettings",
//                   permission: "organization",
//                 },
//                 {
//                   label: "SCI/SAP Clearance Codes",
//                   path: "/dashboard/vendSubControls/scisapSettings",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Vendor Employee Aproval Groups",
//                   path: "/dashboard/vendSubControls/vendoremplAprvlGrps",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Vendor Terms",
//                   path: "/dashboard/manage-vendor-terms",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Profession Organizations",
//                   path: "/dashboard/vendSubControls/profOrg",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Skill Codes",
//                   path: "/dashboard/vendSubControls/skillCodes",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Skill Levels",
//                   path: "/dashboard/vendSubControls/skillLevels",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Training Codes",
//                   path: "/dashboard/vendSubControls/trainingCodes",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Training Sources",
//                   path: "/dashboard/vendSubControls/trainingSource",
//                   permission: "organization",
//                 },
//                 {
//                   label: "Company Property",
//                   path: "/dashboard/vendSubControls/companyProperty",
//                   permission: "organization",
//                 },
//               ],
//             },
//             // {
//             //   label: "Vendor Employee",
//             //   subItems: [
//             //     {
//             //       label: "Vendor Employee",
//             //       path: "/dashboard/vendor-employee/manage-vendor-employee",
//             //       permission: "vendor",
//             //     },
//             //     {
//             //       label: "Approve Vendor Employee",
//             //       path: "/dashboard/vendor-employee/approve-vendor-employee",
//             //       permission: "vendor",
//             //     },
//             //   ],
//             // },
//             // {
//             //   label: "Prospective Vendors",
//             //   subItems: [
//             //     {
//             //       label: "Prospective Vendor",
//             //       path: "/dashboard/vendor/manage-prospective-vendors",
//             //       permission: "vendor",
//             //     },
//             //   ],
//             // },
//             {
//               label: "Employee",
//               subItems: [
//                 {
//                   label: "User Define Label",
//                   path: "/dashboard/userdefinedlabels/employee",
//                   permission: "employee",
//                 },
//                 {
//                   label: "User Define Information",
//                   path: "/dashboard/userdefinedinformation/employee",
//                   permission: "employee",
//                 },
//               ],
//             },
//             {
//               label: "Reference Number",
//               subItems: [
//                 {
//                   label: "Reference",
//                   path: "/dashboard/manage-reference",
//                   permission: "employee",
//                 },
//                 // {
//                 //   label: "User Define Information",
//                 //   path: "/dashboard/userdefinedinformation/employee",
//                 //   permission: "employee",
//                 // },
//               ],
//             },

//             // {
//             //   label: "Project",
//             //   subItems: [
//             //     {
//             //       label: "Project",
//             //       path: "/dashboard/project-master",
//             //       permission: "project",
//             //     },
//             //     {
//             //       label: "project Template",
//             //       path: "/dashboard/manage-proj-template",
//             //       permission: "project",
//             //     },
//             //   ],
//             // },
//             // {
//             //   label: "Prospective Vendor",
//             //   subItems: [
//             //     {
//             //       label: "Prospective Vendor",
//             //       path: "/dashboard/prospective-vendor/manage-prospective-vendor",
//             //       permission: "prospectiveVendor",
//             //     },
//             //     {
//             //       label: "Approve Prospective Vendor",
//             //       path: "/dashboard/prospective-vendor/approve-prospective-vendor",
//             //       permission: "prospectiveVendor",
//             //     },
//             //   ],
//             // },
//           ],
//         },
//         {
//           label: "Accounts Receivable",
//           subItems: [
//             {
//               label: "Customers",
//               subItems: [
//                 {
//                   label: "Customers",
//                   path: "/dashboard/customer/manage-customer",
//                   permission: "fiscalYear",
//                 },
//                 // {
//                 //   // label: "Accounting Period",
//                 //   path: "/dashboard/manage-accountingperiod",
//                 //   permission: "fiscalYear",
//                 // },
//                 // {
//                 //   label: "Subperiod",
//                 //   path: "/dashboard/manage-subperiod",
//                 //   permission: "fiscalYear",
//                 // },
//               ],
//             },
//             {
//               label: "Accounts Receivable Controls",
//               subItems: [
//                 {
//                   label: "Customers Types",
//                   path: "/dashboard/customer/manage-customer-types",
//                   permission: "fiscalYear",
//                 },
//                 {
//                   label: "Customers Credit Limits",
//                   path: "/dashboard/customer/manage-customer-crLimts",
//                   permission: "fiscalYear",
//                 },
//                 {
//                   label: "Customers Credit Ratings",
//                   path: "/dashboard/customer/manage-customer-crRating",
//                   permission: "fiscalYear",
//                 },
//                 {
//                   label: "Sales Territories",
//                   path: "/dashboard/customer/manage-customer-sTerr",
//                   permission: "fiscalYear",
//                 },
//                 {
//                   label: "Shipping Methods",
//                   path: "/dashboard/customer/manage-customer-sMethod",
//                   permission: "fiscalYear",
//                 },
//                 {
//                   label: "Customer Terms",
//                   path: "/dashboard/customer/manage-customer-terms",
//                   permission: "fiscalYear",
//                 },
//                 // {
//                 //   // label: "Accounting Period",
//                 //   path: "/dashboard/manage-accountingperiod",
//                 //   permission: "fiscalYear",
//                 // },
//                 // {
//                 //   label: "Subperiod",
//                 //   path: "/dashboard/manage-subperiod",
//                 //   permission: "fiscalYear",
//                 // },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ];

//   const Admin = [
//     {
//       id: "settings",
//       label: "Admin",
//       icon: <Settings size={20} />,
//       items: [
//         {
//           label: "Configuration",
//           // Example of a menu with sub-items
//           subItems: [
//             {
//               label: "Global Settings",
//               path: "/dashboard/global-configuration",
//               permission: "globalConfiguration",
//             },
//           ],
//         },
//         {
//           label: "Orgnaization Security",
//           // Example of a menu with sub-items
//           subItems: [
//             {
//               label: "Organization",
//               subItems: [
//                 {
//                   label: "Organization Security Profile",
//                   path: "/dashboard/prof-org-sec",
//                   permission: "globalConfiguration",
//                 },
//                 {
//                   label: "Organization Security Groups",
//                   path: "/dashboard/groups-org-sec",
//                   permission: "globalConfiguration",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           label: "Security",
//           // Example of a menu with sub-items
//           subItems: [
//             {
//               label: "System Security",
//               subItems: [
//                 {
//                   label: "User Groups",
//                   path: "/dashboard/manage-user-groups",
//                   permission: "globalConfiguration",
//                 },
//                 // {
//                 //   label: "Organization Security Groups",
//                 //   path: "/dashboard/org-security-groups",
//                 //   permission: "globalConfiguration",
//                 // },
//               ],
//             },
//           ],
//         },
//         {
//           label: "System Administration",
//           // Example of a menu with sub-items
//           subItems: [
//             {
//               label: "System Administration Controls",
//               subItems: [
//                 {
//                   label: "Set Up Company",
//                   path: "/dashboard/company-master",
//                   permission: "globalConfiguration",
//                 },
//                 // {
//                 //   label: "Manage Organization Security Groups",
//                 //   path: "/dashboard/org-security-groups",
//                 //   permission: "globalConfiguration",
//                 // },
//               ],
//             },
//           ],
//         },
//         {
//           label: "Burden Setup",
//           path: "/dashboard/pool-rate-tabs",
//           permission: "poolRateTabs",
//         },
//         {
//           label: "Rights Settings",
//           path: "/dashboard/role-rights",
//           permission: "roleRights",
//         },
//       ],
//     },
//   ];

//   const handleLinkClick = (path) => {
//     navigate(path);
//     setActiveModule(null); // Close flyout on click
//   };

//   return (
//     <div className="flex fixed inset-y-0 left-0 items-center ml-1 mt-5 z-50 font-sans pointer-events-none">
//       {/* PANEL 1: STATIC ICON RAIL */}
//       <div
//         onMouseEnter={() => setIsRailHovered(true)}
//         onMouseLeave={() => setIsRailHovered(false)}
//         className={` h-[90%] bg-white rounded-lg border border-[#17414d]/40  flex flex-col items-center py-4 space-y-4 shadow-sm pointer-events-auto transition-all ease-in-out delay-75 ${isRailHovered ? "w-40" : "w-12"}`}
//       >
//         {/* className={` h-[90%] bg-white rounded-lg border-t-4 border-b-4 border-[#17414d]  flex flex-col items-center py-4 space-y-4 shadow-sm pointer-events-auto transition-all ease-in-out delay-75 ${isRailHovered ? "w-38" : "w-12"}`}> */}

//         {/* Top Actions */}
//         {/* <RailIcon icon={<Home size={20} />} label="Home" onClick={() => navigate('/')} />
//         <RailIcon icon={<Star size={20} />} label="Favorites" />
//         <RailIcon icon={<Clock size={20} />} label="Recent" />

//         <div className="w-8 h-[1px] bg-gray-200 my-2" /> */}

//         {/* Dynamic Modules */}
//         <div className="flex flex-col h-full w-full justify-between">
//           <div>
//             <RailIcon
//               icon={<HomeIcon size={20} />}
//               isHovered={isRailHovered}
//               // Update: Check if the current URL is exactly /dashboard
//               active={pathname === "/dashboard"}
//               label="Home"
//               onClick={() => {
//                 setActiveModule(null); // Close any open flyouts
//                 navigate("/dashboard");
//               }}
//             />

//             <div className="flex justify-center py-0.5">
//               <div
//                 className={`h-[1px] bg-gray-200 transition-all duration-300 ${
//                   isRailHovered ? "w-full mx-2" : "w-6"
//                 }`}
//               />
//             </div>

//             <RailIcon
//               icon={<Search size={20} />}
//               label="Search"
//               isHovered={isRailHovered}
//               active={activeModule === "global-search"}
//               onClick={() =>
//                 setActiveModule(
//                   activeModule === "global-search" ? null : "global-search",
//                 )
//               }
//             />
//             {modules.map((mod) => (
//               <RailIcon
//                 key={mod.id}
//                 icon={mod.icon}
//                 label={mod.label}
//                 active={activeModule === mod.id}
//                 isHovered={isRailHovered}
//                 onClick={() =>
//                   setActiveModule(activeModule === mod.id ? null : mod.id)
//                 }
//               />
//             ))}
//           </div>
//           <div>
//             {Admin.map((mod) => (
//               <RailIcon
//                 key={mod.id}
//                 icon={mod.icon}
//                 label={mod.label}
//                 active={activeModule === mod.id}
//                 isHovered={isRailHovered}
//                 onClick={() =>
//                   setActiveModule(activeModule === mod.id ? null : mod.id)
//                 }
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* PANEL 2: THE FLYOUT (Triggered by activeModule) */}
//       {activeModule && (
//         <div className="flex items-center h-[80%] ml-1 pointer-events-auto">
//           {/* Backdrop to close when clicking away */}
//           <div
//             className="fixed inset-0 bg-transparent z-[-1]"
//             onClick={() => setActiveModule(null)}
//           />

//           <div className="relative w-64 bg-white shadow-2xl border border-gray-200 rounded-xl flex flex-col animate-in slide-in-from-left-2 duration-200 h-full overflow-hidden">
//             {/* Header */}
//             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
//               <h2 className="text-xs font-bold  tracking-wider text-gray-500">
//                 {/* Find label from either modules or Admin array */}
//                 {[...modules, ...Admin].find((m) => m.id === activeModule)
//                   ?.label || "Menu"}
//               </h2>
//               <button
//                 onClick={() => setActiveModule(null)}
//                 className="p-1 hover:bg-gray-200 rounded-full transition-colors"
//               >
//                 <X size={14} className="text-gray-400" />
//               </button>
//             </div>

//             <div className="p-3 flex-1 flex flex-col min-h-0">
//               {/* Search Bar */}
//               {activeModule === "global-search" && (
//                 <div className="relative mb-4">
//                   <Search
//                     className="absolute left-3 top-2.5 text-gray-400"
//                     size={14}
//                   />
//                   <input
//                     className="w-full bg-gray-100 border-none outline-none rounded-lg py-2 pl-9 text-xs  transition-all"
//                     placeholder="Quick find..."
//                     autoFocus
//                     onChange={(e) =>
//                       setSearchTerm(e.target.value.toLowerCase())
//                     }
//                   />
//                 </div>
//               )}

//               {/* Scrollable Navigation Area */}
//               <nav className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
//                 {(activeModule === "global-search"
//                   ? [...modules, ...Admin]
//                   : [[...modules, ...Admin].find((m) => m.id === activeModule)]
//                 )
//                   .filter(Boolean)
//                   .map((section) => {
//                     const filteredItems = section.items.filter(
//                       (item) =>
//                         (!item.permission || canView(item.permission)) &&
//                         !isHidden(item.permission) &&
//                         item.label.toLowerCase().includes(searchTerm),
//                     );

//                     if (filteredItems.length === 0) return null;

//                     return (
//                       <div key={section.id} className="space-y-1">
//                         {activeModule === "global-search" && (
//                           <div className="px-3 py-1 text-[10px] font-semibold text-[#104e64] opacity-70 tracking-tighter">
//                             {section.label}
//                           </div>
//                         )}

//                         {filteredItems.map((item) => {
//                           const hasSubItems = item.subItems?.length > 0;
//                           const itemKey = item.path || item.label;
//                           const isSubOpen = openSubMenus[itemKey];

//                           return (
//                             <div key={itemKey} className="flex flex-col">
//                               {/* LEVEL 1 */}
//                               <button
//                                 onClick={() =>
//                                   hasSubItems
//                                     ? toggleSubMenu(itemKey)
//                                     : handleLinkClick(item.path)
//                                 }
//                                 className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
//                                   pathname === item.path
//                                     ? "bg-[#104e64] text-white shadow-md"
//                                     : "text-gray-600 hover:bg-gray-100 hover:text-[#104e64]"
//                                 }`}
//                               >
//                                 <span className="truncate">{item.label}</span>

//                                 {hasSubItems && (
//                                   <ChevronRight
//                                     size={14}
//                                     className={`transition-transform ${
//                                       isSubOpen ? "rotate-90" : ""
//                                     }`}
//                                   />
//                                 )}
//                               </button>

//                               {/* LEVEL 2 */}
//                               {hasSubItems && isSubOpen && (
//                                 <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-1">
//                                   {item.subItems.map((sub) => {
//                                     const hasNested = sub.subItems?.length > 0;
//                                     const subKey = sub.path || sub.label;
//                                     const isNestedOpen = openSubMenus[subKey];

//                                     // ✅ NORMAL SUB ITEM
//                                     if (!hasNested) {
//                                       return (
//                                         <button
//                                           key={subKey}
//                                           onClick={() =>
//                                             handleLinkClick(sub.path)
//                                           }
//                                           className={`w-full text-left px-4 py-1.5 rounded-lg text-[11px] transition-all ${
//                                             pathname === sub.path
//                                               ? "bg-[#104e64] text-white"
//                                               : "text-gray-500 hover:text-[#104e64] hover:bg-gray-50"
//                                           }`}
//                                         >
//                                           {sub.label}
//                                         </button>
//                                       );
//                                     }

//                                     // ✅ LEVEL 3 DROPDOWN
//                                     return (
//                                       <div
//                                         key={subKey}
//                                         className="flex flex-col"
//                                       >
//                                         <button
//                                           onClick={() => toggleSubMenu(subKey)}
//                                           className="w-full flex items-center justify-between px-4 py-1.5 text-[11px] text-gray-500 hover:text-[#104e64] hover:bg-gray-50 rounded-lg"
//                                         >
//                                           <span>{sub.label}</span>

//                                           <ChevronRight
//                                             size={12}
//                                             className={`transition-transform ${
//                                               isNestedOpen ? "rotate-90" : ""
//                                             }`}
//                                           />
//                                         </button>

//                                         {isNestedOpen && (
//                                           <div className="ml-4 mt-1 space-y-1">
//                                             {sub.subItems.map((deep) => (
//                                               <button
//                                                 key={deep.path}
//                                                 onClick={() =>
//                                                   handleLinkClick(deep.path)
//                                                 }
//                                                 className={`w-full text-left px-4 py-1 rounded-md text-[10px] ${
//                                                   pathname === deep.path
//                                                     ? "bg-[#104e64] text-white"
//                                                     : "text-gray-400 hover:text-[#104e64] hover:bg-gray-50"
//                                                 }`}
//                                               >
//                                                 {deep.label}
//                                               </button>
//                                             ))}
//                                           </div>
//                                         )}
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     );
//                   })}
//               </nav>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* Sub-component for the Rail Icons */
// const RailIcon = ({ icon, label, onClick, active, isHovered }) => (
//   <div className="flex flex-col mb-2 items-center w-full px-1">
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center cursor-pointer p-2 rounded-lg transition-all duration-300 group relative ${
//         active ? "bg-[#104e64] text-white" : "text-black hover:bg-gray-100" // Use text-black here for the default state
//       }`}
//     >
//       {/* Icon Containe: Removed background/text logic to prevent flickering */}
//       <div className="min-w-[24px] h-4 flex items-center justify-center">
//         {icon}
//       </div>

//       {/* Label Container */}
//       <div
//         className={`ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap ${
//           isHovered ? "opacity-100 w-auto" : "opacity-0 w-0 pointer-events-none"
//         }`}
//       >
//         {/* Removed the background/text classes from the span */}
//         <span className="text-xs font-medium tracking-wide">{label}</span>
//       </div>
//     </button>
//   </div>
// );

// export default NavigationSidebar;

// // // // // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // // // // // // // // // import {
// // // // // // // // // // // //   Menu,
// // // // // // // // // // // //   X,
// // // // // // // // // // // //   ChevronDown,
// // // // // // // // // // // //   ChevronRight,
// // // // // // // // // // // //   Plus,
// // // // // // // // // // // //   Minus,
// // // // // // // // // // // //   BarChart2,
// // // // // // // // // // // //   Layers,
// // // // // // // // // // // //   FileText,
// // // // // // // // // // // //   Settings,
// // // // // // // // // // // //   BriefcaseBusiness,
// // // // // // // // // // // //   SlidersHorizontal,
// // // // // // // // // // // //   Users, // new icon for New Business Budget section
// // // // // // // // // // // // } from "lucide-react";

// // // // // // // // // // // // const NavigationSidebar = ({
// // // // // // // // // // // //   setIsHovered,
// // // // // // // // // // // //   isHovered,
// // // // // // // // // // // //   setIsSidebarOpen,
// // // // // // // // // // // //   isSidebarOpen,
// // // // // // // // // // // //   canView,
// // // // // // // // // // // // }) => {
// // // // // // // // // // // //   const { pathname } = useLocation();
// // // // // // // // // // // //   const navigate = useNavigate();

// // // // // // // // // // // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // // // // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // // // // // // // // //   const HIDDEN_FEATURES =
// // // // // // // // // // // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // // // // // // // // // // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // // // // // // // // // // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // // // // // // // // // // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // // // // // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/new-business") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/template") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/display-settings") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/analog-rate") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/project-report") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/role-rights") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/mass-utility") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/import-utility") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/account-mapping") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/projectmapping") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/import-opportunity") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/manage-groups") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/override-settings") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/pricing") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/financial-report") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/account-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/org-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/employee-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/plc-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/project-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/company-master") ||
// // // // // // // // // // // //       pathname.includes("/service-unavailable") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/manage-data-manager") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // // // // // // pathname.includes("/dashboard/manage-employee") ||
// // // // // // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // // // // // //   pathname.includes("/dashboard/manage-project-role")

// // // // // // // // // // // //   );

// // // // // // // // // // // //   const [planningOpen, setPlanningOpen] = useState(
// // // // // // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // // // // // //       // pathname.includes("/dashboard/new-business") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/project-report") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/mass-utility") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/import-utility") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/pricing") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/financial-report"),
// // // // // // // // // // // //   );

// // // // // // // // // // // //   const [configurationOpen, setConfigurationOpen] = useState(
// // // // // // // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/template") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/display-settings") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/analog-rate") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/role-rights") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/account-mapping") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/projectmapping") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/override-settings") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // // // // // //   );

// // // // // // // // // // // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // // // // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/template-pool-mapping"),
// // // // // // // // // // // //   );

// // // // // // // // // // // //   // NEW: New Business Budget section open state
// // // // // // // // // // // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // // // // // // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/import-opportunity"),
// // // // // // // // // // // //   );

// // // // // // // // // // // //   // NEW: Manage (Users & Groups) section open state
// // // // // // // // // // // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // // // // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/manage-groups") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/account-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/org-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/plc-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/employee-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/project-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/company-master") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // // // // // //   pathname.includes("/dashboard/manage-employee") ||
// // // // // // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // // // // // //   pathname.includes("/dashboard/account-mass-link") ||
// // // // // // // // // // // //   pathname.includes("/dashboard/accounts-link") ||
// // // // // // // // // // // //   pathname.includes("/dashboard/manage-project-role")
// // // // // // // // // // // //   );

// // // // // // // // // // // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // // // // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/display-settings"),
// // // // // // // // // // // //   );

// // // // // // // // // // // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // // // // // // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/user-suppression"),
// // // // // // // // // // // //   );

// // // // // // // // // // // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // // // // // // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // // // // // //       pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // // // // // //   );

// // // // // // // // // // // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // // // // // // // // // // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // // // // // // // // // // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // // // // // // // // // // //   const [userName, setUserName] = useState("");

// // // // // // // // // // // //   // hover state (existing)
// // // // // // // // // // // //   // const [isHovered, setIsHovered] = useState(false);

// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     const userString = localStorage.getItem("currentUser");
// // // // // // // // // // // //     if (userString) {
// // // // // // // // // // // //       try {
// // // // // // // // // // // //         const userObj = JSON.parse(userString);
// // // // // // // // // // // //         setUserName(userObj.name);
// // // // // // // // // // // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // // // // // // // // // // //       } catch {
// // // // // // // // // // // //         setCurrentUserRole(null);
// // // // // // // // // // // //       }
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }, []);

// // // // // // // // // // // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // // // // // // // // // // //   const handleLinkClick = (pagePath) => {
// // // // // // // // // // // //     setSelectedPage(pagePath);
// // // // // // // // // // // //     navigate(pagePath);
// // // // // // // // // // // //     if (isSidebarOpen) {
// // // // // // // // // // // //       setIsSidebarOpen(false);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const handleCloseSidebar = () => {
// // // // // // // // // // // //     setSearchTerm("");
// // // // // // // // // // // //     setIsSidebarOpen(false);
// // // // // // // // // // // //   };
// // // // // // // // // // // //   const handleOpenSidebar = () => {
// // // // // // // // // // // //     setIsSidebarOpen(true);
// // // // // // // // // // // //   };
// // // // // // // // // // // //   const isExpanded = isSidebarOpen || isHovered;

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <div
// // // // // // // // // // // //       // onMouseOver={handleOpenSidebar}
// // // // // // // // // // // //       // onMouseLeave={handleCloseSidebar}
// // // // // // // // // // // //       className="flex min-h-screen font-inter bg-white"
// // // // // // // // // // // //     >
// // // // // // // // // // // //       {/* Mobile Toggle */}
// // // // // // // // // // // //       <button
// // // // // // // // // // // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // // // // // // // // // // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // // // // // // // // // // //       >
// // // // // // // // // // // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // // // // // // // // // // //       </button>

// // // // // // // // // // // //       {/* Sidebar - Hover to expand */}
// // // // // // // // // // // //       <div
// // // // // // // // // // // //         onMouseEnter={() => setIsHovered(true)}
// // // // // // // // // // // //         onMouseLeave={() => setIsHovered(false)}
// // // // // // // // // // // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // // // // // // // // // // //       bg-white border-r border-gray-200
// // // // // // // // // // // //       transition-all duration-300 ease-in-out shadow-sm
// // // // // // // // // // // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // // // // // // // // // // //       md:translate-x-0

// // // // // // // // // // // //     `}
// // // // // // // // // // // //       >
// // // // // // // // // // // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // // // // // // // // // // //           {/* Menu / General Toggle Section */}
// // // // // // // // // // // //           <div
// // // // // // // // // // // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // // // // // // // // // // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // // // // // // // // // // //           >
// // // // // // // // // // // //             <div className="w-8 flex justify-center">
// // // // // // // // // // // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // // // // // // // // // // //             </div>
// // // // // // // // // // // //             <span
// // // // // // // // // // // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${
// // // // // // // // // // // //                 isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // // //               }`}
// // // // // // // // // // // //             >
// // // // // // // // // // // //               Menu
// // // // // // // // // // // //             </span>
// // // // // // // // // // // //           </div>

// // // // // // // // // // // //           {generalMenuOpen && (
// // // // // // // // // // // //             <div className="space-y-1 mt-2">
// // // // // // // // // // // //               {/* --- PLANNING SECTION --- */}
// // // // // // // // // // // //               <div>
// // // // // // // // // // // //                 <div
// // // // // // // // // // // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <input
// // // // // // // // // // // //                     type="text"
// // // // // // // // // // // //                     placeholder="Search..."
// // // // // // // // // // // //                     value={searchTerm}
// // // // // // // // // // // //                     onChange={(e) =>
// // // // // // // // // // // //                       setSearchTerm(e.target.value.toLowerCase())
// // // // // // // // // // // //                     }
// // // // // // // // // // // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // // // // // // // // // // //                   />
// // // // // // // // // // // //                 </div>
// // // // // // // // // // // //                 {!searchTerm && (
// // // // // // // // // // // //                   <div
// // // // // // // // // // // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // // // // // // // // // // //                   >
// // // // // // // // // // // //                     <div className="flex items-center">
// // // // // // // // // // // //                       <div className="w-8 flex justify-center">
// // // // // // // // // // // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // // //                       </div>
// // // // // // // // // // // //                       <span
// // // // // // // // // // // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// // // // // // // // // // // //                           isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // // //                         }`}
// // // // // // // // // // // //                       >
// // // // // // // // // // // //                         Planning
// // // // // // // // // // // //                       </span>
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                     {isExpanded &&
// // // // // // // // // // // //                       (planningOpen ? (
// // // // // // // // // // // //                         <ChevronDown size={14} />
// // // // // // // // // // // //                       ) : (
// // // // // // // // // // // //                         <ChevronRight size={14} />
// // // // // // // // // // // //                       ))}
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                 )}

// // // // // // // // // // // //                 {(planningOpen || searchTerm) && isExpanded && (
// // // // // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // // //                     <NavItem
// // // // // // // // // // // //                       label="Project Planning"
// // // // // // // // // // // //                       path="/dashboard/project-budget-status"
// // // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // // //                       searchTerm={searchTerm}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // // // // // // // // // // //                       <>
// // // // // // // // // // // //                         <NavItem
// // // // // // // // // // // //                           label="Reporting"
// // // // // // // // // // // //                           path="/dashboard/project-report"
// // // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // // //                         />
// // // // // // // // // // // //                       </>
// // // // // // // // // // // //                     )}

// // // // // // // // // // // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Mass Utility"
// // // // // // // // // // // //                         path="/dashboard/mass-utility"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                     )}
// // // // // // // // // // // //                     {canView("pricing") && !isHidden("pricing") && (
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Pricing"
// // // // // // // // // // // //                         path="/dashboard/pricing"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                     )}

// // // // // // // // // // // //                     {canView("financialReport") &&
// // // // // // // // // // // //                       !isHidden("financialReport") && (
// // // // // // // // // // // //                         <NavItem
// // // // // // // // // // // //                           label="Financial Report"
// // // // // // // // // // // //                           path="/dashboard/financial-report"
// // // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // // //                         />
// // // // // // // // // // // //                       )}
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                 )}
// // // // // // // // // // // //               </div>
// // // // // // // // // // // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // // // // // // // // // // //               {/* {currentUserRole === "admin" && ( */}
// // // // // // // // // // // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // // // // // // // // // // //                 (canView("transferUtility") &&
// // // // // // // // // // // //                   !isHidden("manageNewBusiness")) ||
// // // // // // // // // // // //                 (canView("impOpportunity") &&
// // // // // // // // // // // //                   !isHidden("transferUtility"))) && (
// // // // // // // // // // // //                 <div>
// // // // // // // // // // // //                   {!searchTerm && (
// // // // // // // // // // // //                     <div
// // // // // // // // // // // //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // // //                       onClick={() =>
// // // // // // // // // // // //                         setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // // // // // // // // // // //                       }
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <div className="flex items-center">
// // // // // // // // // // // //                         <div className="w-8 flex justify-center">
// // // // // // // // // // // //                           <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                         <span
// // // // // // // // // // // //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// // // // // // // // // // // //                             isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // // //                           }`}
// // // // // // // // // // // //                         >
// // // // // // // // // // // //                           New Business Budget
// // // // // // // // // // // //                         </span>
// // // // // // // // // // // //                       </div>
// // // // // // // // // // // //                       {isExpanded &&
// // // // // // // // // // // //                         (newBusinessSectionOpen ? (
// // // // // // // // // // // //                           <ChevronDown size={14} />
// // // // // // // // // // // //                         ) : (
// // // // // // // // // // // //                           <ChevronRight size={14} />
// // // // // // // // // // // //                         ))}
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                   )}

// // // // // // // // // // // //                   {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // // // // // // // // // // //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // // //                       {canView("impOpportunity") &&
// // // // // // // // // // // //                         !isHidden("impOpportunity") && (
// // // // // // // // // // // //                           <>
// // // // // // // // // // // //                             <NavItem
// // // // // // // // // // // //                               label="Import Opportunity"
// // // // // // // // // // // //                               path="/dashboard/import-opportunity"
// // // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // // //                             />
// // // // // // // // // // // //                           </>
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                       {canView("manageNewBusiness") &&
// // // // // // // // // // // //                         !isHidden("manageNewBusiness") && (
// // // // // // // // // // // //                           <NavItem
// // // // // // // // // // // //                             label="Manage New Business"
// // // // // // // // // // // //                             path="/dashboard/new-business"
// // // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // // //                           />
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                       {canView("transferUtility") &&
// // // // // // // // // // // //                         !isHidden("transferUtility") && (
// // // // // // // // // // // //                           <NavItem
// // // // // // // // // // // //                             label="Transfer Project Budget"
// // // // // // // // // // // //                             path="/dashboard/create-project-budget"
// // // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // // //                           />
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                   )}
// // // // // // // // // // // //                 </div>
// // // // // // // // // // // //               )}
// // // // // // // // // // // //               {/* )} */}
// // // // // // // // // // // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // // // // // // // // // // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // // // // // // // // // // //                 //  ||
// // // // // // // // // // // //                 // (!isHidden("accountMaster")) ||
// // // // // // // // // // // //                 // (!isHidden("orgMaster")) ||
// // // // // // // // // // // //                 // (!isHidden("employeeMaster"))
// // // // // // // // // // // //                 <div>
// // // // // // // // // // // //                   {!searchTerm && (
// // // // // // // // // // // //                     <div
// // // // // // // // // // // //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // // //                       onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <div className="flex items-center">
// // // // // // // // // // // //                         <div className="w-8 flex justify-center">
// // // // // // // // // // // //                           <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                         <span
// // // // // // // // // // // //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// // // // // // // // // // // //                             isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // // //                           }`}
// // // // // // // // // // // //                         >
// // // // // // // // // // // //                           Manage
// // // // // // // // // // // //                         </span>
// // // // // // // // // // // //                       </div>
// // // // // // // // // // // //                       {isExpanded &&
// // // // // // // // // // // //                         (manageSectionOpen ? (
// // // // // // // // // // // //                           <ChevronDown size={14} />
// // // // // // // // // // // //                         ) : (
// // // // // // // // // // // //                           <ChevronRight size={14} />
// // // // // // // // // // // //                         ))}
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                   )}

// // // // // // // // // // // //                   {(manageSectionOpen || searchTerm) && isExpanded && (
// // // // // // // // // // // //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // // //                       {canView("manageGroups") && !isHidden("manageGroups") && (
// // // // // // // // // // // //                         <NavItem
// // // // // // // // // // // //                           label="Manage Groups"
// // // // // // // // // // // //                           path="/dashboard/manage-groups"
// // // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // // //                         />
// // // // // // // // // // // //                       )}
// // // // // // // // // // // //                       {canView("manageUser") && !isHidden("manageUser") && (
// // // // // // // // // // // //                         <NavItem
// // // // // // // // // // // //                           label="Manage Users"
// // // // // // // // // // // //                           path="/dashboard/manage-users"
// // // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // // //                         />
// // // // // // // // // // // //                       )}
// // // // // // // // // // // //                       {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage Accounts"
// // // // // // // // // // // //                         path="/dashboard/account-master"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}
// // // // // // // // // // // //                       {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage Orgs"
// // // // // // // // // // // //                         path="/dashboard/org-master"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}
// // // // // // // // // // // //                       {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage Employees"
// // // // // // // // // // // //                         path="/dashboard/employee-master"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}
// // // // // // // // // // // //                       {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage PLCs"
// // // // // // // // // // // //                         path="/dashboard/plc-master"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}
// // // // // // // // // // // //                       {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage Projects"
// // // // // // // // // // // //                         path="/dashboard/project-master"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}

// // // // // // // // // // // //                       {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage Revenue Formulas"
// // // // // // // // // // // //                         path="/dashboard/revenueFormula-master"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}
// // // // // // // // // // // //                       {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Account Group Table"
// // // // // // // // // // // //                         path="/dashboard/accountgroup-mapping"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}
// // // // // // // // // // // //                       {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage Account Group Code"
// // // // // // // // // // // //                         path="/dashboard/accountgroupcode-master"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}
// // // // // // // // // // // //                       {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage Account Types"
// // // // // // // // // // // //                         path="/dashboard/accounttype-master"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}
// // // // // // // // // // // //                       {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage Company ID"
// // // // // // // // // // // //                         path="/dashboard/company-master"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}
// // // // // // // // // // // //                       {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // // //                       <NavItem
// // // // // // // // // // // //                         label="Manage Data"
// // // // // // // // // // // //                         path="/dashboard/manage-data-manager"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                       {/* )} */}

// // // // // // // // // // // //                       {canView("manageCompany") && !isHidden("manageCompany") && (
// // // // // // // // // // // //   <NavItem
// // // // // // // // // // // //     label="Manage Company"
// // // // // // // // // // // //     path="/dashboard/manage-company"
// // // // // // // // // // // //     selected={selectedPage}
// // // // // // // // // // // //     onClick={handleLinkClick}
// // // // // // // // // // // //     searchTerm={searchTerm}
// // // // // // // // // // // //   />
// // // // // // // // // // // // )}

// // // // // // // // // // // // <NavItem
// // // // // // // // // // // //   label="Manage Reference"
// // // // // // // // // // // //   path="/dashboard/manage-reference"
// // // // // // // // // // // //   selected={selectedPage}
// // // // // // // // // // // //   onClick={handleLinkClick}
// // // // // // // // // // // //   searchTerm={searchTerm}
// // // // // // // // // // // // />

// // // // // // // // // // // // <NavItem
// // // // // // // // // // // //   label="Manage Employee"
// // // // // // // // // // // //   path="/dashboard/manage-employee"
// // // // // // // // // // // //   selected={selectedPage}
// // // // // // // // // // // //   onClick={handleLinkClick}
// // // // // // // // // // // //   searchTerm={searchTerm}
// // // // // // // // // // // // />

// // // // // // // // // // // // <NavItem
// // // // // // // // // // // //   label="Manage Employee Salary"
// // // // // // // // // // // //   path="/dashboard/manage-employee-salary"
// // // // // // // // // // // //   selected={selectedPage}
// // // // // // // // // // // //   onClick={handleLinkClick}
// // // // // // // // // // // //   searchTerm={searchTerm}
// // // // // // // // // // // // />

// // // // // // // // // // // // <NavItem
// // // // // // // // // // // //   label="Account Mass Link"
// // // // // // // // // // // //   path="/dashboard/account-mass-link"
// // // // // // // // // // // //   selected={selectedPage}
// // // // // // // // // // // //   onClick={handleLinkClick}
// // // // // // // // // // // //   searchTerm={searchTerm}
// // // // // // // // // // // // />

// // // // // // // // // // // // <NavItem
// // // // // // // // // // // //   label="Accounts Link"
// // // // // // // // // // // //   path="/dashboard/accounts-link"
// // // // // // // // // // // //   selected={selectedPage}
// // // // // // // // // // // //   onClick={handleLinkClick}
// // // // // // // // // // // //   searchTerm={searchTerm}
// // // // // // // // // // // // />

// // // // // // // // // // // // <NavItem
// // // // // // // // // // // //   label="Manage Project Roles"
// // // // // // // // // // // //   path="/dashboard/manage-project-role"
// // // // // // // // // // // //   selected={selectedPage}
// // // // // // // // // // // //   onClick={handleLinkClick}
// // // // // // // // // // // //   searchTerm={searchTerm}
// // // // // // // // // // // // />
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                   )}
// // // // // // // // // // // //                 </div>
// // // // // // // // // // // //               )}
// // // // // // // // // // // //               {/* --- CONFIGURATION SECTION --- */}
// // // // // // // // // // // //               {((canView("globalConfiguration") &&
// // // // // // // // // // // //                 !isHidden("globalConfiguration")) ||
// // // // // // // // // // // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // // // // // // // // // // //                 (canView("projectOrgSecurity") &&
// // // // // // // // // // // //                   !isHidden("projectOrgSecurity")) ||
// // // // // // // // // // // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // // // // // // // // // // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // // // // // // // // // // //                 (canView("ceilingConfiguration") &&
// // // // // // // // // // // //                   !isHidden("ceilingConfiguration")) ||
// // // // // // // // // // // //                 (canView("fiscalYearPeriods") &&
// // // // // // // // // // // //                   !isHidden("fiscalYearPeriods")) ||
// // // // // // // // // // // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // // // // // // // // // // //                 (canView("prospectiveIdSetup") &&
// // // // // // // // // // // //                   !isHidden("prospectiveIdSetup")) ||
// // // // // // // // // // // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // // // // // // // // // // //                 <div>
// // // // // // // // // // // //                   {!searchTerm && (
// // // // // // // // // // // //                     <div
// // // // // // // // // // // //                       className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // // // // // // // // // // //                       onClick={() => setConfigurationOpen(!configurationOpen)}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <div className="flex items-center">
// // // // // // // // // // // //                         <div className="w-8 flex justify-center">
// // // // // // // // // // // //                           <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // // // // // // // // // // //                         </div>
// // // // // // // // // // // //                         <span
// // // // // // // // // // // //                           className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${
// // // // // // // // // // // //                             isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // // //                           }`}
// // // // // // // // // // // //                         >
// // // // // // // // // // // //                           Settings
// // // // // // // // // // // //                         </span>
// // // // // // // // // // // //                       </div>
// // // // // // // // // // // //                       {isExpanded &&
// // // // // // // // // // // //                         (configurationOpen ? (
// // // // // // // // // // // //                           <ChevronDown size={14} />
// // // // // // // // // // // //                         ) : (
// // // // // // // // // // // //                           <ChevronRight size={14} />
// // // // // // // // // // // //                         ))}
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                   )}

// // // // // // // // // // // //                   {(configurationOpen || searchTerm) && isExpanded && (
// // // // // // // // // // // //                     <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // // //                       {canView("globalConfiguration") &&
// // // // // // // // // // // //                         !isHidden("globalConfiguration") && (
// // // // // // // // // // // //                           <NavItem
// // // // // // // // // // // //                             label="Configuration Setting"
// // // // // // // // // // // //                             path="/dashboard/global-configuration"
// // // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // // //                           />
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                       {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // // // // // // // // // // //                         <NavItem
// // // // // // // // // // // //                           label="Burden Setup"
// // // // // // // // // // // //                           path="/dashboard/pool-rate-tabs"
// // // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // // //                         />
// // // // // // // // // // // //                       )}
// // // // // // // // // // // //                       {canView("projectOrgSecurity") &&
// // // // // // // // // // // //                         !isHidden("projectOrgSecurity") && (
// // // // // // // // // // // //                           <NavItem
// // // // // // // // // // // //                             label="Project Org Security"
// // // // // // // // // // // //                             path="/dashboard/projectmapping"
// // // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // // //                           />
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                       {canView("accountMapping") &&
// // // // // // // // // // // //                         !isHidden("accountMapping") && (
// // // // // // // // // // // //                           <NavItem
// // // // // // // // // // // //                             label="Account Mapping"
// // // // // // // // // // // //                             path="/dashboard/account-mapping"
// // // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // // //                           />
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                       {canView("analogRate") && !isHidden("analogRate") && (
// // // // // // // // // // // //                         <NavItem
// // // // // // // // // // // //                           label="NBIs Analogous Rate"
// // // // // // // // // // // //                           path="/dashboard/analog-rate"
// // // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // // //                         />
// // // // // // // // // // // //                       )}
// // // // // // // // // // // //                       {canView("ceilingConfiguration") &&
// // // // // // // // // // // //                         !isHidden("ceilingConfiguration") && (
// // // // // // // // // // // //                           <NavItem
// // // // // // // // // // // //                             label="Ceiling Configuration"
// // // // // // // // // // // //                             path="/dashboard/ceiling-configuration"
// // // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // // //                           />
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                       {canView("fiscalYearPeriods") &&
// // // // // // // // // // // //                         !isHidden("fiscalYearPeriods") && (
// // // // // // // // // // // //                           <NavItem
// // // // // // // // // // // //                             label="Fiscal Year Periods"
// // // // // // // // // // // //                             path="/dashboard/maintain-fiscal-year-periods"
// // // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // // //                           />
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                       {canView("annualHolidays") &&
// // // // // // // // // // // //                         !isHidden("annualHolidays") && (
// // // // // // // // // // // //                           <NavItem
// // // // // // // // // // // //                             label="Annual Holidays"
// // // // // // // // // // // //                             path="/dashboard/annual-holidays"
// // // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // // //                           />
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                       {canView("prospectiveIdSetup") &&
// // // // // // // // // // // //                         !isHidden("prospectiveIdSetup") && (
// // // // // // // // // // // //                           <NavItem
// // // // // // // // // // // //                             label="Prospective ID Setup"
// // // // // // // // // // // //                             path="/dashboard/prospective-id-setup"
// // // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // // //                           />
// // // // // // // // // // // //                         )}
// // // // // // // // // // // //                       {canView("roleRights") && !isHidden("roleRights") && (
// // // // // // // // // // // //                         <NavItem
// // // // // // // // // // // //                           label="Rights Settings"
// // // // // // // // // // // //                           path="/dashboard/role-rights"
// // // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // // //                         />
// // // // // // // // // // // //                       )}
// // // // // // // // // // // //                       {/* <NavItem
// // // // // // // // // // // //                         label="Override Configuration"
// // // // // // // // // // // //                         path="/dashboard/override-settings"
// // // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // // //                       /> */}
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                   )}
// // // // // // // // // // // //                 </div>
// // // // // // // // // // // //               )}
// // // // // // // // // // // //               <div>
// // // // // // // // // // // //                 <div
// // // // // // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <div className="flex items-center">
// // // // // // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                     <span
// // // // // // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       System Security
// // // // // // // // // // // //                     </span>
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                   {isExpanded &&
// // // // // // // // // // // //                     (securityMenuOpen ? (
// // // // // // // // // // // //                       <ChevronDown size={14} />
// // // // // // // // // // // //                     ) : (
// // // // // // // // // // // //                       <ChevronRight size={14} />
// // // // // // // // // // // //                     ))}
// // // // // // // // // // // //                 </div>

// // // // // // // // // // // //                 {securityMenuOpen && isExpanded && (
// // // // // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // // // // // //                     <NavItem
// // // // // // // // // // // //                       label="Manage User Groups"
// // // // // // // // // // // //                       path="/dashboard/manage-user-groups"
// // // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                     <NavItem
// // // // // // // // // // // //                       label="Manage User"
// // // // // // // // // // // //                       path="/dashboard/manage-users"
// // // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                     <NavItem
// // // // // // // // // // // //                       label="Manage User Suppression"
// // // // // // // // // // // //                       path="/dashboard/user-suppression"
// // // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                 )}
// // // // // // // // // // // //               </div>

// // // // // // // // // // // //               <div>
// // // // // // // // // // // //                 <div
// // // // // // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <div className="flex items-center">
// // // // // // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                     <span
// // // // // // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       Organizational Security
// // // // // // // // // // // //                     </span>
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                   {isExpanded &&
// // // // // // // // // // // //                     (securityOrgMenuOpen ? (
// // // // // // // // // // // //                       <ChevronDown size={14} />
// // // // // // // // // // // //                     ) : (
// // // // // // // // // // // //                       <ChevronRight size={14} />
// // // // // // // // // // // //                     ))}
// // // // // // // // // // // //                 </div>

// // // // // // // // // // // //                 {securityOrgMenuOpen && isExpanded && (
// // // // // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // // // // // //                     <NavItem
// // // // // // // // // // // //                       label="Activate/Inactivate Organization Security by Module"
// // // // // // // // // // // //                       path="/dashboard/atc-ina-org-sec"
// // // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                     <NavItem
// // // // // // // // // // // //                       label="Manage Organization Security Profiles"
// // // // // // // // // // // //                       path="/dashboard/prof-org-sec"
// // // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                     <NavItem
// // // // // // // // // // // //                       label="Manage Organization Security Groups"
// // // // // // // // // // // //                       path="/dashboard/groups-org-sec"
// // // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                     <NavItem
// // // // // // // // // // // //                       label="Update Organization Security Profiles"
// // // // // // // // // // // //                       path="/dashboard/prof-upd-org-sec"
// // // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                 )}
// // // // // // // // // // // //               </div>
// // // // // // // // // // // //             </div>
// // // // // // // // // // // //           )}
// // // // // // // // // // // //         </div>

// // // // // // // // // // // //         {/* Footer Version */}
// // // // // // // // // // // //         <div
// // // // // // // // // // // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${
// // // // // // // // // // // //             isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // // //           }`}
// // // // // // // // // // // //         >
// // // // // // // // // // // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // // // // // // // // // // //             v{appVersion}
// // // // // // // // // // // //           </div>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //       </div>

// // // // // // // // // // // //       {/* Background Overlay for mobile */}
// // // // // // // // // // // //       {/* {isExpanded  && (
// // // // // // // // // // // //         <div
// // // // // // // // // // // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // // // // // // // // // // //           onClick={handleCloseSidebar}
// // // // // // // // // // // //         ></div>
// // // // // // // // // // // //       )} */}
// // // // // // // // // // // //     </div>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // // // // // // // // // // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // // // // // // // // // // //     return null;
// // // // // // // // // // // //   }

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <Link
// // // // // // // // // // // //       to={path}
// // // // // // // // // // // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${
// // // // // // // // // // // //         selected === path
// // // // // // // // // // // //           ? "text-white font-semibold"
// // // // // // // // // // // //           : "text-gray-500 hover:text-gray-900"
// // // // // // // // // // // //       }`}
// // // // // // // // // // // //       style={{
// // // // // // // // // // // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // // // // // // // // // // //       }}
// // // // // // // // // // // //       onClick={(e) => {
// // // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // // //         onClick(path);
// // // // // // // // // // // //       }}
// // // // // // // // // // // //     >
// // // // // // // // // // // //       {label}
// // // // // // // // // // // //     </Link>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // export default NavigationSidebar;

// // // // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // // // // // // // // import {
// // // // // // // // // // //   Menu,
// // // // // // // // // // //   X,
// // // // // // // // // // //   ChevronDown,
// // // // // // // // // // //   ChevronRight,
// // // // // // // // // // //   Plus,
// // // // // // // // // // //   Minus,
// // // // // // // // // // //   BarChart2,
// // // // // // // // // // //   Layers,
// // // // // // // // // // //   FileText,
// // // // // // // // // // //   Settings,
// // // // // // // // // // //   BriefcaseBusiness,
// // // // // // // // // // //   SlidersHorizontal,
// // // // // // // // // // //   Users, // new icon for New Business Budget section
// // // // // // // // // // // } from "lucide-react";

// // // // // // // // // // // const NavigationSidebar = ({
// // // // // // // // // // //   setIsHovered,
// // // // // // // // // // //   isHovered,
// // // // // // // // // // //   setIsSidebarOpen,
// // // // // // // // // // //   isSidebarOpen,
// // // // // // // // // // //   canView,
// // // // // // // // // // // }) => {
// // // // // // // // // // //   const { pathname } = useLocation();
// // // // // // // // // // //   const navigate = useNavigate();

// // // // // // // // // // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // // // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // // // // // // // //   const HIDDEN_FEATURES =
// // // // // // // // // // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // // // // // // // // // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // // // // // // // // // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // // // // // // // // // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // // // // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // // // // //     pathname.includes("/dashboard/import-opportunity") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // // // // // //     pathname.includes("/dashboard/financial-report") ||
// // // // // // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // // // // // //     pathname.includes("/service-unavailable") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-data-manager") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // // //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-revenue")

// // // // // // // // // // //   );

// // // // // // // // // // //   const [planningOpen, setPlanningOpen] = useState(
// // // // // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // // // // //     // pathname.includes("/dashboard/new-business") ||
// // // // // // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // // // // // //     pathname.includes("/dashboard/financial-report"),
// // // // // // // // // // //   );

// // // // // // // // // // //   const [configurationOpen, setConfigurationOpen] = useState(
// // // // // // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // // // // //   );

// // // // // // // // // // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // // // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // // // //     pathname.includes("/dashboard/template-pool-mapping"),
// // // // // // // // // // //   );

// // // // // // // // // // //   // NEW: New Business Budget section open state
// // // // // // // // // // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // // // // // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // // // // //     pathname.includes("/dashboard/import-opportunity"),
// // // // // // // // // // //   );

// // // // // // // // // // //   // NEW: Manage (Users & Groups) section open state
// // // // // // // // // // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // // // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // // // // //     pathname.includes("/dashboard/account-mass-link") ||
// // // // // // // // // // //     pathname.includes("/dashboard/accounts-link") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-revenue")
// // // // // // // // // // //   );

// // // // // // // // // // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // // // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // // // //     pathname.includes("/dashboard/display-settings"),
// // // // // // // // // // //   );

// // // // // // // // // // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // // // // // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // // //     pathname.includes("/dashboard/user-suppression"),
// // // // // // // // // // //   );

// // // // // // // // // // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // // // // // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // // // // //   );

// // // // // // // // // // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // // // // // // // // // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // // // // // // // // // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // // // // // // // // // //   const [userName, setUserName] = useState("");

// // // // // // // // // // //   // hover state (existing)
// // // // // // // // // // //   // const [isHovered, setIsHovered] = useState(false);

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     const userString = localStorage.getItem("currentUser");
// // // // // // // // // // //     if (userString) {
// // // // // // // // // // //       try {
// // // // // // // // // // //         const userObj = JSON.parse(userString);
// // // // // // // // // // //         setUserName(userObj.name);
// // // // // // // // // // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // // // // // // // // // //       } catch {
// // // // // // // // // // //         setCurrentUserRole(null);
// // // // // // // // // // //       }
// // // // // // // // // // //     }
// // // // // // // // // // //   }, []);

// // // // // // // // // // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // // // // // // // // // //   const handleLinkClick = (pagePath) => {
// // // // // // // // // // //     setSelectedPage(pagePath);
// // // // // // // // // // //     navigate(pagePath);
// // // // // // // // // // //     if (isSidebarOpen) {
// // // // // // // // // // //       setIsSidebarOpen(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleCloseSidebar = () => {
// // // // // // // // // // //     setSearchTerm("");
// // // // // // // // // // //     setIsSidebarOpen(false);
// // // // // // // // // // //   };
// // // // // // // // // // //   const handleOpenSidebar = () => {
// // // // // // // // // // //     setIsSidebarOpen(true);
// // // // // // // // // // //   };
// // // // // // // // // // //   const isExpanded = isSidebarOpen || isHovered;

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div
// // // // // // // // // // //       // onMouseOver={handleOpenSidebar}
// // // // // // // // // // //       // onMouseLeave={handleCloseSidebar}
// // // // // // // // // // //       className="flex min-h-screen font-inter bg-white"
// // // // // // // // // // //     >
// // // // // // // // // // //       {/* Mobile Toggle */}
// // // // // // // // // // //       <button
// // // // // // // // // // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // // // // // // // // // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // // // // // // // // // //       >
// // // // // // // // // // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // // // // // // // // // //       </button>

// // // // // // // // // // //       {/* Sidebar - Hover to expand */}
// // // // // // // // // // //       <div
// // // // // // // // // // //         onMouseEnter={() => setIsHovered(true)}
// // // // // // // // // // //         onMouseLeave={() => setIsHovered(false)}
// // // // // // // // // // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // // // // // // // // // //       bg-white border-r border-gray-200
// // // // // // // // // // //       transition-all duration-300 ease-in-out shadow-sm
// // // // // // // // // // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // // // // // // // // // //       md:translate-x-0

// // // // // // // // // // //     `}
// // // // // // // // // // //       >
// // // // // // // // // // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // // // // // // // // // //           {/* Menu / General Toggle Section */}
// // // // // // // // // // //           <div
// // // // // // // // // // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // // // // // // // // // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // // // // // // // // // //           >
// // // // // // // // // // //             <div className="w-8 flex justify-center">
// // // // // // // // // // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // // // // // // // // // //             </div>
// // // // // // // // // // //             <span
// // // // // // // // // // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // //                 }`}
// // // // // // // // // // //             >
// // // // // // // // // // //               Menu
// // // // // // // // // // //             </span>
// // // // // // // // // // //           </div>

// // // // // // // // // // //           {generalMenuOpen && (
// // // // // // // // // // //             <div className="space-y-1 mt-2">
// // // // // // // // // // //               {/* --- PLANNING SECTION --- */}
// // // // // // // // // // //               <div>
// // // // // // // // // // //                 <div
// // // // // // // // // // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // // // // // // // // // //                 >
// // // // // // // // // // //                   <input
// // // // // // // // // // //                     type="text"
// // // // // // // // // // //                     placeholder="Search..."
// // // // // // // // // // //                     value={searchTerm}
// // // // // // // // // // //                     onChange={(e) =>
// // // // // // // // // // //                       setSearchTerm(e.target.value.toLowerCase())
// // // // // // // // // // //                     }
// // // // // // // // // // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // // // // // // // // // //                   />
// // // // // // // // // // //                 </div>
// // // // // // // // // // //                 {!searchTerm && (
// // // // // // // // // // //                   <div
// // // // // // // // // // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // // // // // // // // // //                   >
// // // // // // // // // // //                     <div className="flex items-center">
// // // // // // // // // // //                       <div className="w-8 flex justify-center">
// // // // // // // // // // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                       <span
// // // // // // // // // // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // //                           }`}
// // // // // // // // // // //                       >
// // // // // // // // // // //                         Planning
// // // // // // // // // // //                       </span>
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                     {isExpanded &&
// // // // // // // // // // //                       (planningOpen ? (
// // // // // // // // // // //                         <ChevronDown size={14} />
// // // // // // // // // // //                       ) : (
// // // // // // // // // // //                         <ChevronRight size={14} />
// // // // // // // // // // //                       ))}
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 )}

// // // // // // // // // // //                 {(planningOpen || searchTerm) && isExpanded && (
// // // // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // //                     <NavItem
// // // // // // // // // // //                       label="Project Planning"
// // // // // // // // // // //                       path="/dashboard/project-budget-status"
// // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // //                       searchTerm={searchTerm}
// // // // // // // // // // //                     />
// // // // // // // // // // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // // // // // // // // // //                       <>
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Reporting"
// // // // // // // // // // //                           path="/dashboard/project-report"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                       </>
// // // // // // // // // // //                     )}

// // // // // // // // // // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // // // // // // // // // //                       <NavItem
// // // // // // // // // // //                         label="Mass Utility"
// // // // // // // // // // //                         path="/dashboard/mass-utility"
// // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // //                       />
// // // // // // // // // // //                     )}
// // // // // // // // // // //                     {canView("pricing") && !isHidden("pricing") && (
// // // // // // // // // // //                       <NavItem
// // // // // // // // // // //                         label="Pricing"
// // // // // // // // // // //                         path="/dashboard/pricing"
// // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // // //                       />
// // // // // // // // // // //                     )}

// // // // // // // // // // //                     {canView("financialReport") &&
// // // // // // // // // // //                       !isHidden("financialReport") && (
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Financial Report"
// // // // // // // // // // //                           path="/dashboard/financial-report"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                       )}
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </div>
// // // // // // // // // // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // // // // // // // // // //               {/* {currentUserRole === "admin" && ( */}
// // // // // // // // // // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // // // // // // // // // //                 (canView("transferUtility") &&
// // // // // // // // // // //                   !isHidden("manageNewBusiness")) ||
// // // // // // // // // // //                 (canView("impOpportunity") &&
// // // // // // // // // // //                   !isHidden("transferUtility"))) && (
// // // // // // // // // // //                   <div>
// // // // // // // // // // //                     {!searchTerm && (
// // // // // // // // // // //                       <div
// // // // // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // //                         onClick={() =>
// // // // // // // // // // //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // // // // // // // // // //                         }
// // // // // // // // // // //                       >
// // // // // // // // // // //                         <div className="flex items-center">
// // // // // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // // // // //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // //                           </div>
// // // // // // // // // // //                           <span
// // // // // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // //                               }`}
// // // // // // // // // // //                           >
// // // // // // // // // // //                             New Business Budget
// // // // // // // // // // //                           </span>
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                         {isExpanded &&
// // // // // // // // // // //                           (newBusinessSectionOpen ? (
// // // // // // // // // // //                             <ChevronDown size={14} />
// // // // // // // // // // //                           ) : (
// // // // // // // // // // //                             <ChevronRight size={14} />
// // // // // // // // // // //                           ))}
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                     )}

// // // // // // // // // // //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // // // // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // //                         {canView("impOpportunity") &&
// // // // // // // // // // //                           !isHidden("impOpportunity") && (
// // // // // // // // // // //                             <>
// // // // // // // // // // //                               <NavItem
// // // // // // // // // // //                                 label="Import Opportunity"
// // // // // // // // // // //                                 path="/dashboard/import-opportunity"
// // // // // // // // // // //                                 selected={selectedPage}
// // // // // // // // // // //                                 onClick={handleLinkClick}
// // // // // // // // // // //                                 searchTerm={searchTerm}
// // // // // // // // // // //                               />
// // // // // // // // // // //                             </>
// // // // // // // // // // //                           )}
// // // // // // // // // // //                         {canView("manageNewBusiness") &&
// // // // // // // // // // //                           !isHidden("manageNewBusiness") && (
// // // // // // // // // // //                             <NavItem
// // // // // // // // // // //                               label="Manage New Business"
// // // // // // // // // // //                               path="/dashboard/new-business"
// // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // //                             />
// // // // // // // // // // //                           )}
// // // // // // // // // // //                         {canView("transferUtility") &&
// // // // // // // // // // //                           !isHidden("transferUtility") && (
// // // // // // // // // // //                             <NavItem
// // // // // // // // // // //                               label="Transfer Project Budget"
// // // // // // // // // // //                               path="/dashboard/create-project-budget"
// // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // //                             />
// // // // // // // // // // //                           )}
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                     )}
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               {/* )} */}
// // // // // // // // // // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // // // // // // // // // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // // // // // // // // // //                   //  ||
// // // // // // // // // // //                   // (!isHidden("accountMaster")) ||
// // // // // // // // // // //                   // (!isHidden("orgMaster")) ||
// // // // // // // // // // //                   // (!isHidden("employeeMaster"))
// // // // // // // // // // //                   <div>
// // // // // // // // // // //                     {!searchTerm && (
// // // // // // // // // // //                       <div
// // // // // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // // // // // // // // // //                       >
// // // // // // // // // // //                         <div className="flex items-center">
// // // // // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // // // // //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // //                           </div>
// // // // // // // // // // //                           <span
// // // // // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // //                               }`}
// // // // // // // // // // //                           >
// // // // // // // // // // //                             Manage
// // // // // // // // // // //                           </span>
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                         {isExpanded &&
// // // // // // // // // // //                           (manageSectionOpen ? (
// // // // // // // // // // //                             <ChevronDown size={14} />
// // // // // // // // // // //                           ) : (
// // // // // // // // // // //                             <ChevronRight size={14} />
// // // // // // // // // // //                           ))}
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                     )}

// // // // // // // // // // //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// // // // // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// // // // // // // // // // //                           <NavItem
// // // // // // // // // // //                             label="Manage Groups"
// // // // // // // // // // //                             path="/dashboard/manage-groups"
// // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // //                           />
// // // // // // // // // // //                         )}
// // // // // // // // // // //                         {canView("manageUser") && !isHidden("manageUser") && (
// // // // // // // // // // //                           <NavItem
// // // // // // // // // // //                             label="Manage Users"
// // // // // // // // // // //                             path="/dashboard/manage-users"
// // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // //                           />
// // // // // // // // // // //                         )}
// // // // // // // // // // //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Accounts"
// // // // // // // // // // //                           path="/dashboard/account-master"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}
// // // // // // // // // // //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Orgs"
// // // // // // // // // // //                           path="/dashboard/org-master"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}
// // // // // // // // // // //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Employees"
// // // // // // // // // // //                           path="/dashboard/employee-master"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}
// // // // // // // // // // //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage PLCs"
// // // // // // // // // // //                           path="/dashboard/plc-master"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}
// // // // // // // // // // //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Projects"
// // // // // // // // // // //                           path="/dashboard/project-master"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}

// // // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Revenue Formulas"
// // // // // // // // // // //                           path="/dashboard/revenueFormula-master"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}
// // // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Account Group Table"
// // // // // // // // // // //                           path="/dashboard/accountgroup-mapping"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}
// // // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Account Group Code"
// // // // // // // // // // //                           path="/dashboard/accountgroupcode-master"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}
// // // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Account Types"
// // // // // // // // // // //                           path="/dashboard/accounttype-master"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}
// // // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Company ID"
// // // // // // // // // // //                           path="/dashboard/company-master"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}
// // // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Data"
// // // // // // // // // // //                           path="/dashboard/manage-data-manager"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                         {/* )} */}

// // // // // // // // // // //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// // // // // // // // // // //                           <NavItem
// // // // // // // // // // //                             label="Manage Company"
// // // // // // // // // // //                             path="/dashboard/manage-company"
// // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // //                           />
// // // // // // // // // // //                         )}

// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Reference"
// // // // // // // // // // //                           path="/dashboard/manage-reference"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />

// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Employee"
// // // // // // // // // // //                           path="/dashboard/manage-employee"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />

// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Employee Salary"
// // // // // // // // // // //                           path="/dashboard/manage-employee-salary"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />

// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Account Mass Link"
// // // // // // // // // // //                           path="/dashboard/account-mass-link"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />

// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Accounts Link"
// // // // // // // // // // //                           path="/dashboard/accounts-link"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />

// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Project Roles"
// // // // // // // // // // //                           path="/dashboard/manage-project-role"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />

// // // // // // // // // // //                         <NavItem
// // // // // // // // // // //                           label="Manage Revenue"
// // // // // // // // // // //                           path="/dashboard/manage-revenue"
// // // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // // //                         />
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                     )}
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               {/* --- CONFIGURATION SECTION --- */}
// // // // // // // // // // //               {((canView("globalConfiguration") &&
// // // // // // // // // // //                 !isHidden("globalConfiguration")) ||
// // // // // // // // // // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // // // // // // // // // //                 (canView("projectOrgSecurity") &&
// // // // // // // // // // //                   !isHidden("projectOrgSecurity")) ||
// // // // // // // // // // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // // // // // // // // // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // // // // // // // // // //                 (canView("ceilingConfiguration") &&
// // // // // // // // // // //                   !isHidden("ceilingConfiguration")) ||
// // // // // // // // // // //                 (canView("fiscalYearPeriods") &&
// // // // // // // // // // //                   !isHidden("fiscalYearPeriods")) ||
// // // // // // // // // // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // // // // // // // // // //                 (canView("prospectiveIdSetup") &&
// // // // // // // // // // //                   !isHidden("prospectiveIdSetup")) ||
// // // // // // // // // // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // // // // // // // // // //                   <div>
// // // // // // // // // // //                     {!searchTerm && (
// // // // // // // // // // //                       <div
// // // // // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // // // // // // // // // //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// // // // // // // // // // //                       >
// // // // // // // // // // //                         <div className="flex items-center">
// // // // // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // // // // //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // // // // // // // // // //                           </div>
// // // // // // // // // // //                           <span
// // // // // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // //                               }`}
// // // // // // // // // // //                           >
// // // // // // // // // // //                             Settings
// // // // // // // // // // //                           </span>
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                         {isExpanded &&
// // // // // // // // // // //                           (configurationOpen ? (
// // // // // // // // // // //                             <ChevronDown size={14} />
// // // // // // // // // // //                           ) : (
// // // // // // // // // // //                             <ChevronRight size={14} />
// // // // // // // // // // //                           ))}
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                     )}

// // // // // // // // // // //                     {(configurationOpen || searchTerm) && isExpanded && (
// // // // // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // //                         {canView("globalConfiguration") &&
// // // // // // // // // // //                           !isHidden("globalConfiguration") && (
// // // // // // // // // // //                             <NavItem
// // // // // // // // // // //                               label="Configuration Setting"
// // // // // // // // // // //                               path="/dashboard/global-configuration"
// // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // //                             />
// // // // // // // // // // //                           )}
// // // // // // // // // // //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // // // // // // // // // //                           <NavItem
// // // // // // // // // // //                             label="Burden Setup"
// // // // // // // // // // //                             path="/dashboard/pool-rate-tabs"
// // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // //                           />
// // // // // // // // // // //                         )}
// // // // // // // // // // //                         {canView("projectOrgSecurity") &&
// // // // // // // // // // //                           !isHidden("projectOrgSecurity") && (
// // // // // // // // // // //                             <NavItem
// // // // // // // // // // //                               label="Project Org Security"
// // // // // // // // // // //                               path="/dashboard/projectmapping"
// // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // //                             />
// // // // // // // // // // //                           )}
// // // // // // // // // // //                         {canView("accountMapping") &&
// // // // // // // // // // //                           !isHidden("accountMapping") && (
// // // // // // // // // // //                             <NavItem
// // // // // // // // // // //                               label="Account Mapping"
// // // // // // // // // // //                               path="/dashboard/account-mapping"
// // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // //                             />
// // // // // // // // // // //                           )}
// // // // // // // // // // //                         {canView("analogRate") && !isHidden("analogRate") && (
// // // // // // // // // // //                           <NavItem
// // // // // // // // // // //                             label="NBIs Analogous Rate"
// // // // // // // // // // //                             path="/dashboard/analog-rate"
// // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // // //                           />
// // // // // // // // // // //                         )}
// // // // // // // // // // //                         {canView("ceilingConfiguration") &&
// // // // // // // // // // //                           !isHidden("ceilingConfiguration") && (
// // // // // // // // // // //                             <NavItem
// // // // // // // // // // //                               label="Ceiling Configuration"
// // // // // // // // // // //                               path="/dashboard/ceiling-configuration"
// // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // //                             />
// // // // // // // // // // //                           )}
// // // // // // // // // // //                         {canView("fiscalYearPeriods") &&
// // // // // // // // // // //                           !isHidden("fiscalYearPeriods") && (
// // // // // // // // // // //                             <NavItem
// // // // // // // // // // //                               label="Fiscal Year Periods"
// // // // // // // // // // //                               path="/dashboard/maintain-fiscal-year-periods"
// // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // //                             />
// // // // // // // // // // //                           )}
// // // // // // // // // // //                         {canView("annualHolidays") &&
// // // // // // // // // // //                           !isHidden("annualHolidays") && (
// // // // // // // // // // //                             <NavItem
// // // // // // // // // // //                               label="Annual Holidays"
// // // // // // // // // // //                               path="/dashboard/annual-holidays"
// // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // //                             />
// // // // // // // // // // //                           )}
// // // // // // // // // // //                         {canView("prospectiveIdSetup") &&
// // // // // // // // // // //                           !isHidden("prospectiveIdSetup") && (
// // // // // // // // // // //                             <NavItem
// // // // // // // // // // //                               label="Prospective ID Setup"
// // // // // // // // // // //                               path="/dashboard/prospective-id-setup"
// // // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // // //                             />
// // // // // // // // // // //                           )}
// // // // // // // // // // //                         {canView("roleRights") && !isHidden("roleRights") && (
// // // // // // // // // // //                           <NavItem
// // // // // // // // // // //                             label="Rights Settings"
// // // // // // // // // // //                             path="/dashboard/role-rights"
// // // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // // //                           />
// // // // // // // // // // //                         )}
// // // // // // // // // // //                         {/* <NavItem
// // // // // // // // // // //                         label="Override Configuration"
// // // // // // // // // // //                         path="/dashboard/override-settings"
// // // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // // //                       /> */}
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                     )}
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               <div>
// // // // // // // // // // //                 <div
// // // // // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // // // // // // // // // //                 >
// // // // // // // // // // //                   <div className="flex items-center">
// // // // // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                     <span
// // // // // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // // // // //                     >
// // // // // // // // // // //                       System Security
// // // // // // // // // // //                     </span>
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                   {isExpanded &&
// // // // // // // // // // //                     (securityMenuOpen ? (
// // // // // // // // // // //                       <ChevronDown size={14} />
// // // // // // // // // // //                     ) : (
// // // // // // // // // // //                       <ChevronRight size={14} />
// // // // // // // // // // //                     ))}
// // // // // // // // // // //                 </div>

// // // // // // // // // // //                 {securityMenuOpen && isExpanded && (
// // // // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // // // // //                     <NavItem
// // // // // // // // // // //                       label="Manage User Groups"
// // // // // // // // // // //                       path="/dashboard/manage-user-groups"
// // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // //                     />
// // // // // // // // // // //                     <NavItem
// // // // // // // // // // //                       label="Manage User"
// // // // // // // // // // //                       path="/dashboard/manage-users"
// // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // //                     />
// // // // // // // // // // //                     <NavItem
// // // // // // // // // // //                       label="Manage User Suppression"
// // // // // // // // // // //                       path="/dashboard/user-suppression"
// // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // //                     />
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </div>

// // // // // // // // // // //               <div>
// // // // // // // // // // //                 <div
// // // // // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // // // // // // // // // //                 >
// // // // // // // // // // //                   <div className="flex items-center">
// // // // // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                     <span
// // // // // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // // // // //                     >
// // // // // // // // // // //                       Organizational Security
// // // // // // // // // // //                     </span>
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                   {isExpanded &&
// // // // // // // // // // //                     (securityOrgMenuOpen ? (
// // // // // // // // // // //                       <ChevronDown size={14} />
// // // // // // // // // // //                     ) : (
// // // // // // // // // // //                       <ChevronRight size={14} />
// // // // // // // // // // //                     ))}
// // // // // // // // // // //                 </div>

// // // // // // // // // // //                 {securityOrgMenuOpen && isExpanded && (
// // // // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // // // // //                     <NavItem
// // // // // // // // // // //                       label="Activate/Inactivate Organization Security by Module"
// // // // // // // // // // //                       path="/dashboard/atc-ina-org-sec"
// // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // //                     />
// // // // // // // // // // //                     <NavItem
// // // // // // // // // // //                       label="Manage Organization Security Profiles"
// // // // // // // // // // //                       path="/dashboard/prof-org-sec"
// // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // //                     />
// // // // // // // // // // //                     <NavItem
// // // // // // // // // // //                       label="Manage Organization Security Groups"
// // // // // // // // // // //                       path="/dashboard/groups-org-sec"
// // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // //                     />
// // // // // // // // // // //                     <NavItem
// // // // // // // // // // //                       label="Update Organization Security Profiles"
// // // // // // // // // // //                       path="/dashboard/prof-upd-org-sec"
// // // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // // //                     />
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </div>
// // // // // // // // // // //             </div>
// // // // // // // // // // //           )}
// // // // // // // // // // //         </div>

// // // // // // // // // // //         {/* Footer Version */}
// // // // // // // // // // //         <div
// // // // // // // // // // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // // //             }`}
// // // // // // // // // // //         >
// // // // // // // // // // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // // // // // // // // // //             v{appVersion}
// // // // // // // // // // //           </div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </div>

// // // // // // // // // // //       {/* Background Overlay for mobile */}
// // // // // // // // // // //       {/* {isExpanded  && (
// // // // // // // // // // //         <div
// // // // // // // // // // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // // // // // // // // // //           onClick={handleCloseSidebar}
// // // // // // // // // // //         ></div>
// // // // // // // // // // //       )} */}
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // // // // // // // // // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // // // // // // // // // //     return null;
// // // // // // // // // // //   }

// // // // // // // // // // //   return (
// // // // // // // // // // //     <Link
// // // // // // // // // // //       to={path}
// // // // // // // // // // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// // // // // // // // // // //           ? "text-white font-semibold"
// // // // // // // // // // //           : "text-gray-500 hover:text-gray-900"
// // // // // // // // // // //         }`}
// // // // // // // // // // //       style={{
// // // // // // // // // // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // // // // // // // // // //       }}
// // // // // // // // // // //       onClick={(e) => {
// // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // //         onClick(path);
// // // // // // // // // // //       }}
// // // // // // // // // // //     >
// // // // // // // // // // //       {label}
// // // // // // // // // // //     </Link>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default NavigationSidebar;

// // // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // // // // // // // import {
// // // // // // // // // //   Menu,
// // // // // // // // // //   X,
// // // // // // // // // //   ChevronDown,
// // // // // // // // // //   ChevronRight,
// // // // // // // // // //   Plus,
// // // // // // // // // //   Minus,
// // // // // // // // // //   BarChart2,
// // // // // // // // // //   Layers,
// // // // // // // // // //   FileText,
// // // // // // // // // //   Settings,
// // // // // // // // // //   BriefcaseBusiness,
// // // // // // // // // //   SlidersHorizontal,
// // // // // // // // // //   Users, // new icon for New Business Budget section
// // // // // // // // // // } from "lucide-react";

// // // // // // // // // // const NavigationSidebar = ({
// // // // // // // // // //   setIsHovered,
// // // // // // // // // //   isHovered,
// // // // // // // // // //   setIsSidebarOpen,
// // // // // // // // // //   isSidebarOpen,
// // // // // // // // // //   canView,
// // // // // // // // // // }) => {
// // // // // // // // // //   const { pathname } = useLocation();
// // // // // // // // // //   const navigate = useNavigate();

// // // // // // // // // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // // // // // // //   const HIDDEN_FEATURES =
// // // // // // // // // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // // // // // // // // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // // // // // // // // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // // // // // // // // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // // // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // // // //     pathname.includes("/dashboard/import-opportunity") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // // // // //     pathname.includes("/dashboard/financial-report") ||
// // // // // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // // // // //     pathname.includes("/service-unavailable") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-data-manager") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-cogs")

// // // // // // // // // //   );

// // // // // // // // // //   const [planningOpen, setPlanningOpen] = useState(
// // // // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // // // //     // pathname.includes("/dashboard/new-business") ||
// // // // // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // // // // //     pathname.includes("/dashboard/financial-report"),
// // // // // // // // // //   );

// // // // // // // // // //   const [configurationOpen, setConfigurationOpen] = useState(
// // // // // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // // // //   );

// // // // // // // // // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // // //     pathname.includes("/dashboard/template-pool-mapping"),
// // // // // // // // // //   );

// // // // // // // // // //   // NEW: New Business Budget section open state
// // // // // // // // // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // // // // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // // // //     pathname.includes("/dashboard/import-opportunity"),
// // // // // // // // // //   );

// // // // // // // // // //   // NEW: Manage (Users & Groups) section open state
// // // // // // // // // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // // // //     pathname.includes("/dashboard/account-mass-link") ||
// // // // // // // // // //     pathname.includes("/dashboard/accounts-link") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-cogs")
// // // // // // // // // //   );

// // // // // // // // // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // // //     pathname.includes("/dashboard/display-settings"),
// // // // // // // // // //   );

// // // // // // // // // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // // // // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // // //     pathname.includes("/dashboard/user-suppression"),
// // // // // // // // // //   );

// // // // // // // // // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // // // // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // // // //   );

// // // // // // // // // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // // // // // // // // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // // // // // // // // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // // // // // // // // //   const [userName, setUserName] = useState("");

// // // // // // // // // //   // hover state (existing)
// // // // // // // // // //   // const [isHovered, setIsHovered] = useState(false);

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     const userString = localStorage.getItem("currentUser");
// // // // // // // // // //     if (userString) {
// // // // // // // // // //       try {
// // // // // // // // // //         const userObj = JSON.parse(userString);
// // // // // // // // // //         setUserName(userObj.name);
// // // // // // // // // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // // // // // // // // //       } catch {
// // // // // // // // // //         setCurrentUserRole(null);
// // // // // // // // // //       }
// // // // // // // // // //     }
// // // // // // // // // //   }, []);

// // // // // // // // // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // // // // // // // // //   const handleLinkClick = (pagePath) => {
// // // // // // // // // //     setSelectedPage(pagePath);
// // // // // // // // // //     navigate(pagePath);
// // // // // // // // // //     if (isSidebarOpen) {
// // // // // // // // // //       setIsSidebarOpen(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const handleCloseSidebar = () => {
// // // // // // // // // //     setSearchTerm("");
// // // // // // // // // //     setIsSidebarOpen(false);
// // // // // // // // // //   };
// // // // // // // // // //   const handleOpenSidebar = () => {
// // // // // // // // // //     setIsSidebarOpen(true);
// // // // // // // // // //   };
// // // // // // // // // //   const isExpanded = isSidebarOpen || isHovered;

// // // // // // // // // //   return (
// // // // // // // // // //     <div
// // // // // // // // // //       // onMouseOver={handleOpenSidebar}
// // // // // // // // // //       // onMouseLeave={handleCloseSidebar}
// // // // // // // // // //       className="flex min-h-screen font-inter bg-white"
// // // // // // // // // //     >
// // // // // // // // // //       {/* Mobile Toggle */}
// // // // // // // // // //       <button
// // // // // // // // // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // // // // // // // // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // // // // // // // // //       >
// // // // // // // // // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // // // // // // // // //       </button>

// // // // // // // // // //       {/* Sidebar - Hover to expand */}
// // // // // // // // // //       <div
// // // // // // // // // //         onMouseEnter={() => setIsHovered(true)}
// // // // // // // // // //         onMouseLeave={() => setIsHovered(false)}
// // // // // // // // // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // // // // // // // // //       bg-white border-r border-gray-200
// // // // // // // // // //       transition-all duration-300 ease-in-out shadow-sm
// // // // // // // // // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // // // // // // // // //       md:translate-x-0

// // // // // // // // // //     `}
// // // // // // // // // //       >
// // // // // // // // // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // // // // // // // // //           {/* Menu / General Toggle Section */}
// // // // // // // // // //           <div
// // // // // // // // // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // // // // // // // // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // // // // // // // // //           >
// // // // // // // // // //             <div className="w-8 flex justify-center">
// // // // // // // // // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // // // // // // // // //             </div>
// // // // // // // // // //             <span
// // // // // // // // // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // //                 }`}
// // // // // // // // // //             >
// // // // // // // // // //               Menu
// // // // // // // // // //             </span>
// // // // // // // // // //           </div>

// // // // // // // // // //           {generalMenuOpen && (
// // // // // // // // // //             <div className="space-y-1 mt-2">
// // // // // // // // // //               {/* --- PLANNING SECTION --- */}
// // // // // // // // // //               <div>
// // // // // // // // // //                 <div
// // // // // // // // // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // // // // // // // // //                 >
// // // // // // // // // //                   <input
// // // // // // // // // //                     type="text"
// // // // // // // // // //                     placeholder="Search..."
// // // // // // // // // //                     value={searchTerm}
// // // // // // // // // //                     onChange={(e) =>
// // // // // // // // // //                       setSearchTerm(e.target.value.toLowerCase())
// // // // // // // // // //                     }
// // // // // // // // // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // // // // // // // // //                   />
// // // // // // // // // //                 </div>
// // // // // // // // // //                 {!searchTerm && (
// // // // // // // // // //                   <div
// // // // // // // // // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // // // // // // // // //                   >
// // // // // // // // // //                     <div className="flex items-center">
// // // // // // // // // //                       <div className="w-8 flex justify-center">
// // // // // // // // // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // //                       </div>
// // // // // // // // // //                       <span
// // // // // // // // // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // //                           }`}
// // // // // // // // // //                       >
// // // // // // // // // //                         Planning
// // // // // // // // // //                       </span>
// // // // // // // // // //                     </div>
// // // // // // // // // //                     {isExpanded &&
// // // // // // // // // //                       (planningOpen ? (
// // // // // // // // // //                         <ChevronDown size={14} />
// // // // // // // // // //                       ) : (
// // // // // // // // // //                         <ChevronRight size={14} />
// // // // // // // // // //                       ))}
// // // // // // // // // //                   </div>
// // // // // // // // // //                 )}

// // // // // // // // // //                 {(planningOpen || searchTerm) && isExpanded && (
// // // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // //                     <NavItem
// // // // // // // // // //                       label="Project Planning"
// // // // // // // // // //                       path="/dashboard/project-budget-status"
// // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // //                       searchTerm={searchTerm}
// // // // // // // // // //                     />
// // // // // // // // // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // // // // // // // // //                       <>
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Reporting"
// // // // // // // // // //                           path="/dashboard/project-report"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                       </>
// // // // // // // // // //                     )}

// // // // // // // // // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // // // // // // // // //                       <NavItem
// // // // // // // // // //                         label="Mass Utility"
// // // // // // // // // //                         path="/dashboard/mass-utility"
// // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // //                       />
// // // // // // // // // //                     )}
// // // // // // // // // //                     {canView("pricing") && !isHidden("pricing") && (
// // // // // // // // // //                       <NavItem
// // // // // // // // // //                         label="Pricing"
// // // // // // // // // //                         path="/dashboard/pricing"
// // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // // //                       />
// // // // // // // // // //                     )}

// // // // // // // // // //                     {canView("financialReport") &&
// // // // // // // // // //                       !isHidden("financialReport") && (
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Financial Report"
// // // // // // // // // //                           path="/dashboard/financial-report"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                       )}
// // // // // // // // // //                   </div>
// // // // // // // // // //                 )}
// // // // // // // // // //               </div>
// // // // // // // // // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // // // // // // // // //               {/* {currentUserRole === "admin" && ( */}
// // // // // // // // // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // // // // // // // // //                 (canView("transferUtility") &&
// // // // // // // // // //                   !isHidden("manageNewBusiness")) ||
// // // // // // // // // //                 (canView("impOpportunity") &&
// // // // // // // // // //                   !isHidden("transferUtility"))) && (
// // // // // // // // // //                   <div>
// // // // // // // // // //                     {!searchTerm && (
// // // // // // // // // //                       <div
// // // // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // //                         onClick={() =>
// // // // // // // // // //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // // // // // // // // //                         }
// // // // // // // // // //                       >
// // // // // // // // // //                         <div className="flex items-center">
// // // // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // // // //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // //                           </div>
// // // // // // // // // //                           <span
// // // // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // //                               }`}
// // // // // // // // // //                           >
// // // // // // // // // //                             New Business Budget
// // // // // // // // // //                           </span>
// // // // // // // // // //                         </div>
// // // // // // // // // //                         {isExpanded &&
// // // // // // // // // //                           (newBusinessSectionOpen ? (
// // // // // // // // // //                             <ChevronDown size={14} />
// // // // // // // // // //                           ) : (
// // // // // // // // // //                             <ChevronRight size={14} />
// // // // // // // // // //                           ))}
// // // // // // // // // //                       </div>
// // // // // // // // // //                     )}

// // // // // // // // // //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // // // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // //                         {canView("impOpportunity") &&
// // // // // // // // // //                           !isHidden("impOpportunity") && (
// // // // // // // // // //                             <>
// // // // // // // // // //                               <NavItem
// // // // // // // // // //                                 label="Import Opportunity"
// // // // // // // // // //                                 path="/dashboard/import-opportunity"
// // // // // // // // // //                                 selected={selectedPage}
// // // // // // // // // //                                 onClick={handleLinkClick}
// // // // // // // // // //                                 searchTerm={searchTerm}
// // // // // // // // // //                               />
// // // // // // // // // //                             </>
// // // // // // // // // //                           )}
// // // // // // // // // //                         {canView("manageNewBusiness") &&
// // // // // // // // // //                           !isHidden("manageNewBusiness") && (
// // // // // // // // // //                             <NavItem
// // // // // // // // // //                               label="Manage New Business"
// // // // // // // // // //                               path="/dashboard/new-business"
// // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // //                             />
// // // // // // // // // //                           )}
// // // // // // // // // //                         {canView("transferUtility") &&
// // // // // // // // // //                           !isHidden("transferUtility") && (
// // // // // // // // // //                             <NavItem
// // // // // // // // // //                               label="Transfer Project Budget"
// // // // // // // // // //                               path="/dashboard/create-project-budget"
// // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // //                             />
// // // // // // // // // //                           )}
// // // // // // // // // //                       </div>
// // // // // // // // // //                     )}
// // // // // // // // // //                   </div>
// // // // // // // // // //                 )}
// // // // // // // // // //               {/* )} */}
// // // // // // // // // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // // // // // // // // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // // // // // // // // //                   //  ||
// // // // // // // // // //                   // (!isHidden("accountMaster")) ||
// // // // // // // // // //                   // (!isHidden("orgMaster")) ||
// // // // // // // // // //                   // (!isHidden("employeeMaster"))
// // // // // // // // // //                   <div>
// // // // // // // // // //                     {!searchTerm && (
// // // // // // // // // //                       <div
// // // // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // // // // // // // // //                       >
// // // // // // // // // //                         <div className="flex items-center">
// // // // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // // // //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // //                           </div>
// // // // // // // // // //                           <span
// // // // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // //                               }`}
// // // // // // // // // //                           >
// // // // // // // // // //                             Manage
// // // // // // // // // //                           </span>
// // // // // // // // // //                         </div>
// // // // // // // // // //                         {isExpanded &&
// // // // // // // // // //                           (manageSectionOpen ? (
// // // // // // // // // //                             <ChevronDown size={14} />
// // // // // // // // // //                           ) : (
// // // // // // // // // //                             <ChevronRight size={14} />
// // // // // // // // // //                           ))}
// // // // // // // // // //                       </div>
// // // // // // // // // //                     )}

// // // // // // // // // //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// // // // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// // // // // // // // // //                           <NavItem
// // // // // // // // // //                             label="Manage Groups"
// // // // // // // // // //                             path="/dashboard/manage-groups"
// // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // //                           />
// // // // // // // // // //                         )}
// // // // // // // // // //                         {canView("manageUser") && !isHidden("manageUser") && (
// // // // // // // // // //                           <NavItem
// // // // // // // // // //                             label="Manage Users"
// // // // // // // // // //                             path="/dashboard/manage-users"
// // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // //                           />
// // // // // // // // // //                         )}
// // // // // // // // // //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Accounts"
// // // // // // // // // //                           path="/dashboard/account-master"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}
// // // // // // // // // //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Orgs"
// // // // // // // // // //                           path="/dashboard/org-master"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}
// // // // // // // // // //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Employees"
// // // // // // // // // //                           path="/dashboard/employee-master"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}
// // // // // // // // // //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage PLCs"
// // // // // // // // // //                           path="/dashboard/plc-master"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}
// // // // // // // // // //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Projects"
// // // // // // // // // //                           path="/dashboard/project-master"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}

// // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Revenue Formulas"
// // // // // // // // // //                           path="/dashboard/revenueFormula-master"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}
// // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Account Group Table"
// // // // // // // // // //                           path="/dashboard/accountgroup-mapping"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}
// // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Account Group Code"
// // // // // // // // // //                           path="/dashboard/accountgroupcode-master"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}
// // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Account Types"
// // // // // // // // // //                           path="/dashboard/accounttype-master"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}
// // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Company ID"
// // // // // // // // // //                           path="/dashboard/company-master"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}
// // // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Data"
// // // // // // // // // //                           path="/dashboard/manage-data-manager"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                         {/* )} */}

// // // // // // // // // //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// // // // // // // // // //                           <NavItem
// // // // // // // // // //                             label="Manage Company"
// // // // // // // // // //                             path="/dashboard/manage-company"
// // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // //                           />
// // // // // // // // // //                         )}

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Reference"
// // // // // // // // // //                           path="/dashboard/manage-reference"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Employee"
// // // // // // // // // //                           path="/dashboard/manage-employee"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Employee Salary"
// // // // // // // // // //                           path="/dashboard/manage-employee-salary"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Account Mass Link"
// // // // // // // // // //                           path="/dashboard/account-mass-link"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Accounts Link"
// // // // // // // // // //                           path="/dashboard/accounts-link"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Project Roles"
// // // // // // // // // //                           path="/dashboard/manage-project-role"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Revenue"
// // // // // // // // // //                           path="/dashboard/manage-revenue"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Revenue Formulas"
// // // // // // // // // //                           path="/dashboard/manage-revenue-formulas"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Print Project Revenue & Billing Formulas"
// // // // // // // // // //                           path="/dashboard/print-revenue-billing-formulas"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Rate Sequence Orders"
// // // // // // // // // //                           path="/dashboard/manage-rate-sequence-orders"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />

// // // // // // // // // //                         <NavItem
// // // // // // // // // //                           label="Manage Cost of Goods Sold"
// // // // // // // // // //                           path="/dashboard/manage-cogs"
// // // // // // // // // //                           selected={selectedPage}
// // // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // // //                         />
// // // // // // // // // //                       </div>
// // // // // // // // // //                     )}
// // // // // // // // // //                   </div>
// // // // // // // // // //                 )}
// // // // // // // // // //               {/* --- CONFIGURATION SECTION --- */}
// // // // // // // // // //               {((canView("globalConfiguration") &&
// // // // // // // // // //                 !isHidden("globalConfiguration")) ||
// // // // // // // // // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // // // // // // // // //                 (canView("projectOrgSecurity") &&
// // // // // // // // // //                   !isHidden("projectOrgSecurity")) ||
// // // // // // // // // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // // // // // // // // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // // // // // // // // //                 (canView("ceilingConfiguration") &&
// // // // // // // // // //                   !isHidden("ceilingConfiguration")) ||
// // // // // // // // // //                 (canView("fiscalYearPeriods") &&
// // // // // // // // // //                   !isHidden("fiscalYearPeriods")) ||
// // // // // // // // // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // // // // // // // // //                 (canView("prospectiveIdSetup") &&
// // // // // // // // // //                   !isHidden("prospectiveIdSetup")) ||
// // // // // // // // // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // // // // // // // // //                   <div>
// // // // // // // // // //                     {!searchTerm && (
// // // // // // // // // //                       <div
// // // // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // // // // // // // // //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// // // // // // // // // //                       >
// // // // // // // // // //                         <div className="flex items-center">
// // // // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // // // //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // // // // // // // // //                           </div>
// // // // // // // // // //                           <span
// // // // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // //                               }`}
// // // // // // // // // //                           >
// // // // // // // // // //                             Settings
// // // // // // // // // //                           </span>
// // // // // // // // // //                         </div>
// // // // // // // // // //                         {isExpanded &&
// // // // // // // // // //                           (configurationOpen ? (
// // // // // // // // // //                             <ChevronDown size={14} />
// // // // // // // // // //                           ) : (
// // // // // // // // // //                             <ChevronRight size={14} />
// // // // // // // // // //                           ))}
// // // // // // // // // //                       </div>
// // // // // // // // // //                     )}

// // // // // // // // // //                     {(configurationOpen || searchTerm) && isExpanded && (
// // // // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // //                         {canView("globalConfiguration") &&
// // // // // // // // // //                           !isHidden("globalConfiguration") && (
// // // // // // // // // //                             <NavItem
// // // // // // // // // //                               label="Configuration Setting"
// // // // // // // // // //                               path="/dashboard/global-configuration"
// // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // //                             />
// // // // // // // // // //                           )}
// // // // // // // // // //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // // // // // // // // //                           <NavItem
// // // // // // // // // //                             label="Burden Setup"
// // // // // // // // // //                             path="/dashboard/pool-rate-tabs"
// // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // //                           />
// // // // // // // // // //                         )}
// // // // // // // // // //                         {canView("projectOrgSecurity") &&
// // // // // // // // // //                           !isHidden("projectOrgSecurity") && (
// // // // // // // // // //                             <NavItem
// // // // // // // // // //                               label="Project Org Security"
// // // // // // // // // //                               path="/dashboard/projectmapping"
// // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // //                             />
// // // // // // // // // //                           )}
// // // // // // // // // //                         {canView("accountMapping") &&
// // // // // // // // // //                           !isHidden("accountMapping") && (
// // // // // // // // // //                             <NavItem
// // // // // // // // // //                               label="Account Mapping"
// // // // // // // // // //                               path="/dashboard/account-mapping"
// // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // //                             />
// // // // // // // // // //                           )}
// // // // // // // // // //                         {canView("analogRate") && !isHidden("analogRate") && (
// // // // // // // // // //                           <NavItem
// // // // // // // // // //                             label="NBIs Analogous Rate"
// // // // // // // // // //                             path="/dashboard/analog-rate"
// // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // // //                           />
// // // // // // // // // //                         )}
// // // // // // // // // //                         {canView("ceilingConfiguration") &&
// // // // // // // // // //                           !isHidden("ceilingConfiguration") && (
// // // // // // // // // //                             <NavItem
// // // // // // // // // //                               label="Ceiling Configuration"
// // // // // // // // // //                               path="/dashboard/ceiling-configuration"
// // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // //                             />
// // // // // // // // // //                           )}
// // // // // // // // // //                         {canView("fiscalYearPeriods") &&
// // // // // // // // // //                           !isHidden("fiscalYearPeriods") && (
// // // // // // // // // //                             <NavItem
// // // // // // // // // //                               label="Fiscal Year Periods"
// // // // // // // // // //                               path="/dashboard/maintain-fiscal-year-periods"
// // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // //                             />
// // // // // // // // // //                           )}
// // // // // // // // // //                         {canView("annualHolidays") &&
// // // // // // // // // //                           !isHidden("annualHolidays") && (
// // // // // // // // // //                             <NavItem
// // // // // // // // // //                               label="Annual Holidays"
// // // // // // // // // //                               path="/dashboard/annual-holidays"
// // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // //                             />
// // // // // // // // // //                           )}
// // // // // // // // // //                         {canView("prospectiveIdSetup") &&
// // // // // // // // // //                           !isHidden("prospectiveIdSetup") && (
// // // // // // // // // //                             <NavItem
// // // // // // // // // //                               label="Prospective ID Setup"
// // // // // // // // // //                               path="/dashboard/prospective-id-setup"
// // // // // // // // // //                               selected={selectedPage}
// // // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // // //                             />
// // // // // // // // // //                           )}
// // // // // // // // // //                         {canView("roleRights") && !isHidden("roleRights") && (
// // // // // // // // // //                           <NavItem
// // // // // // // // // //                             label="Rights Settings"
// // // // // // // // // //                             path="/dashboard/role-rights"
// // // // // // // // // //                             selected={selectedPage}
// // // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // // //                           />
// // // // // // // // // //                         )}
// // // // // // // // // //                         {/* <NavItem
// // // // // // // // // //                         label="Override Configuration"
// // // // // // // // // //                         path="/dashboard/override-settings"
// // // // // // // // // //                         selected={selectedPage}
// // // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // // //                       /> */}
// // // // // // // // // //                       </div>
// // // // // // // // // //                     )}
// // // // // // // // // //                   </div>
// // // // // // // // // //                 )}
// // // // // // // // // //               <div>
// // // // // // // // // //                 <div
// // // // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // // // // // // // // //                 >
// // // // // // // // // //                   <div className="flex items-center">
// // // // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // //                     </div>
// // // // // // // // // //                     <span
// // // // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // // // //                     >
// // // // // // // // // //                       System Security
// // // // // // // // // //                     </span>
// // // // // // // // // //                   </div>
// // // // // // // // // //                   {isExpanded &&
// // // // // // // // // //                     (securityMenuOpen ? (
// // // // // // // // // //                       <ChevronDown size={14} />
// // // // // // // // // //                     ) : (
// // // // // // // // // //                       <ChevronRight size={14} />
// // // // // // // // // //                     ))}
// // // // // // // // // //                 </div>

// // // // // // // // // //                 {securityMenuOpen && isExpanded && (
// // // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // // // //                     <NavItem
// // // // // // // // // //                       label="Manage User Groups"
// // // // // // // // // //                       path="/dashboard/manage-user-groups"
// // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // //                     />
// // // // // // // // // //                     <NavItem
// // // // // // // // // //                       label="Manage User"
// // // // // // // // // //                       path="/dashboard/manage-users"
// // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // //                     />
// // // // // // // // // //                     <NavItem
// // // // // // // // // //                       label="Manage User Suppression"
// // // // // // // // // //                       path="/dashboard/user-suppression"
// // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // //                     />
// // // // // // // // // //                   </div>
// // // // // // // // // //                 )}
// // // // // // // // // //               </div>

// // // // // // // // // //               <div>
// // // // // // // // // //                 <div
// // // // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // // // // // // // // //                 >
// // // // // // // // // //                   <div className="flex items-center">
// // // // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // // //                     </div>
// // // // // // // // // //                     <span
// // // // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // // // //                     >
// // // // // // // // // //                       Organizational Security
// // // // // // // // // //                     </span>
// // // // // // // // // //                   </div>
// // // // // // // // // //                   {isExpanded &&
// // // // // // // // // //                     (securityOrgMenuOpen ? (
// // // // // // // // // //                       <ChevronDown size={14} />
// // // // // // // // // //                     ) : (
// // // // // // // // // //                       <ChevronRight size={14} />
// // // // // // // // // //                     ))}
// // // // // // // // // //                 </div>

// // // // // // // // // //                 {securityOrgMenuOpen && isExpanded && (
// // // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // // // //                     <NavItem
// // // // // // // // // //                       label="Activate/Inactivate Organization Security by Module"
// // // // // // // // // //                       path="/dashboard/atc-ina-org-sec"
// // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // //                     />
// // // // // // // // // //                     <NavItem
// // // // // // // // // //                       label="Manage Organization Security Profiles"
// // // // // // // // // //                       path="/dashboard/prof-org-sec"
// // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // //                     />
// // // // // // // // // //                     <NavItem
// // // // // // // // // //                       label="Manage Organization Security Groups"
// // // // // // // // // //                       path="/dashboard/groups-org-sec"
// // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // //                     />
// // // // // // // // // //                     <NavItem
// // // // // // // // // //                       label="Update Organization Security Profiles"
// // // // // // // // // //                       path="/dashboard/prof-upd-org-sec"
// // // // // // // // // //                       selected={selectedPage}
// // // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // // //                     />
// // // // // // // // // //                   </div>
// // // // // // // // // //                 )}
// // // // // // // // // //               </div>
// // // // // // // // // //             </div>
// // // // // // // // // //           )}
// // // // // // // // // //         </div>

// // // // // // // // // //         {/* Footer Version */}
// // // // // // // // // //         <div
// // // // // // // // // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // // //             }`}
// // // // // // // // // //         >
// // // // // // // // // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // // // // // // // // //             v{appVersion}
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>

// // // // // // // // // //       {/* Background Overlay for mobile */}
// // // // // // // // // //       {/* {isExpanded  && (
// // // // // // // // // //         <div
// // // // // // // // // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // // // // // // // // //           onClick={handleCloseSidebar}
// // // // // // // // // //         ></div>
// // // // // // // // // //       )} */}
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // // // // // // // // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // // // // // // // // //     return null;
// // // // // // // // // //   }

// // // // // // // // // //   return (
// // // // // // // // // //     <Link
// // // // // // // // // //       to={path}
// // // // // // // // // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// // // // // // // // // //           ? "text-white font-semibold"
// // // // // // // // // //           : "text-gray-500 hover:text-gray-900"
// // // // // // // // // //         }`}
// // // // // // // // // //       style={{
// // // // // // // // // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // // // // // // // // //       }}
// // // // // // // // // //       onClick={(e) => {
// // // // // // // // // //         e.preventDefault();
// // // // // // // // // //         onClick(path);
// // // // // // // // // //       }}
// // // // // // // // // //     >
// // // // // // // // // //       {label}
// // // // // // // // // //     </Link>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default NavigationSidebar;

// // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // // // // // // import {
// // // // // // // // //   Menu,
// // // // // // // // //   X,
// // // // // // // // //   ChevronDown,
// // // // // // // // //   ChevronRight,
// // // // // // // // //   Plus,
// // // // // // // // //   Minus,
// // // // // // // // //   BarChart2,
// // // // // // // // //   Layers,
// // // // // // // // //   FileText,
// // // // // // // // //   Settings,
// // // // // // // // //   BriefcaseBusiness,
// // // // // // // // //   SlidersHorizontal,
// // // // // // // // //   Users, // new icon for New Business Budget section
// // // // // // // // // } from "lucide-react";

// // // // // // // // // const NavigationSidebar = ({
// // // // // // // // //   setIsHovered,
// // // // // // // // //   isHovered,
// // // // // // // // //   setIsSidebarOpen,
// // // // // // // // //   isSidebarOpen,
// // // // // // // // //   canView,
// // // // // // // // // }) => {
// // // // // // // // //   const { pathname } = useLocation();
// // // // // // // // //   const navigate = useNavigate();

// // // // // // // // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // // // // // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // // // // // //   const HIDDEN_FEATURES =
// // // // // // // // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // // // // // // // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // // // // // // // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // // // // // // // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // // //     pathname.includes("/dashboard/import-opportunity") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // // // //     pathname.includes("/dashboard/financial-report") ||
// // // // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // // // //     pathname.includes("/service-unavailable") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-data-manager") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles")

// // // // // // // // //   );

// // // // // // // // //   const [planningOpen, setPlanningOpen] = useState(
// // // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // // //     // pathname.includes("/dashboard/new-business") ||
// // // // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // // // //     pathname.includes("/dashboard/financial-report"),
// // // // // // // // //   );

// // // // // // // // //   const [configurationOpen, setConfigurationOpen] = useState(
// // // // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // // //   );

// // // // // // // // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // // //     pathname.includes("/dashboard/template-pool-mapping"),
// // // // // // // // //   );

// // // // // // // // //   // NEW: New Business Budget section open state
// // // // // // // // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // // // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // // //     pathname.includes("/dashboard/import-opportunity"),
// // // // // // // // //   );

// // // // // // // // //   // NEW: Manage (Users & Groups) section open state
// // // // // // // // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // // //     pathname.includes("/dashboard/account-mass-link") ||
// // // // // // // // //     pathname.includes("/dashboard/accounts-link") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles")
// // // // // // // // //   );

// // // // // // // // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // // //     pathname.includes("/dashboard/display-settings"),
// // // // // // // // //   );

// // // // // // // // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // // // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // // //     pathname.includes("/dashboard/user-suppression"),
// // // // // // // // //   );

// // // // // // // // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // // // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // // //   );

// // // // // // // // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // // // // // // // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // // // // // // // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // // // // // // // //   const [userName, setUserName] = useState("");

// // // // // // // // //   // hover state (existing)
// // // // // // // // //   // const [isHovered, setIsHovered] = useState(false);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const userString = localStorage.getItem("currentUser");
// // // // // // // // //     if (userString) {
// // // // // // // // //       try {
// // // // // // // // //         const userObj = JSON.parse(userString);
// // // // // // // // //         setUserName(userObj.name);
// // // // // // // // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // // // // // // // //       } catch {
// // // // // // // // //         setCurrentUserRole(null);
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   }, []);

// // // // // // // // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // // // // // // // //   const handleLinkClick = (pagePath) => {
// // // // // // // // //     setSelectedPage(pagePath);
// // // // // // // // //     navigate(pagePath);
// // // // // // // // //     if (isSidebarOpen) {
// // // // // // // // //       setIsSidebarOpen(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleCloseSidebar = () => {
// // // // // // // // //     setSearchTerm("");
// // // // // // // // //     setIsSidebarOpen(false);
// // // // // // // // //   };
// // // // // // // // //   const handleOpenSidebar = () => {
// // // // // // // // //     setIsSidebarOpen(true);
// // // // // // // // //   };
// // // // // // // // //   const isExpanded = isSidebarOpen || isHovered;

// // // // // // // // //   return (
// // // // // // // // //     <div
// // // // // // // // //       // onMouseOver={handleOpenSidebar}
// // // // // // // // //       // onMouseLeave={handleCloseSidebar}
// // // // // // // // //       className="flex min-h-screen font-inter bg-white"
// // // // // // // // //     >
// // // // // // // // //       {/* Mobile Toggle */}
// // // // // // // // //       <button
// // // // // // // // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // // // // // // // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // // // // // // // //       >
// // // // // // // // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // // // // // // // //       </button>

// // // // // // // // //       {/* Sidebar - Hover to expand */}
// // // // // // // // //       <div
// // // // // // // // //         onMouseEnter={() => setIsHovered(true)}
// // // // // // // // //         onMouseLeave={() => setIsHovered(false)}
// // // // // // // // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // // // // // // // //       bg-white border-r border-gray-200
// // // // // // // // //       transition-all duration-300 ease-in-out shadow-sm
// // // // // // // // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // // // // // // // //       md:translate-x-0

// // // // // // // // //     `}
// // // // // // // // //       >
// // // // // // // // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // // // // // // // //           {/* Menu / General Toggle Section */}
// // // // // // // // //           <div
// // // // // // // // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // // // // // // // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // // // // // // // //           >
// // // // // // // // //             <div className="w-8 flex justify-center">
// // // // // // // // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // // // // // // // //             </div>
// // // // // // // // //             <span
// // // // // // // // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // //                 }`}
// // // // // // // // //             >
// // // // // // // // //               Menu
// // // // // // // // //             </span>
// // // // // // // // //           </div>

// // // // // // // // //           {generalMenuOpen && (
// // // // // // // // //             <div className="space-y-1 mt-2">
// // // // // // // // //               {/* --- PLANNING SECTION --- */}
// // // // // // // // //               <div>
// // // // // // // // //                 <div
// // // // // // // // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // // // // // // // //                 >
// // // // // // // // //                   <input
// // // // // // // // //                     type="text"
// // // // // // // // //                     placeholder="Search..."
// // // // // // // // //                     value={searchTerm}
// // // // // // // // //                     onChange={(e) =>
// // // // // // // // //                       setSearchTerm(e.target.value.toLowerCase())
// // // // // // // // //                     }
// // // // // // // // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // // // // // // // //                   />
// // // // // // // // //                 </div>
// // // // // // // // //                 {!searchTerm && (
// // // // // // // // //                   <div
// // // // // // // // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // // // // // // // //                   >
// // // // // // // // //                     <div className="flex items-center">
// // // // // // // // //                       <div className="w-8 flex justify-center">
// // // // // // // // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // //                       </div>
// // // // // // // // //                       <span
// // // // // // // // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // //                           }`}
// // // // // // // // //                       >
// // // // // // // // //                         Planning
// // // // // // // // //                       </span>
// // // // // // // // //                     </div>
// // // // // // // // //                     {isExpanded &&
// // // // // // // // //                       (planningOpen ? (
// // // // // // // // //                         <ChevronDown size={14} />
// // // // // // // // //                       ) : (
// // // // // // // // //                         <ChevronRight size={14} />
// // // // // // // // //                       ))}
// // // // // // // // //                   </div>
// // // // // // // // //                 )}

// // // // // // // // //                 {(planningOpen || searchTerm) && isExpanded && (
// // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // //                     <NavItem
// // // // // // // // //                       label="Project Planning"
// // // // // // // // //                       path="/dashboard/project-budget-status"
// // // // // // // // //                       selected={selectedPage}
// // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // //                       searchTerm={searchTerm}
// // // // // // // // //                     />
// // // // // // // // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // // // // // // // //                       <>
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Reporting"
// // // // // // // // //                           path="/dashboard/project-report"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                       </>
// // // // // // // // //                     )}

// // // // // // // // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // // // // // // // //                       <NavItem
// // // // // // // // //                         label="Mass Utility"
// // // // // // // // //                         path="/dashboard/mass-utility"
// // // // // // // // //                         selected={selectedPage}
// // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // //                       />
// // // // // // // // //                     )}
// // // // // // // // //                     {canView("pricing") && !isHidden("pricing") && (
// // // // // // // // //                       <NavItem
// // // // // // // // //                         label="Pricing"
// // // // // // // // //                         path="/dashboard/pricing"
// // // // // // // // //                         selected={selectedPage}
// // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // //                         searchTerm={searchTerm}
// // // // // // // // //                       />
// // // // // // // // //                     )}

// // // // // // // // //                     {canView("financialReport") &&
// // // // // // // // //                       !isHidden("financialReport") && (
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Financial Report"
// // // // // // // // //                           path="/dashboard/financial-report"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                       )}
// // // // // // // // //                   </div>
// // // // // // // // //                 )}
// // // // // // // // //               </div>
// // // // // // // // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // // // // // // // //               {/* {currentUserRole === "admin" && ( */}
// // // // // // // // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // // // // // // // //                 (canView("transferUtility") &&
// // // // // // // // //                   !isHidden("manageNewBusiness")) ||
// // // // // // // // //                 (canView("impOpportunity") &&
// // // // // // // // //                   !isHidden("transferUtility"))) && (
// // // // // // // // //                   <div>
// // // // // // // // //                     {!searchTerm && (
// // // // // // // // //                       <div
// // // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // //                         onClick={() =>
// // // // // // // // //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // // // // // // // //                         }
// // // // // // // // //                       >
// // // // // // // // //                         <div className="flex items-center">
// // // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // // //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // //                           </div>
// // // // // // // // //                           <span
// // // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // //                               }`}
// // // // // // // // //                           >
// // // // // // // // //                             New Business Budget
// // // // // // // // //                           </span>
// // // // // // // // //                         </div>
// // // // // // // // //                         {isExpanded &&
// // // // // // // // //                           (newBusinessSectionOpen ? (
// // // // // // // // //                             <ChevronDown size={14} />
// // // // // // // // //                           ) : (
// // // // // // // // //                             <ChevronRight size={14} />
// // // // // // // // //                           ))}
// // // // // // // // //                       </div>
// // // // // // // // //                     )}

// // // // // // // // //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // //                         {canView("impOpportunity") &&
// // // // // // // // //                           !isHidden("impOpportunity") && (
// // // // // // // // //                             <>
// // // // // // // // //                               <NavItem
// // // // // // // // //                                 label="Import Opportunity"
// // // // // // // // //                                 path="/dashboard/import-opportunity"
// // // // // // // // //                                 selected={selectedPage}
// // // // // // // // //                                 onClick={handleLinkClick}
// // // // // // // // //                                 searchTerm={searchTerm}
// // // // // // // // //                               />
// // // // // // // // //                             </>
// // // // // // // // //                           )}
// // // // // // // // //                         {canView("manageNewBusiness") &&
// // // // // // // // //                           !isHidden("manageNewBusiness") && (
// // // // // // // // //                             <NavItem
// // // // // // // // //                               label="Manage New Business"
// // // // // // // // //                               path="/dashboard/new-business"
// // // // // // // // //                               selected={selectedPage}
// // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // //                             />
// // // // // // // // //                           )}
// // // // // // // // //                         {canView("transferUtility") &&
// // // // // // // // //                           !isHidden("transferUtility") && (
// // // // // // // // //                             <NavItem
// // // // // // // // //                               label="Transfer Project Budget"
// // // // // // // // //                               path="/dashboard/create-project-budget"
// // // // // // // // //                               selected={selectedPage}
// // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // //                             />
// // // // // // // // //                           )}
// // // // // // // // //                       </div>
// // // // // // // // //                     )}
// // // // // // // // //                   </div>
// // // // // // // // //                 )}
// // // // // // // // //               {/* )} */}
// // // // // // // // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // // // // // // // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // // // // // // // //                   //  ||
// // // // // // // // //                   // (!isHidden("accountMaster")) ||
// // // // // // // // //                   // (!isHidden("orgMaster")) ||
// // // // // // // // //                   // (!isHidden("employeeMaster"))
// // // // // // // // //                   <div>
// // // // // // // // //                     {!searchTerm && (
// // // // // // // // //                       <div
// // // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // // // // // // // //                       >
// // // // // // // // //                         <div className="flex items-center">
// // // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // // //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // //                           </div>
// // // // // // // // //                           <span
// // // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // //                               }`}
// // // // // // // // //                           >
// // // // // // // // //                             Manage
// // // // // // // // //                           </span>
// // // // // // // // //                         </div>
// // // // // // // // //                         {isExpanded &&
// // // // // // // // //                           (manageSectionOpen ? (
// // // // // // // // //                             <ChevronDown size={14} />
// // // // // // // // //                           ) : (
// // // // // // // // //                             <ChevronRight size={14} />
// // // // // // // // //                           ))}
// // // // // // // // //                       </div>
// // // // // // // // //                     )}

// // // // // // // // //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// // // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// // // // // // // // //                           <NavItem
// // // // // // // // //                             label="Manage Groups"
// // // // // // // // //                             path="/dashboard/manage-groups"
// // // // // // // // //                             selected={selectedPage}
// // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // //                           />
// // // // // // // // //                         )}
// // // // // // // // //                         {canView("manageUser") && !isHidden("manageUser") && (
// // // // // // // // //                           <NavItem
// // // // // // // // //                             label="Manage Users"
// // // // // // // // //                             path="/dashboard/manage-users"
// // // // // // // // //                             selected={selectedPage}
// // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // //                           />
// // // // // // // // //                         )}
// // // // // // // // //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Accounts"
// // // // // // // // //                           path="/dashboard/account-master"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}
// // // // // // // // //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Orgs"
// // // // // // // // //                           path="/dashboard/org-master"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}
// // // // // // // // //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Employees"
// // // // // // // // //                           path="/dashboard/employee-master"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}
// // // // // // // // //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage PLCs"
// // // // // // // // //                           path="/dashboard/plc-master"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}
// // // // // // // // //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Projects"
// // // // // // // // //                           path="/dashboard/project-master"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}

// // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Revenue Formulas"
// // // // // // // // //                           path="/dashboard/revenueFormula-master"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}
// // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Account Group Table"
// // // // // // // // //                           path="/dashboard/accountgroup-mapping"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}
// // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Account Group Code"
// // // // // // // // //                           path="/dashboard/accountgroupcode-master"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}
// // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Account Types"
// // // // // // // // //                           path="/dashboard/accounttype-master"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}
// // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Company ID"
// // // // // // // // //                           path="/dashboard/company-master"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}
// // // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Data"
// // // // // // // // //                           path="/dashboard/manage-data-manager"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                         {/* )} */}

// // // // // // // // //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// // // // // // // // //                           <NavItem
// // // // // // // // //                             label="Manage Company"
// // // // // // // // //                             path="/dashboard/manage-company"
// // // // // // // // //                             selected={selectedPage}
// // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // //                           />
// // // // // // // // //                         )}

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Reference"
// // // // // // // // //                           path="/dashboard/manage-reference"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Employee"
// // // // // // // // //                           path="/dashboard/manage-employee"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Employee Salary"
// // // // // // // // //                           path="/dashboard/manage-employee-salary"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Account Mass Link"
// // // // // // // // //                           path="/dashboard/account-mass-link"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Accounts Link"
// // // // // // // // //                           path="/dashboard/accounts-link"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Project Roles"
// // // // // // // // //                           path="/dashboard/manage-project-role"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Revenue"
// // // // // // // // //                           path="/dashboard/manage-revenue"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Revenue Formulas"
// // // // // // // // //                           path="/dashboard/manage-revenue-formulas"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Print Project Revenue & Billing Formulas"
// // // // // // // // //                           path="/dashboard/print-revenue-billing-formulas"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Rate Sequence Orders"
// // // // // // // // //                           path="/dashboard/manage-rate-sequence-orders"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Cost of Goods Sold"
// // // // // // // // //                           path="/dashboard/manage-cogs"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />

// // // // // // // // //                         <NavItem
// // // // // // // // //                           label="Manage Alternate Project Revenue Profiles"
// // // // // // // // //                           path="/dashboard/manage-alternate-project-revenue-profiles"
// // // // // // // // //                           selected={selectedPage}
// // // // // // // // //                           onClick={handleLinkClick}
// // // // // // // // //                           searchTerm={searchTerm}
// // // // // // // // //                         />
// // // // // // // // //                       </div>
// // // // // // // // //                     )}
// // // // // // // // //                   </div>
// // // // // // // // //                 )}
// // // // // // // // //               {/* --- CONFIGURATION SECTION --- */}
// // // // // // // // //               {((canView("globalConfiguration") &&
// // // // // // // // //                 !isHidden("globalConfiguration")) ||
// // // // // // // // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // // // // // // // //                 (canView("projectOrgSecurity") &&
// // // // // // // // //                   !isHidden("projectOrgSecurity")) ||
// // // // // // // // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // // // // // // // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // // // // // // // //                 (canView("ceilingConfiguration") &&
// // // // // // // // //                   !isHidden("ceilingConfiguration")) ||
// // // // // // // // //                 (canView("fiscalYearPeriods") &&
// // // // // // // // //                   !isHidden("fiscalYearPeriods")) ||
// // // // // // // // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // // // // // // // //                 (canView("prospectiveIdSetup") &&
// // // // // // // // //                   !isHidden("prospectiveIdSetup")) ||
// // // // // // // // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // // // // // // // //                   <div>
// // // // // // // // //                     {!searchTerm && (
// // // // // // // // //                       <div
// // // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // // // // // // // //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// // // // // // // // //                       >
// // // // // // // // //                         <div className="flex items-center">
// // // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // // //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // // // // // // // //                           </div>
// // // // // // // // //                           <span
// // // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // //                               }`}
// // // // // // // // //                           >
// // // // // // // // //                             Settings
// // // // // // // // //                           </span>
// // // // // // // // //                         </div>
// // // // // // // // //                         {isExpanded &&
// // // // // // // // //                           (configurationOpen ? (
// // // // // // // // //                             <ChevronDown size={14} />
// // // // // // // // //                           ) : (
// // // // // // // // //                             <ChevronRight size={14} />
// // // // // // // // //                           ))}
// // // // // // // // //                       </div>
// // // // // // // // //                     )}

// // // // // // // // //                     {(configurationOpen || searchTerm) && isExpanded && (
// // // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // //                         {canView("globalConfiguration") &&
// // // // // // // // //                           !isHidden("globalConfiguration") && (
// // // // // // // // //                             <NavItem
// // // // // // // // //                               label="Configuration Setting"
// // // // // // // // //                               path="/dashboard/global-configuration"
// // // // // // // // //                               selected={selectedPage}
// // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // //                             />
// // // // // // // // //                           )}
// // // // // // // // //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // // // // // // // //                           <NavItem
// // // // // // // // //                             label="Burden Setup"
// // // // // // // // //                             path="/dashboard/pool-rate-tabs"
// // // // // // // // //                             selected={selectedPage}
// // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // //                           />
// // // // // // // // //                         )}
// // // // // // // // //                         {canView("projectOrgSecurity") &&
// // // // // // // // //                           !isHidden("projectOrgSecurity") && (
// // // // // // // // //                             <NavItem
// // // // // // // // //                               label="Project Org Security"
// // // // // // // // //                               path="/dashboard/projectmapping"
// // // // // // // // //                               selected={selectedPage}
// // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // //                             />
// // // // // // // // //                           )}
// // // // // // // // //                         {canView("accountMapping") &&
// // // // // // // // //                           !isHidden("accountMapping") && (
// // // // // // // // //                             <NavItem
// // // // // // // // //                               label="Account Mapping"
// // // // // // // // //                               path="/dashboard/account-mapping"
// // // // // // // // //                               selected={selectedPage}
// // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // //                             />
// // // // // // // // //                           )}
// // // // // // // // //                         {canView("analogRate") && !isHidden("analogRate") && (
// // // // // // // // //                           <NavItem
// // // // // // // // //                             label="NBIs Analogous Rate"
// // // // // // // // //                             path="/dashboard/analog-rate"
// // // // // // // // //                             selected={selectedPage}
// // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // //                             searchTerm={searchTerm}
// // // // // // // // //                           />
// // // // // // // // //                         )}
// // // // // // // // //                         {canView("ceilingConfiguration") &&
// // // // // // // // //                           !isHidden("ceilingConfiguration") && (
// // // // // // // // //                             <NavItem
// // // // // // // // //                               label="Ceiling Configuration"
// // // // // // // // //                               path="/dashboard/ceiling-configuration"
// // // // // // // // //                               selected={selectedPage}
// // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // //                             />
// // // // // // // // //                           )}
// // // // // // // // //                         {canView("fiscalYearPeriods") &&
// // // // // // // // //                           !isHidden("fiscalYearPeriods") && (
// // // // // // // // //                             <NavItem
// // // // // // // // //                               label="Fiscal Year Periods"
// // // // // // // // //                               path="/dashboard/maintain-fiscal-year-periods"
// // // // // // // // //                               selected={selectedPage}
// // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // //                             />
// // // // // // // // //                           )}
// // // // // // // // //                         {canView("annualHolidays") &&
// // // // // // // // //                           !isHidden("annualHolidays") && (
// // // // // // // // //                             <NavItem
// // // // // // // // //                               label="Annual Holidays"
// // // // // // // // //                               path="/dashboard/annual-holidays"
// // // // // // // // //                               selected={selectedPage}
// // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // //                             />
// // // // // // // // //                           )}
// // // // // // // // //                         {canView("prospectiveIdSetup") &&
// // // // // // // // //                           !isHidden("prospectiveIdSetup") && (
// // // // // // // // //                             <NavItem
// // // // // // // // //                               label="Prospective ID Setup"
// // // // // // // // //                               path="/dashboard/prospective-id-setup"
// // // // // // // // //                               selected={selectedPage}
// // // // // // // // //                               onClick={handleLinkClick}
// // // // // // // // //                               searchTerm={searchTerm}
// // // // // // // // //                             />
// // // // // // // // //                           )}
// // // // // // // // //                         {canView("roleRights") && !isHidden("roleRights") && (
// // // // // // // // //                           <NavItem
// // // // // // // // //                             label="Rights Settings"
// // // // // // // // //                             path="/dashboard/role-rights"
// // // // // // // // //                             selected={selectedPage}
// // // // // // // // //                             onClick={handleLinkClick}
// // // // // // // // //                           />
// // // // // // // // //                         )}
// // // // // // // // //                         {/* <NavItem
// // // // // // // // //                         label="Override Configuration"
// // // // // // // // //                         path="/dashboard/override-settings"
// // // // // // // // //                         selected={selectedPage}
// // // // // // // // //                         onClick={handleLinkClick}
// // // // // // // // //                       /> */}
// // // // // // // // //                       </div>
// // // // // // // // //                     )}
// // // // // // // // //                   </div>
// // // // // // // // //                 )}
// // // // // // // // //               <div>
// // // // // // // // //                 <div
// // // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // // // // // // // //                 >
// // // // // // // // //                   <div className="flex items-center">
// // // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // //                     </div>
// // // // // // // // //                     <span
// // // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // // //                     >
// // // // // // // // //                       System Security
// // // // // // // // //                     </span>
// // // // // // // // //                   </div>
// // // // // // // // //                   {isExpanded &&
// // // // // // // // //                     (securityMenuOpen ? (
// // // // // // // // //                       <ChevronDown size={14} />
// // // // // // // // //                     ) : (
// // // // // // // // //                       <ChevronRight size={14} />
// // // // // // // // //                     ))}
// // // // // // // // //                 </div>

// // // // // // // // //                 {securityMenuOpen && isExpanded && (
// // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // // //                     <NavItem
// // // // // // // // //                       label="Manage User Groups"
// // // // // // // // //                       path="/dashboard/manage-user-groups"
// // // // // // // // //                       selected={selectedPage}
// // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // //                     />
// // // // // // // // //                     <NavItem
// // // // // // // // //                       label="Manage User"
// // // // // // // // //                       path="/dashboard/manage-users"
// // // // // // // // //                       selected={selectedPage}
// // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // //                     />
// // // // // // // // //                     <NavItem
// // // // // // // // //                       label="Manage User Suppression"
// // // // // // // // //                       path="/dashboard/user-suppression"
// // // // // // // // //                       selected={selectedPage}
// // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // //                     />
// // // // // // // // //                   </div>
// // // // // // // // //                 )}
// // // // // // // // //               </div>

// // // // // // // // //               <div>
// // // // // // // // //                 <div
// // // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // // // // // // // //                 >
// // // // // // // // //                   <div className="flex items-center">
// // // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // // //                     </div>
// // // // // // // // //                     <span
// // // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // // //                     >
// // // // // // // // //                       Organizational Security
// // // // // // // // //                     </span>
// // // // // // // // //                   </div>
// // // // // // // // //                   {isExpanded &&
// // // // // // // // //                     (securityOrgMenuOpen ? (
// // // // // // // // //                       <ChevronDown size={14} />
// // // // // // // // //                     ) : (
// // // // // // // // //                       <ChevronRight size={14} />
// // // // // // // // //                     ))}
// // // // // // // // //                 </div>

// // // // // // // // //                 {securityOrgMenuOpen && isExpanded && (
// // // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // // //                     <NavItem
// // // // // // // // //                       label="Activate/Inactivate Organization Security by Module"
// // // // // // // // //                       path="/dashboard/atc-ina-org-sec"
// // // // // // // // //                       selected={selectedPage}
// // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // //                     />
// // // // // // // // //                     <NavItem
// // // // // // // // //                       label="Manage Organization Security Profiles"
// // // // // // // // //                       path="/dashboard/prof-org-sec"
// // // // // // // // //                       selected={selectedPage}
// // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // //                     />
// // // // // // // // //                     <NavItem
// // // // // // // // //                       label="Manage Organization Security Groups"
// // // // // // // // //                       path="/dashboard/groups-org-sec"
// // // // // // // // //                       selected={selectedPage}
// // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // //                     />
// // // // // // // // //                     <NavItem
// // // // // // // // //                       label="Update Organization Security Profiles"
// // // // // // // // //                       path="/dashboard/prof-upd-org-sec"
// // // // // // // // //                       selected={selectedPage}
// // // // // // // // //                       onClick={handleLinkClick}
// // // // // // // // //                     />
// // // // // // // // //                   </div>
// // // // // // // // //                 )}
// // // // // // // // //               </div>
// // // // // // // // //             </div>
// // // // // // // // //           )}
// // // // // // // // //         </div>

// // // // // // // // //         {/* Footer Version */}
// // // // // // // // //         <div
// // // // // // // // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // // //             }`}
// // // // // // // // //         >
// // // // // // // // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // // // // // // // //             v{appVersion}
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       </div>

// // // // // // // // //       {/* Background Overlay for mobile */}
// // // // // // // // //       {/* {isExpanded  && (
// // // // // // // // //         <div
// // // // // // // // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // // // // // // // //           onClick={handleCloseSidebar}
// // // // // // // // //         ></div>
// // // // // // // // //       )} */}
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // // // // // // // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // // // // // // // //     return null;
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <Link
// // // // // // // // //       to={path}
// // // // // // // // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// // // // // // // // //           ? "text-white font-semibold"
// // // // // // // // //           : "text-gray-500 hover:text-gray-900"
// // // // // // // // //         }`}
// // // // // // // // //       style={{
// // // // // // // // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // // // // // // // //       }}
// // // // // // // // //       onClick={(e) => {
// // // // // // // // //         e.preventDefault();
// // // // // // // // //         onClick(path);
// // // // // // // // //       }}
// // // // // // // // //     >
// // // // // // // // //       {label}
// // // // // // // // //     </Link>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default NavigationSidebar;

// // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // // // // // import {
// // // // // // // //   Menu,
// // // // // // // //   X,
// // // // // // // //   ChevronDown,
// // // // // // // //   ChevronRight,
// // // // // // // //   Plus,
// // // // // // // //   Minus,
// // // // // // // //   BarChart2,
// // // // // // // //   Layers,
// // // // // // // //   FileText,
// // // // // // // //   Settings,
// // // // // // // //   BriefcaseBusiness,
// // // // // // // //   SlidersHorizontal,
// // // // // // // //   Users, // new icon for New Business Budget section
// // // // // // // // } from "lucide-react";

// // // // // // // // const NavigationSidebar = ({
// // // // // // // //   setIsHovered,
// // // // // // // //   isHovered,
// // // // // // // //   setIsSidebarOpen,
// // // // // // // //   isSidebarOpen,
// // // // // // // //   canView,
// // // // // // // // }) => {
// // // // // // // //   const { pathname } = useLocation();
// // // // // // // //   const navigate = useNavigate();

// // // // // // // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // // // // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // // // // //   const HIDDEN_FEATURES =
// // // // // // // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // // // // // // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // // // // // // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // // // // // // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // //     pathname.includes("/dashboard/import-opportunity") ||
// // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // // //     pathname.includes("/dashboard/financial-report") ||
// // // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // // //     pathname.includes("/service-unavailable") ||
// // // // // // // //     pathname.includes("/dashboard/manage-data-manager") ||
// // // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // // // // // // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history")

// // // // // // // //   );

// // // // // // // //   const [planningOpen, setPlanningOpen] = useState(
// // // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // // //     // pathname.includes("/dashboard/new-business") ||
// // // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // // //     pathname.includes("/dashboard/financial-report"),
// // // // // // // //   );

// // // // // // // //   const [configurationOpen, setConfigurationOpen] = useState(
// // // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // //   );

// // // // // // // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // // //     pathname.includes("/dashboard/template-pool-mapping"),
// // // // // // // //   );

// // // // // // // //   // NEW: New Business Budget section open state
// // // // // // // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // // //     pathname.includes("/dashboard/import-opportunity"),
// // // // // // // //   );

// // // // // // // //   // NEW: Manage (Users & Groups) section open state
// // // // // // // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // // //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // // //     pathname.includes("/dashboard/account-mass-link") ||
// // // // // // // //     pathname.includes("/dashboard/accounts-link") ||
// // // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles")
// // // // // // // //   );

// // // // // // // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // // //     pathname.includes("/dashboard/display-settings"),
// // // // // // // //   );

// // // // // // // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // // //     pathname.includes("/dashboard/user-suppression"),
// // // // // // // //   );

// // // // // // // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // // //   );

// // // // // // // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // // // // // // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // // // // // // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // // // // // // //   const [userName, setUserName] = useState("");

// // // // // // // //   // hover state (existing)
// // // // // // // //   // const [isHovered, setIsHovered] = useState(false);

// // // // // // // //   useEffect(() => {
// // // // // // // //     const userString = localStorage.getItem("currentUser");
// // // // // // // //     if (userString) {
// // // // // // // //       try {
// // // // // // // //         const userObj = JSON.parse(userString);
// // // // // // // //         setUserName(userObj.name);
// // // // // // // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // // // // // // //       } catch {
// // // // // // // //         setCurrentUserRole(null);
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //   }, []);

// // // // // // // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // // // // // // //   const handleLinkClick = (pagePath) => {
// // // // // // // //     setSelectedPage(pagePath);
// // // // // // // //     navigate(pagePath);
// // // // // // // //     if (isSidebarOpen) {
// // // // // // // //       setIsSidebarOpen(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleCloseSidebar = () => {
// // // // // // // //     setSearchTerm("");
// // // // // // // //     setIsSidebarOpen(false);
// // // // // // // //   };
// // // // // // // //   const handleOpenSidebar = () => {
// // // // // // // //     setIsSidebarOpen(true);
// // // // // // // //   };
// // // // // // // //   const isExpanded = isSidebarOpen || isHovered;

// // // // // // // //   return (
// // // // // // // //     <div
// // // // // // // //       // onMouseOver={handleOpenSidebar}
// // // // // // // //       // onMouseLeave={handleCloseSidebar}
// // // // // // // //       className="flex min-h-screen font-inter bg-white"
// // // // // // // //     >
// // // // // // // //       {/* Mobile Toggle */}
// // // // // // // //       <button
// // // // // // // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // // // // // // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // // // // // // //       >
// // // // // // // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // // // // // // //       </button>

// // // // // // // //       {/* Sidebar - Hover to expand */}
// // // // // // // //       <div
// // // // // // // //         onMouseEnter={() => setIsHovered(true)}
// // // // // // // //         onMouseLeave={() => setIsHovered(false)}
// // // // // // // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // // // // // // //       bg-white border-r border-gray-200
// // // // // // // //       transition-all duration-300 ease-in-out shadow-sm
// // // // // // // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // // // // // // //       md:translate-x-0

// // // // // // // //     `}
// // // // // // // //       >
// // // // // // // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // // // // // // //           {/* Menu / General Toggle Section */}
// // // // // // // //           <div
// // // // // // // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // // // // // // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // // // // // // //           >
// // // // // // // //             <div className="w-8 flex justify-center">
// // // // // // // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // // // // // // //             </div>
// // // // // // // //             <span
// // // // // // // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // //                 }`}
// // // // // // // //             >
// // // // // // // //               Menu
// // // // // // // //             </span>
// // // // // // // //           </div>

// // // // // // // //           {generalMenuOpen && (
// // // // // // // //             <div className="space-y-1 mt-2">
// // // // // // // //               {/* --- PLANNING SECTION --- */}
// // // // // // // //               <div>
// // // // // // // //                 <div
// // // // // // // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // // // // // // //                 >
// // // // // // // //                   <input
// // // // // // // //                     type="text"
// // // // // // // //                     placeholder="Search..."
// // // // // // // //                     value={searchTerm}
// // // // // // // //                     onChange={(e) =>
// // // // // // // //                       setSearchTerm(e.target.value.toLowerCase())
// // // // // // // //                     }
// // // // // // // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // // // // // // //                   />
// // // // // // // //                 </div>
// // // // // // // //                 {!searchTerm && (
// // // // // // // //                   <div
// // // // // // // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // // // // // // //                   >
// // // // // // // //                     <div className="flex items-center">
// // // // // // // //                       <div className="w-8 flex justify-center">
// // // // // // // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // //                       </div>
// // // // // // // //                       <span
// // // // // // // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // //                           }`}
// // // // // // // //                       >
// // // // // // // //                         Planning
// // // // // // // //                       </span>
// // // // // // // //                     </div>
// // // // // // // //                     {isExpanded &&
// // // // // // // //                       (planningOpen ? (
// // // // // // // //                         <ChevronDown size={14} />
// // // // // // // //                       ) : (
// // // // // // // //                         <ChevronRight size={14} />
// // // // // // // //                       ))}
// // // // // // // //                   </div>
// // // // // // // //                 )}

// // // // // // // //                 {(planningOpen || searchTerm) && isExpanded && (
// // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // //                     <NavItem
// // // // // // // //                       label="Project Planning"
// // // // // // // //                       path="/dashboard/project-budget-status"
// // // // // // // //                       selected={selectedPage}
// // // // // // // //                       onClick={handleLinkClick}
// // // // // // // //                       searchTerm={searchTerm}
// // // // // // // //                     />
// // // // // // // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // // // // // // //                       <>
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Reporting"
// // // // // // // //                           path="/dashboard/project-report"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                       </>
// // // // // // // //                     )}

// // // // // // // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // // // // // // //                       <NavItem
// // // // // // // //                         label="Mass Utility"
// // // // // // // //                         path="/dashboard/mass-utility"
// // // // // // // //                         selected={selectedPage}
// // // // // // // //                         onClick={handleLinkClick}
// // // // // // // //                         searchTerm={searchTerm}
// // // // // // // //                       />
// // // // // // // //                     )}
// // // // // // // //                     {canView("pricing") && !isHidden("pricing") && (
// // // // // // // //                       <NavItem
// // // // // // // //                         label="Pricing"
// // // // // // // //                         path="/dashboard/pricing"
// // // // // // // //                         selected={selectedPage}
// // // // // // // //                         onClick={handleLinkClick}
// // // // // // // //                         searchTerm={searchTerm}
// // // // // // // //                       />
// // // // // // // //                     )}

// // // // // // // //                     {canView("financialReport") &&
// // // // // // // //                       !isHidden("financialReport") && (
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Financial Report"
// // // // // // // //                           path="/dashboard/financial-report"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                       )}
// // // // // // // //                   </div>
// // // // // // // //                 )}
// // // // // // // //               </div>
// // // // // // // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // // // // // // //               {/* {currentUserRole === "admin" && ( */}
// // // // // // // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // // // // // // //                 (canView("transferUtility") &&
// // // // // // // //                   !isHidden("manageNewBusiness")) ||
// // // // // // // //                 (canView("impOpportunity") &&
// // // // // // // //                   !isHidden("transferUtility"))) && (
// // // // // // // //                   <div>
// // // // // // // //                     {!searchTerm && (
// // // // // // // //                       <div
// // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // //                         onClick={() =>
// // // // // // // //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // // // // // // //                         }
// // // // // // // //                       >
// // // // // // // //                         <div className="flex items-center">
// // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // //                           </div>
// // // // // // // //                           <span
// // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // //                               }`}
// // // // // // // //                           >
// // // // // // // //                             New Business Budget
// // // // // // // //                           </span>
// // // // // // // //                         </div>
// // // // // // // //                         {isExpanded &&
// // // // // // // //                           (newBusinessSectionOpen ? (
// // // // // // // //                             <ChevronDown size={14} />
// // // // // // // //                           ) : (
// // // // // // // //                             <ChevronRight size={14} />
// // // // // // // //                           ))}
// // // // // // // //                       </div>
// // // // // // // //                     )}

// // // // // // // //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // //                         {canView("impOpportunity") &&
// // // // // // // //                           !isHidden("impOpportunity") && (
// // // // // // // //                             <>
// // // // // // // //                               <NavItem
// // // // // // // //                                 label="Import Opportunity"
// // // // // // // //                                 path="/dashboard/import-opportunity"
// // // // // // // //                                 selected={selectedPage}
// // // // // // // //                                 onClick={handleLinkClick}
// // // // // // // //                                 searchTerm={searchTerm}
// // // // // // // //                               />
// // // // // // // //                             </>
// // // // // // // //                           )}
// // // // // // // //                         {canView("manageNewBusiness") &&
// // // // // // // //                           !isHidden("manageNewBusiness") && (
// // // // // // // //                             <NavItem
// // // // // // // //                               label="Manage New Business"
// // // // // // // //                               path="/dashboard/new-business"
// // // // // // // //                               selected={selectedPage}
// // // // // // // //                               onClick={handleLinkClick}
// // // // // // // //                               searchTerm={searchTerm}
// // // // // // // //                             />
// // // // // // // //                           )}
// // // // // // // //                         {canView("transferUtility") &&
// // // // // // // //                           !isHidden("transferUtility") && (
// // // // // // // //                             <NavItem
// // // // // // // //                               label="Transfer Project Budget"
// // // // // // // //                               path="/dashboard/create-project-budget"
// // // // // // // //                               selected={selectedPage}
// // // // // // // //                               onClick={handleLinkClick}
// // // // // // // //                               searchTerm={searchTerm}
// // // // // // // //                             />
// // // // // // // //                           )}
// // // // // // // //                       </div>
// // // // // // // //                     )}
// // // // // // // //                   </div>
// // // // // // // //                 )}
// // // // // // // //               {/* )} */}
// // // // // // // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // // // // // // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // // // // // // //                   //  ||
// // // // // // // //                   // (!isHidden("accountMaster")) ||
// // // // // // // //                   // (!isHidden("orgMaster")) ||
// // // // // // // //                   // (!isHidden("employeeMaster"))
// // // // // // // //                   <div>
// // // // // // // //                     {!searchTerm && (
// // // // // // // //                       <div
// // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // // // // // // //                       >
// // // // // // // //                         <div className="flex items-center">
// // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // //                           </div>
// // // // // // // //                           <span
// // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // //                               }`}
// // // // // // // //                           >
// // // // // // // //                             Manage
// // // // // // // //                           </span>
// // // // // // // //                         </div>
// // // // // // // //                         {isExpanded &&
// // // // // // // //                           (manageSectionOpen ? (
// // // // // // // //                             <ChevronDown size={14} />
// // // // // // // //                           ) : (
// // // // // // // //                             <ChevronRight size={14} />
// // // // // // // //                           ))}
// // // // // // // //                       </div>
// // // // // // // //                     )}

// // // // // // // //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// // // // // // // //                           <NavItem
// // // // // // // //                             label="Manage Groups"
// // // // // // // //                             path="/dashboard/manage-groups"
// // // // // // // //                             selected={selectedPage}
// // // // // // // //                             onClick={handleLinkClick}
// // // // // // // //                             searchTerm={searchTerm}
// // // // // // // //                           />
// // // // // // // //                         )}
// // // // // // // //                         {canView("manageUser") && !isHidden("manageUser") && (
// // // // // // // //                           <NavItem
// // // // // // // //                             label="Manage Users"
// // // // // // // //                             path="/dashboard/manage-users"
// // // // // // // //                             selected={selectedPage}
// // // // // // // //                             onClick={handleLinkClick}
// // // // // // // //                             searchTerm={searchTerm}
// // // // // // // //                           />
// // // // // // // //                         )}
// // // // // // // //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Accounts"
// // // // // // // //                           path="/dashboard/account-master"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}
// // // // // // // //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Orgs"
// // // // // // // //                           path="/dashboard/org-master"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}
// // // // // // // //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Employees"
// // // // // // // //                           path="/dashboard/employee-master"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}
// // // // // // // //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage PLCs"
// // // // // // // //                           path="/dashboard/plc-master"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}
// // // // // // // //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Projects"
// // // // // // // //                           path="/dashboard/project-master"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}

// // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Revenue Formulas"
// // // // // // // //                           path="/dashboard/revenueFormula-master"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}
// // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Account Group Table"
// // // // // // // //                           path="/dashboard/accountgroup-mapping"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}
// // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Account Group Code"
// // // // // // // //                           path="/dashboard/accountgroupcode-master"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}
// // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Account Types"
// // // // // // // //                           path="/dashboard/accounttype-master"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}
// // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Company ID"
// // // // // // // //                           path="/dashboard/company-master"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}
// // // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Data"
// // // // // // // //                           path="/dashboard/manage-data-manager"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                         {/* )} */}

// // // // // // // //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// // // // // // // //                           <NavItem
// // // // // // // //                             label="Manage Company"
// // // // // // // //                             path="/dashboard/manage-company"
// // // // // // // //                             selected={selectedPage}
// // // // // // // //                             onClick={handleLinkClick}
// // // // // // // //                             searchTerm={searchTerm}
// // // // // // // //                           />
// // // // // // // //                         )}

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Reference"
// // // // // // // //                           path="/dashboard/manage-reference"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Employee"
// // // // // // // //                           path="/dashboard/manage-employee"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Employee Salary"
// // // // // // // //                           path="/dashboard/manage-employee-salary"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Account Mass Link"
// // // // // // // //                           path="/dashboard/account-mass-link"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Accounts Link"
// // // // // // // //                           path="/dashboard/accounts-link"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Project Roles"
// // // // // // // //                           path="/dashboard/manage-project-role"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Revenue"
// // // // // // // //                           path="/dashboard/manage-revenue"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Revenue Formulas"
// // // // // // // //                           path="/dashboard/manage-revenue-formulas"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Print Project Revenue & Billing Formulas"
// // // // // // // //                           path="/dashboard/print-revenue-billing-formulas"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Rate Sequence Orders"
// // // // // // // //                           path="/dashboard/manage-rate-sequence-orders"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Cost of Goods Sold"
// // // // // // // //                           path="/dashboard/manage-cogs"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Alternate Project Revenue Profiles"
// // // // // // // //                           path="/dashboard/manage-alternate-project-revenue-profiles"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />

// // // // // // // //                         <NavItem
// // // // // // // //                           label="Manage Alternate Revenue Profile Prior Year History"
// // // // // // // //                           path="/dashboard/manage-alternate-revenue-profile-prior-year-history"
// // // // // // // //                           selected={selectedPage}
// // // // // // // //                           onClick={handleLinkClick}
// // // // // // // //                           searchTerm={searchTerm}
// // // // // // // //                         />
// // // // // // // //                       </div>
// // // // // // // //                     )}
// // // // // // // //                   </div>
// // // // // // // //                 )}
// // // // // // // //               {/* --- CONFIGURATION SECTION --- */}
// // // // // // // //               {((canView("globalConfiguration") &&
// // // // // // // //                 !isHidden("globalConfiguration")) ||
// // // // // // // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // // // // // // //                 (canView("projectOrgSecurity") &&
// // // // // // // //                   !isHidden("projectOrgSecurity")) ||
// // // // // // // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // // // // // // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // // // // // // //                 (canView("ceilingConfiguration") &&
// // // // // // // //                   !isHidden("ceilingConfiguration")) ||
// // // // // // // //                 (canView("fiscalYearPeriods") &&
// // // // // // // //                   !isHidden("fiscalYearPeriods")) ||
// // // // // // // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // // // // // // //                 (canView("prospectiveIdSetup") &&
// // // // // // // //                   !isHidden("prospectiveIdSetup")) ||
// // // // // // // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // // // // // // //                   <div>
// // // // // // // //                     {!searchTerm && (
// // // // // // // //                       <div
// // // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // // // // // // //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// // // // // // // //                       >
// // // // // // // //                         <div className="flex items-center">
// // // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // // //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // // // // // // //                           </div>
// // // // // // // //                           <span
// // // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // //                               }`}
// // // // // // // //                           >
// // // // // // // //                             Settings
// // // // // // // //                           </span>
// // // // // // // //                         </div>
// // // // // // // //                         {isExpanded &&
// // // // // // // //                           (configurationOpen ? (
// // // // // // // //                             <ChevronDown size={14} />
// // // // // // // //                           ) : (
// // // // // // // //                             <ChevronRight size={14} />
// // // // // // // //                           ))}
// // // // // // // //                       </div>
// // // // // // // //                     )}

// // // // // // // //                     {(configurationOpen || searchTerm) && isExpanded && (
// // // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // //                         {canView("globalConfiguration") &&
// // // // // // // //                           !isHidden("globalConfiguration") && (
// // // // // // // //                             <NavItem
// // // // // // // //                               label="Configuration Setting"
// // // // // // // //                               path="/dashboard/global-configuration"
// // // // // // // //                               selected={selectedPage}
// // // // // // // //                               onClick={handleLinkClick}
// // // // // // // //                               searchTerm={searchTerm}
// // // // // // // //                             />
// // // // // // // //                           )}
// // // // // // // //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // // // // // // //                           <NavItem
// // // // // // // //                             label="Burden Setup"
// // // // // // // //                             path="/dashboard/pool-rate-tabs"
// // // // // // // //                             selected={selectedPage}
// // // // // // // //                             onClick={handleLinkClick}
// // // // // // // //                             searchTerm={searchTerm}
// // // // // // // //                           />
// // // // // // // //                         )}
// // // // // // // //                         {canView("projectOrgSecurity") &&
// // // // // // // //                           !isHidden("projectOrgSecurity") && (
// // // // // // // //                             <NavItem
// // // // // // // //                               label="Project Org Security"
// // // // // // // //                               path="/dashboard/projectmapping"
// // // // // // // //                               selected={selectedPage}
// // // // // // // //                               onClick={handleLinkClick}
// // // // // // // //                               searchTerm={searchTerm}
// // // // // // // //                             />
// // // // // // // //                           )}
// // // // // // // //                         {canView("accountMapping") &&
// // // // // // // //                           !isHidden("accountMapping") && (
// // // // // // // //                             <NavItem
// // // // // // // //                               label="Account Mapping"
// // // // // // // //                               path="/dashboard/account-mapping"
// // // // // // // //                               selected={selectedPage}
// // // // // // // //                               onClick={handleLinkClick}
// // // // // // // //                               searchTerm={searchTerm}
// // // // // // // //                             />
// // // // // // // //                           )}
// // // // // // // //                         {canView("analogRate") && !isHidden("analogRate") && (
// // // // // // // //                           <NavItem
// // // // // // // //                             label="NBIs Analogous Rate"
// // // // // // // //                             path="/dashboard/analog-rate"
// // // // // // // //                             selected={selectedPage}
// // // // // // // //                             onClick={handleLinkClick}
// // // // // // // //                             searchTerm={searchTerm}
// // // // // // // //                           />
// // // // // // // //                         )}
// // // // // // // //                         {canView("ceilingConfiguration") &&
// // // // // // // //                           !isHidden("ceilingConfiguration") && (
// // // // // // // //                             <NavItem
// // // // // // // //                               label="Ceiling Configuration"
// // // // // // // //                               path="/dashboard/ceiling-configuration"
// // // // // // // //                               selected={selectedPage}
// // // // // // // //                               onClick={handleLinkClick}
// // // // // // // //                               searchTerm={searchTerm}
// // // // // // // //                             />
// // // // // // // //                           )}
// // // // // // // //                         {canView("fiscalYearPeriods") &&
// // // // // // // //                           !isHidden("fiscalYearPeriods") && (
// // // // // // // //                             <NavItem
// // // // // // // //                               label="Fiscal Year Periods"
// // // // // // // //                               path="/dashboard/maintain-fiscal-year-periods"
// // // // // // // //                               selected={selectedPage}
// // // // // // // //                               onClick={handleLinkClick}
// // // // // // // //                               searchTerm={searchTerm}
// // // // // // // //                             />
// // // // // // // //                           )}
// // // // // // // //                         {canView("annualHolidays") &&
// // // // // // // //                           !isHidden("annualHolidays") && (
// // // // // // // //                             <NavItem
// // // // // // // //                               label="Annual Holidays"
// // // // // // // //                               path="/dashboard/annual-holidays"
// // // // // // // //                               selected={selectedPage}
// // // // // // // //                               onClick={handleLinkClick}
// // // // // // // //                               searchTerm={searchTerm}
// // // // // // // //                             />
// // // // // // // //                           )}
// // // // // // // //                         {canView("prospectiveIdSetup") &&
// // // // // // // //                           !isHidden("prospectiveIdSetup") && (
// // // // // // // //                             <NavItem
// // // // // // // //                               label="Prospective ID Setup"
// // // // // // // //                               path="/dashboard/prospective-id-setup"
// // // // // // // //                               selected={selectedPage}
// // // // // // // //                               onClick={handleLinkClick}
// // // // // // // //                               searchTerm={searchTerm}
// // // // // // // //                             />
// // // // // // // //                           )}
// // // // // // // //                         {canView("roleRights") && !isHidden("roleRights") && (
// // // // // // // //                           <NavItem
// // // // // // // //                             label="Rights Settings"
// // // // // // // //                             path="/dashboard/role-rights"
// // // // // // // //                             selected={selectedPage}
// // // // // // // //                             onClick={handleLinkClick}
// // // // // // // //                           />
// // // // // // // //                         )}
// // // // // // // //                         {/* <NavItem
// // // // // // // //                         label="Override Configuration"
// // // // // // // //                         path="/dashboard/override-settings"
// // // // // // // //                         selected={selectedPage}
// // // // // // // //                         onClick={handleLinkClick}
// // // // // // // //                       /> */}
// // // // // // // //                       </div>
// // // // // // // //                     )}
// // // // // // // //                   </div>
// // // // // // // //                 )}
// // // // // // // //               <div>
// // // // // // // //                 <div
// // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // // // // // // //                 >
// // // // // // // //                   <div className="flex items-center">
// // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // //                     </div>
// // // // // // // //                     <span
// // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // //                     >
// // // // // // // //                       System Security
// // // // // // // //                     </span>
// // // // // // // //                   </div>
// // // // // // // //                   {isExpanded &&
// // // // // // // //                     (securityMenuOpen ? (
// // // // // // // //                       <ChevronDown size={14} />
// // // // // // // //                     ) : (
// // // // // // // //                       <ChevronRight size={14} />
// // // // // // // //                     ))}
// // // // // // // //                 </div>

// // // // // // // //                 {securityMenuOpen && isExpanded && (
// // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // //                     <NavItem
// // // // // // // //                       label="Manage User Groups"
// // // // // // // //                       path="/dashboard/manage-user-groups"
// // // // // // // //                       selected={selectedPage}
// // // // // // // //                       onClick={handleLinkClick}
// // // // // // // //                     />
// // // // // // // //                     <NavItem
// // // // // // // //                       label="Manage User"
// // // // // // // //                       path="/dashboard/manage-users"
// // // // // // // //                       selected={selectedPage}
// // // // // // // //                       onClick={handleLinkClick}
// // // // // // // //                     />
// // // // // // // //                     <NavItem
// // // // // // // //                       label="Manage User Suppression"
// // // // // // // //                       path="/dashboard/user-suppression"
// // // // // // // //                       selected={selectedPage}
// // // // // // // //                       onClick={handleLinkClick}
// // // // // // // //                     />
// // // // // // // //                   </div>
// // // // // // // //                 )}
// // // // // // // //               </div>

// // // // // // // //               <div>
// // // // // // // //                 <div
// // // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // // // // // // //                 >
// // // // // // // //                   <div className="flex items-center">
// // // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // // //                     </div>
// // // // // // // //                     <span
// // // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // // //                     >
// // // // // // // //                       Organizational Security
// // // // // // // //                     </span>
// // // // // // // //                   </div>
// // // // // // // //                   {isExpanded &&
// // // // // // // //                     (securityOrgMenuOpen ? (
// // // // // // // //                       <ChevronDown size={14} />
// // // // // // // //                     ) : (
// // // // // // // //                       <ChevronRight size={14} />
// // // // // // // //                     ))}
// // // // // // // //                 </div>

// // // // // // // //                 {securityOrgMenuOpen && isExpanded && (
// // // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // // //                     <NavItem
// // // // // // // //                       label="Activate/Inactivate Organization Security by Module"
// // // // // // // //                       path="/dashboard/atc-ina-org-sec"
// // // // // // // //                       selected={selectedPage}
// // // // // // // //                       onClick={handleLinkClick}
// // // // // // // //                     />
// // // // // // // //                     <NavItem
// // // // // // // //                       label="Manage Organization Security Profiles"
// // // // // // // //                       path="/dashboard/prof-org-sec"
// // // // // // // //                       selected={selectedPage}
// // // // // // // //                       onClick={handleLinkClick}
// // // // // // // //                     />
// // // // // // // //                     <NavItem
// // // // // // // //                       label="Manage Organization Security Groups"
// // // // // // // //                       path="/dashboard/groups-org-sec"
// // // // // // // //                       selected={selectedPage}
// // // // // // // //                       onClick={handleLinkClick}
// // // // // // // //                     />
// // // // // // // //                     <NavItem
// // // // // // // //                       label="Update Organization Security Profiles"
// // // // // // // //                       path="/dashboard/prof-upd-org-sec"
// // // // // // // //                       selected={selectedPage}
// // // // // // // //                       onClick={handleLinkClick}
// // // // // // // //                     />
// // // // // // // //                   </div>
// // // // // // // //                 )}
// // // // // // // //               </div>
// // // // // // // //             </div>
// // // // // // // //           )}
// // // // // // // //         </div>

// // // // // // // //         {/* Footer Version */}
// // // // // // // //         <div
// // // // // // // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // // //             }`}
// // // // // // // //         >
// // // // // // // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // // // // // // //             v{appVersion}
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </div>

// // // // // // // //       {/* Background Overlay for mobile */}
// // // // // // // //       {/* {isExpanded  && (
// // // // // // // //         <div
// // // // // // // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // // // // // // //           onClick={handleCloseSidebar}
// // // // // // // //         ></div>
// // // // // // // //       )} */}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // // // // // // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // // // // // // //     return null;
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <Link
// // // // // // // //       to={path}
// // // // // // // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// // // // // // // //           ? "text-white font-semibold"
// // // // // // // //           : "text-gray-500 hover:text-gray-900"
// // // // // // // //         }`}
// // // // // // // //       style={{
// // // // // // // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // // // // // // //       }}
// // // // // // // //       onClick={(e) => {
// // // // // // // //         e.preventDefault();
// // // // // // // //         onClick(path);
// // // // // // // //       }}
// // // // // // // //     >
// // // // // // // //       {label}
// // // // // // // //     </Link>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default NavigationSidebar;

// // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // // // // import {
// // // // // // //   Menu,
// // // // // // //   X,
// // // // // // //   ChevronDown,
// // // // // // //   ChevronRight,
// // // // // // //   Plus,
// // // // // // //   Minus,
// // // // // // //   BarChart2,
// // // // // // //   Layers,
// // // // // // //   FileText,
// // // // // // //   Settings,
// // // // // // //   BriefcaseBusiness,
// // // // // // //   SlidersHorizontal,
// // // // // // //   Users, // new icon for New Business Budget section
// // // // // // // } from "lucide-react";

// // // // // // // const NavigationSidebar = ({
// // // // // // //   setIsHovered,
// // // // // // //   isHovered,
// // // // // // //   setIsSidebarOpen,
// // // // // // //   isSidebarOpen,
// // // // // // //   canView,
// // // // // // // }) => {
// // // // // // //   const { pathname } = useLocation();
// // // // // // //   const navigate = useNavigate();

// // // // // // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // // // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // // // //   const HIDDEN_FEATURES =
// // // // // // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // // // // // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // // // // // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // // // // // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // //     pathname.includes("/dashboard/import-opportunity") ||
// // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // //     pathname.includes("/dashboard/financial-report") ||
// // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // //     pathname.includes("/service-unavailable") ||
// // // // // // //     pathname.includes("/dashboard/manage-data-manager") ||
// // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // // // // // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// // // // // // //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history")

// // // // // // //   );

// // // // // // //   const [planningOpen, setPlanningOpen] = useState(
// // // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // // //     // pathname.includes("/dashboard/new-business") ||
// // // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // // //     pathname.includes("/dashboard/financial-report"),
// // // // // // //   );

// // // // // // //   const [configurationOpen, setConfigurationOpen] = useState(
// // // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // // //     pathname.includes("/dashboard/template") ||
// // // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // //   );

// // // // // // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // // //     pathname.includes("/dashboard/template-pool-mapping"),
// // // // // // //   );

// // // // // // //   // NEW: New Business Budget section open state
// // // // // // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // // //     pathname.includes("/dashboard/import-opportunity"),
// // // // // // //   );

// // // // // // //   // NEW: Manage (Users & Groups) section open state
// // // // // // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // // //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // // //     pathname.includes("/dashboard/account-mass-link") ||
// // // // // // //     pathname.includes("/dashboard/accounts-link") ||
// // // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles")
// // // // // // //   );

// // // // // // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // // //     pathname.includes("/dashboard/display-settings"),
// // // // // // //   );

// // // // // // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // // //     pathname.includes("/dashboard/user-suppression"),
// // // // // // //   );

// // // // // // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // // //   );

// // // // // // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // // // // // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // // // // // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // // // // // //   const [userName, setUserName] = useState("");

// // // // // // //   // hover state (existing)
// // // // // // //   // const [isHovered, setIsHovered] = useState(false);

// // // // // // //   useEffect(() => {
// // // // // // //     const userString = localStorage.getItem("currentUser");
// // // // // // //     if (userString) {
// // // // // // //       try {
// // // // // // //         const userObj = JSON.parse(userString);
// // // // // // //         setUserName(userObj.name);
// // // // // // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // // // // // //       } catch {
// // // // // // //         setCurrentUserRole(null);
// // // // // // //       }
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // // // // // //   const handleLinkClick = (pagePath) => {
// // // // // // //     setSelectedPage(pagePath);
// // // // // // //     navigate(pagePath);
// // // // // // //     if (isSidebarOpen) {
// // // // // // //       setIsSidebarOpen(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleCloseSidebar = () => {
// // // // // // //     setSearchTerm("");
// // // // // // //     setIsSidebarOpen(false);
// // // // // // //   };
// // // // // // //   const handleOpenSidebar = () => {
// // // // // // //     setIsSidebarOpen(true);
// // // // // // //   };
// // // // // // //   const isExpanded = isSidebarOpen || isHovered;

// // // // // // //   return (
// // // // // // //     <div
// // // // // // //       // onMouseOver={handleOpenSidebar}
// // // // // // //       // onMouseLeave={handleCloseSidebar}
// // // // // // //       className="flex min-h-screen font-inter bg-white"
// // // // // // //     >
// // // // // // //       {/* Mobile Toggle */}
// // // // // // //       <button
// // // // // // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // // // // // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // // // // // //       >
// // // // // // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // // // // // //       </button>

// // // // // // //       {/* Sidebar - Hover to expand */}
// // // // // // //       <div
// // // // // // //         onMouseEnter={() => setIsHovered(true)}
// // // // // // //         onMouseLeave={() => setIsHovered(false)}
// // // // // // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // // // // // //       bg-white border-r border-gray-200
// // // // // // //       transition-all duration-300 ease-in-out shadow-sm
// // // // // // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // // // // // //       md:translate-x-0

// // // // // // //     `}
// // // // // // //       >
// // // // // // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // // // // // //           {/* Menu / General Toggle Section */}
// // // // // // //           <div
// // // // // // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // // // // // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // // // // // //           >
// // // // // // //             <div className="w-8 flex justify-center">
// // // // // // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // // // // // //             </div>
// // // // // // //             <span
// // // // // // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // //                 }`}
// // // // // // //             >
// // // // // // //               Menu
// // // // // // //             </span>
// // // // // // //           </div>

// // // // // // //           {generalMenuOpen && (
// // // // // // //             <div className="space-y-1 mt-2">
// // // // // // //               {/* --- PLANNING SECTION --- */}
// // // // // // //               <div>
// // // // // // //                 <div
// // // // // // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // // // // // //                 >
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     placeholder="Search..."
// // // // // // //                     value={searchTerm}
// // // // // // //                     onChange={(e) =>
// // // // // // //                       setSearchTerm(e.target.value.toLowerCase())
// // // // // // //                     }
// // // // // // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //                 {!searchTerm && (
// // // // // // //                   <div
// // // // // // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // // // // // //                   >
// // // // // // //                     <div className="flex items-center">
// // // // // // //                       <div className="w-8 flex justify-center">
// // // // // // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // //                       </div>
// // // // // // //                       <span
// // // // // // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // //                           }`}
// // // // // // //                       >
// // // // // // //                         Planning
// // // // // // //                       </span>
// // // // // // //                     </div>
// // // // // // //                     {isExpanded &&
// // // // // // //                       (planningOpen ? (
// // // // // // //                         <ChevronDown size={14} />
// // // // // // //                       ) : (
// // // // // // //                         <ChevronRight size={14} />
// // // // // // //                       ))}
// // // // // // //                   </div>
// // // // // // //                 )}

// // // // // // //                 {(planningOpen || searchTerm) && isExpanded && (
// // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // //                     <NavItem
// // // // // // //                       label="Project Planning"
// // // // // // //                       path="/dashboard/project-budget-status"
// // // // // // //                       selected={selectedPage}
// // // // // // //                       onClick={handleLinkClick}
// // // // // // //                       searchTerm={searchTerm}
// // // // // // //                     />
// // // // // // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // // // // // //                       <>
// // // // // // //                         <NavItem
// // // // // // //                           label="Reporting"
// // // // // // //                           path="/dashboard/project-report"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                       </>
// // // // // // //                     )}

// // // // // // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // // // // // //                       <NavItem
// // // // // // //                         label="Mass Utility"
// // // // // // //                         path="/dashboard/mass-utility"
// // // // // // //                         selected={selectedPage}
// // // // // // //                         onClick={handleLinkClick}
// // // // // // //                         searchTerm={searchTerm}
// // // // // // //                       />
// // // // // // //                     )}
// // // // // // //                     {canView("pricing") && !isHidden("pricing") && (
// // // // // // //                       <NavItem
// // // // // // //                         label="Pricing"
// // // // // // //                         path="/dashboard/pricing"
// // // // // // //                         selected={selectedPage}
// // // // // // //                         onClick={handleLinkClick}
// // // // // // //                         searchTerm={searchTerm}
// // // // // // //                       />
// // // // // // //                     )}

// // // // // // //                     {canView("financialReport") &&
// // // // // // //                       !isHidden("financialReport") && (
// // // // // // //                         <NavItem
// // // // // // //                           label="Financial Report"
// // // // // // //                           path="/dashboard/financial-report"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                       )}
// // // // // // //                   </div>
// // // // // // //                 )}
// // // // // // //               </div>
// // // // // // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // // // // // //               {/* {currentUserRole === "admin" && ( */}
// // // // // // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // // // // // //                 (canView("transferUtility") &&
// // // // // // //                   !isHidden("manageNewBusiness")) ||
// // // // // // //                 (canView("impOpportunity") &&
// // // // // // //                   !isHidden("transferUtility"))) && (
// // // // // // //                   <div>
// // // // // // //                     {!searchTerm && (
// // // // // // //                       <div
// // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // //                         onClick={() =>
// // // // // // //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // // // // // //                         }
// // // // // // //                       >
// // // // // // //                         <div className="flex items-center">
// // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // //                           </div>
// // // // // // //                           <span
// // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // //                               }`}
// // // // // // //                           >
// // // // // // //                             New Business Budget
// // // // // // //                           </span>
// // // // // // //                         </div>
// // // // // // //                         {isExpanded &&
// // // // // // //                           (newBusinessSectionOpen ? (
// // // // // // //                             <ChevronDown size={14} />
// // // // // // //                           ) : (
// // // // // // //                             <ChevronRight size={14} />
// // // // // // //                           ))}
// // // // // // //                       </div>
// // // // // // //                     )}

// // // // // // //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // //                         {canView("impOpportunity") &&
// // // // // // //                           !isHidden("impOpportunity") && (
// // // // // // //                             <>
// // // // // // //                               <NavItem
// // // // // // //                                 label="Import Opportunity"
// // // // // // //                                 path="/dashboard/import-opportunity"
// // // // // // //                                 selected={selectedPage}
// // // // // // //                                 onClick={handleLinkClick}
// // // // // // //                                 searchTerm={searchTerm}
// // // // // // //                               />
// // // // // // //                             </>
// // // // // // //                           )}
// // // // // // //                         {canView("manageNewBusiness") &&
// // // // // // //                           !isHidden("manageNewBusiness") && (
// // // // // // //                             <NavItem
// // // // // // //                               label="Manage New Business"
// // // // // // //                               path="/dashboard/new-business"
// // // // // // //                               selected={selectedPage}
// // // // // // //                               onClick={handleLinkClick}
// // // // // // //                               searchTerm={searchTerm}
// // // // // // //                             />
// // // // // // //                           )}
// // // // // // //                         {canView("transferUtility") &&
// // // // // // //                           !isHidden("transferUtility") && (
// // // // // // //                             <NavItem
// // // // // // //                               label="Transfer Project Budget"
// // // // // // //                               path="/dashboard/create-project-budget"
// // // // // // //                               selected={selectedPage}
// // // // // // //                               onClick={handleLinkClick}
// // // // // // //                               searchTerm={searchTerm}
// // // // // // //                             />
// // // // // // //                           )}
// // // // // // //                       </div>
// // // // // // //                     )}
// // // // // // //                   </div>
// // // // // // //                 )}
// // // // // // //               {/* )} */}
// // // // // // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // // // // // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // // // // // //                   //  ||
// // // // // // //                   // (!isHidden("accountMaster")) ||
// // // // // // //                   // (!isHidden("orgMaster")) ||
// // // // // // //                   // (!isHidden("employeeMaster"))
// // // // // // //                   <div>
// // // // // // //                     {!searchTerm && (
// // // // // // //                       <div
// // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // // // // // //                       >
// // // // // // //                         <div className="flex items-center">
// // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // //                           </div>
// // // // // // //                           <span
// // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // //                               }`}
// // // // // // //                           >
// // // // // // //                             Manage
// // // // // // //                           </span>
// // // // // // //                         </div>
// // // // // // //                         {isExpanded &&
// // // // // // //                           (manageSectionOpen ? (
// // // // // // //                             <ChevronDown size={14} />
// // // // // // //                           ) : (
// // // // // // //                             <ChevronRight size={14} />
// // // // // // //                           ))}
// // // // // // //                       </div>
// // // // // // //                     )}

// // // // // // //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// // // // // // //                           <NavItem
// // // // // // //                             label="Manage Groups"
// // // // // // //                             path="/dashboard/manage-groups"
// // // // // // //                             selected={selectedPage}
// // // // // // //                             onClick={handleLinkClick}
// // // // // // //                             searchTerm={searchTerm}
// // // // // // //                           />
// // // // // // //                         )}
// // // // // // //                         {canView("manageUser") && !isHidden("manageUser") && (
// // // // // // //                           <NavItem
// // // // // // //                             label="Manage Users"
// // // // // // //                             path="/dashboard/manage-users"
// // // // // // //                             selected={selectedPage}
// // // // // // //                             onClick={handleLinkClick}
// // // // // // //                             searchTerm={searchTerm}
// // // // // // //                           />
// // // // // // //                         )}
// // // // // // //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Accounts"
// // // // // // //                           path="/dashboard/account-master"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}
// // // // // // //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Orgs"
// // // // // // //                           path="/dashboard/org-master"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}
// // // // // // //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Employees"
// // // // // // //                           path="/dashboard/employee-master"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}
// // // // // // //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage PLCs"
// // // // // // //                           path="/dashboard/plc-master"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}
// // // // // // //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Projects"
// // // // // // //                           path="/dashboard/project-master"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}

// // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Revenue Formulas"
// // // // // // //                           path="/dashboard/revenueFormula-master"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}
// // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Account Group Table"
// // // // // // //                           path="/dashboard/accountgroup-mapping"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}
// // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Account Group Code"
// // // // // // //                           path="/dashboard/accountgroupcode-master"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}
// // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Account Types"
// // // // // // //                           path="/dashboard/accounttype-master"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}
// // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Company ID"
// // // // // // //                           path="/dashboard/company-master"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}
// // // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Data"
// // // // // // //                           path="/dashboard/manage-data-manager"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                         {/* )} */}

// // // // // // //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// // // // // // //                           <NavItem
// // // // // // //                             label="Manage Company"
// // // // // // //                             path="/dashboard/manage-company"
// // // // // // //                             selected={selectedPage}
// // // // // // //                             onClick={handleLinkClick}
// // // // // // //                             searchTerm={searchTerm}
// // // // // // //                           />
// // // // // // //                         )}

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Reference"
// // // // // // //                           path="/dashboard/manage-reference"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Employee"
// // // // // // //                           path="/dashboard/manage-employee"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Employee Salary"
// // // // // // //                           path="/dashboard/manage-employee-salary"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Account Mass Link"
// // // // // // //                           path="/dashboard/account-mass-link"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Accounts Link"
// // // // // // //                           path="/dashboard/accounts-link"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Project Roles"
// // // // // // //                           path="/dashboard/manage-project-role"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Revenue"
// // // // // // //                           path="/dashboard/manage-revenue"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Revenue Formulas"
// // // // // // //                           path="/dashboard/manage-revenue-formulas"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Print Project Revenue & Billing Formulas"
// // // // // // //                           path="/dashboard/print-revenue-billing-formulas"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Rate Sequence Orders"
// // // // // // //                           path="/dashboard/manage-rate-sequence-orders"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Cost of Goods Sold"
// // // // // // //                           path="/dashboard/manage-cogs"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Alternate Project Revenue Profiles"
// // // // // // //                           path="/dashboard/manage-alternate-project-revenue-profiles"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Alternate Revenue Profile Prior Year History"
// // // // // // //                           path="/dashboard/manage-alternate-revenue-profile-prior-year-history"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />

// // // // // // //                         <NavItem
// // // // // // //                           label="Manage Project Revenue Calculation Value History"
// // // // // // //                           path="/dashboard/manage-project-revenue-calculation-value-history"
// // // // // // //                           selected={selectedPage}
// // // // // // //                           onClick={handleLinkClick}
// // // // // // //                           searchTerm={searchTerm}
// // // // // // //                         />
// // // // // // //                       </div>
// // // // // // //                     )}
// // // // // // //                   </div>
// // // // // // //                 )}
// // // // // // //               {/* --- CONFIGURATION SECTION --- */}
// // // // // // //               {((canView("globalConfiguration") &&
// // // // // // //                 !isHidden("globalConfiguration")) ||
// // // // // // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // // // // // //                 (canView("projectOrgSecurity") &&
// // // // // // //                   !isHidden("projectOrgSecurity")) ||
// // // // // // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // // // // // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // // // // // //                 (canView("ceilingConfiguration") &&
// // // // // // //                   !isHidden("ceilingConfiguration")) ||
// // // // // // //                 (canView("fiscalYearPeriods") &&
// // // // // // //                   !isHidden("fiscalYearPeriods")) ||
// // // // // // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // // // // // //                 (canView("prospectiveIdSetup") &&
// // // // // // //                   !isHidden("prospectiveIdSetup")) ||
// // // // // // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // // // // // //                   <div>
// // // // // // //                     {!searchTerm && (
// // // // // // //                       <div
// // // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // // // // // //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// // // // // // //                       >
// // // // // // //                         <div className="flex items-center">
// // // // // // //                           <div className="w-8 flex justify-center">
// // // // // // //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // // // // // //                           </div>
// // // // // // //                           <span
// // // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // //                               }`}
// // // // // // //                           >
// // // // // // //                             Settings
// // // // // // //                           </span>
// // // // // // //                         </div>
// // // // // // //                         {isExpanded &&
// // // // // // //                           (configurationOpen ? (
// // // // // // //                             <ChevronDown size={14} />
// // // // // // //                           ) : (
// // // // // // //                             <ChevronRight size={14} />
// // // // // // //                           ))}
// // // // // // //                       </div>
// // // // // // //                     )}

// // // // // // //                     {(configurationOpen || searchTerm) && isExpanded && (
// // // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // //                         {canView("globalConfiguration") &&
// // // // // // //                           !isHidden("globalConfiguration") && (
// // // // // // //                             <NavItem
// // // // // // //                               label="Configuration Setting"
// // // // // // //                               path="/dashboard/global-configuration"
// // // // // // //                               selected={selectedPage}
// // // // // // //                               onClick={handleLinkClick}
// // // // // // //                               searchTerm={searchTerm}
// // // // // // //                             />
// // // // // // //                           )}
// // // // // // //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // // // // // //                           <NavItem
// // // // // // //                             label="Burden Setup"
// // // // // // //                             path="/dashboard/pool-rate-tabs"
// // // // // // //                             selected={selectedPage}
// // // // // // //                             onClick={handleLinkClick}
// // // // // // //                             searchTerm={searchTerm}
// // // // // // //                           />
// // // // // // //                         )}
// // // // // // //                         {canView("projectOrgSecurity") &&
// // // // // // //                           !isHidden("projectOrgSecurity") && (
// // // // // // //                             <NavItem
// // // // // // //                               label="Project Org Security"
// // // // // // //                               path="/dashboard/projectmapping"
// // // // // // //                               selected={selectedPage}
// // // // // // //                               onClick={handleLinkClick}
// // // // // // //                               searchTerm={searchTerm}
// // // // // // //                             />
// // // // // // //                           )}
// // // // // // //                         {canView("accountMapping") &&
// // // // // // //                           !isHidden("accountMapping") && (
// // // // // // //                             <NavItem
// // // // // // //                               label="Account Mapping"
// // // // // // //                               path="/dashboard/account-mapping"
// // // // // // //                               selected={selectedPage}
// // // // // // //                               onClick={handleLinkClick}
// // // // // // //                               searchTerm={searchTerm}
// // // // // // //                             />
// // // // // // //                           )}
// // // // // // //                         {canView("analogRate") && !isHidden("analogRate") && (
// // // // // // //                           <NavItem
// // // // // // //                             label="NBIs Analogous Rate"
// // // // // // //                             path="/dashboard/analog-rate"
// // // // // // //                             selected={selectedPage}
// // // // // // //                             onClick={handleLinkClick}
// // // // // // //                             searchTerm={searchTerm}
// // // // // // //                           />
// // // // // // //                         )}
// // // // // // //                         {canView("ceilingConfiguration") &&
// // // // // // //                           !isHidden("ceilingConfiguration") && (
// // // // // // //                             <NavItem
// // // // // // //                               label="Ceiling Configuration"
// // // // // // //                               path="/dashboard/ceiling-configuration"
// // // // // // //                               selected={selectedPage}
// // // // // // //                               onClick={handleLinkClick}
// // // // // // //                               searchTerm={searchTerm}
// // // // // // //                             />
// // // // // // //                           )}
// // // // // // //                         {canView("fiscalYearPeriods") &&
// // // // // // //                           !isHidden("fiscalYearPeriods") && (
// // // // // // //                             <NavItem
// // // // // // //                               label="Fiscal Year Periods"
// // // // // // //                               path="/dashboard/maintain-fiscal-year-periods"
// // // // // // //                               selected={selectedPage}
// // // // // // //                               onClick={handleLinkClick}
// // // // // // //                               searchTerm={searchTerm}
// // // // // // //                             />
// // // // // // //                           )}
// // // // // // //                         {canView("annualHolidays") &&
// // // // // // //                           !isHidden("annualHolidays") && (
// // // // // // //                             <NavItem
// // // // // // //                               label="Annual Holidays"
// // // // // // //                               path="/dashboard/annual-holidays"
// // // // // // //                               selected={selectedPage}
// // // // // // //                               onClick={handleLinkClick}
// // // // // // //                               searchTerm={searchTerm}
// // // // // // //                             />
// // // // // // //                           )}
// // // // // // //                         {canView("prospectiveIdSetup") &&
// // // // // // //                           !isHidden("prospectiveIdSetup") && (
// // // // // // //                             <NavItem
// // // // // // //                               label="Prospective ID Setup"
// // // // // // //                               path="/dashboard/prospective-id-setup"
// // // // // // //                               selected={selectedPage}
// // // // // // //                               onClick={handleLinkClick}
// // // // // // //                               searchTerm={searchTerm}
// // // // // // //                             />
// // // // // // //                           )}
// // // // // // //                         {canView("roleRights") && !isHidden("roleRights") && (
// // // // // // //                           <NavItem
// // // // // // //                             label="Rights Settings"
// // // // // // //                             path="/dashboard/role-rights"
// // // // // // //                             selected={selectedPage}
// // // // // // //                             onClick={handleLinkClick}
// // // // // // //                           />
// // // // // // //                         )}
// // // // // // //                         {/* <NavItem
// // // // // // //                         label="Override Configuration"
// // // // // // //                         path="/dashboard/override-settings"
// // // // // // //                         selected={selectedPage}
// // // // // // //                         onClick={handleLinkClick}
// // // // // // //                       /> */}
// // // // // // //                       </div>
// // // // // // //                     )}
// // // // // // //                   </div>
// // // // // // //                 )}
// // // // // // //               <div>
// // // // // // //                 <div
// // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // // // // // //                 >
// // // // // // //                   <div className="flex items-center">
// // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // //                     </div>
// // // // // // //                     <span
// // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // //                     >
// // // // // // //                       System Security
// // // // // // //                     </span>
// // // // // // //                   </div>
// // // // // // //                   {isExpanded &&
// // // // // // //                     (securityMenuOpen ? (
// // // // // // //                       <ChevronDown size={14} />
// // // // // // //                     ) : (
// // // // // // //                       <ChevronRight size={14} />
// // // // // // //                     ))}
// // // // // // //                 </div>

// // // // // // //                 {securityMenuOpen && isExpanded && (
// // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // //                     <NavItem
// // // // // // //                       label="Manage User Groups"
// // // // // // //                       path="/dashboard/manage-user-groups"
// // // // // // //                       selected={selectedPage}
// // // // // // //                       onClick={handleLinkClick}
// // // // // // //                     />
// // // // // // //                     <NavItem
// // // // // // //                       label="Manage User"
// // // // // // //                       path="/dashboard/manage-users"
// // // // // // //                       selected={selectedPage}
// // // // // // //                       onClick={handleLinkClick}
// // // // // // //                     />
// // // // // // //                     <NavItem
// // // // // // //                       label="Manage User Suppression"
// // // // // // //                       path="/dashboard/user-suppression"
// // // // // // //                       selected={selectedPage}
// // // // // // //                       onClick={handleLinkClick}
// // // // // // //                     />
// // // // // // //                   </div>
// // // // // // //                 )}
// // // // // // //               </div>

// // // // // // //               <div>
// // // // // // //                 <div
// // // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // // // // // //                 >
// // // // // // //                   <div className="flex items-center">
// // // // // // //                     <div className="w-8 flex justify-center">
// // // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // // //                     </div>
// // // // // // //                     <span
// // // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // // //                     >
// // // // // // //                       Organizational Security
// // // // // // //                     </span>
// // // // // // //                   </div>
// // // // // // //                   {isExpanded &&
// // // // // // //                     (securityOrgMenuOpen ? (
// // // // // // //                       <ChevronDown size={14} />
// // // // // // //                     ) : (
// // // // // // //                       <ChevronRight size={14} />
// // // // // // //                     ))}
// // // // // // //                 </div>

// // // // // // //                 {securityOrgMenuOpen && isExpanded && (
// // // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // // //                     <NavItem
// // // // // // //                       label="Activate/Inactivate Organization Security by Module"
// // // // // // //                       path="/dashboard/atc-ina-org-sec"
// // // // // // //                       selected={selectedPage}
// // // // // // //                       onClick={handleLinkClick}
// // // // // // //                     />
// // // // // // //                     <NavItem
// // // // // // //                       label="Manage Organization Security Profiles"
// // // // // // //                       path="/dashboard/prof-org-sec"
// // // // // // //                       selected={selectedPage}
// // // // // // //                       onClick={handleLinkClick}
// // // // // // //                     />
// // // // // // //                     <NavItem
// // // // // // //                       label="Manage Organization Security Groups"
// // // // // // //                       path="/dashboard/groups-org-sec"
// // // // // // //                       selected={selectedPage}
// // // // // // //                       onClick={handleLinkClick}
// // // // // // //                     />
// // // // // // //                     <NavItem
// // // // // // //                       label="Update Organization Security Profiles"
// // // // // // //                       path="/dashboard/prof-upd-org-sec"
// // // // // // //                       selected={selectedPage}
// // // // // // //                       onClick={handleLinkClick}
// // // // // // //                     />
// // // // // // //                   </div>
// // // // // // //                 )}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </div>

// // // // // // //         {/* Footer Version */}
// // // // // // //         <div
// // // // // // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // // //             }`}
// // // // // // //         >
// // // // // // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // // // // // //             v{appVersion}
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Background Overlay for mobile */}
// // // // // // //       {/* {isExpanded  && (
// // // // // // //         <div
// // // // // // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // // // // // //           onClick={handleCloseSidebar}
// // // // // // //         ></div>
// // // // // // //       )} */}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // // // // // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // // // // // //     return null;
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <Link
// // // // // // //       to={path}
// // // // // // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// // // // // // //           ? "text-white font-semibold"
// // // // // // //           : "text-gray-500 hover:text-gray-900"
// // // // // // //         }`}
// // // // // // //       style={{
// // // // // // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // // // // // //       }}
// // // // // // //       onClick={(e) => {
// // // // // // //         e.preventDefault();
// // // // // // //         onClick(path);
// // // // // // //       }}
// // // // // // //     >
// // // // // // //       {label}
// // // // // // //     </Link>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default NavigationSidebar;

// // // // // // import React, { useState, useEffect } from "react";
// // // // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // // // import {
// // // // // //   Menu,
// // // // // //   X,
// // // // // //   ChevronDown,
// // // // // //   ChevronRight,
// // // // // //   Plus,
// // // // // //   Minus,
// // // // // //   BarChart2,
// // // // // //   Layers,
// // // // // //   FileText,
// // // // // //   Settings,
// // // // // //   BriefcaseBusiness,
// // // // // //   SlidersHorizontal,
// // // // // //   Users, // new icon for New Business Budget section
// // // // // // } from "lucide-react";

// // // // // // const NavigationSidebar = ({
// // // // // //   setIsHovered,
// // // // // //   isHovered,
// // // // // //   setIsSidebarOpen,
// // // // // //   isSidebarOpen,
// // // // // //   canView,
// // // // // // }) => {
// // // // // //   const { pathname } = useLocation();
// // // // // //   const navigate = useNavigate();

// // // // // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // // //   const HIDDEN_FEATURES =
// // // // // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // // // // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // // // // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // // // // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // //     pathname.includes("/dashboard/template") ||
// // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // //     pathname.includes("/dashboard/import-opportunity") ||
// // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // //     pathname.includes("/dashboard/financial-report") ||
// // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // //     pathname.includes("/service-unavailable") ||
// // // // // //     pathname.includes("/dashboard/manage-data-manager") ||
// // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // // // // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// // // // // //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// // // // // //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures")

// // // // // //   );

// // // // // //   const [planningOpen, setPlanningOpen] = useState(
// // // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // // //     // pathname.includes("/dashboard/new-business") ||
// // // // // //     pathname.includes("/dashboard/project-report") ||
// // // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // // //     pathname.includes("/dashboard/pricing") ||
// // // // // //     pathname.includes("/dashboard/financial-report"),
// // // // // //   );

// // // // // //   const [configurationOpen, setConfigurationOpen] = useState(
// // // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // // //     pathname.includes("/dashboard/template") ||
// // // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // //   );

// // // // // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // // //     pathname.includes("/dashboard/template-pool-mapping"),
// // // // // //   );

// // // // // //   // NEW: New Business Budget section open state
// // // // // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // // // // //     pathname.includes("/dashboard/new-business") ||
// // // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // // //     pathname.includes("/dashboard/import-opportunity"),
// // // // // //   );

// // // // // //   // NEW: Manage (Users & Groups) section open state
// // // // // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // // //     pathname.includes("/dashboard/account-master") ||
// // // // // //     pathname.includes("/dashboard/org-master") ||
// // // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // // //     pathname.includes("/dashboard/project-master") ||
// // // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // // //     pathname.includes("/dashboard/company-master") ||
// // // // // //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // // //     pathname.includes("/dashboard/account-mass-link") ||
// // // // // //     pathname.includes("/dashboard/accounts-link") ||
// // // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // // // // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// // // // // //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// // // // // //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures")
// // // // // //   );

// // // // // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // // //     pathname.includes("/dashboard/display-settings"),
// // // // // //   );

// // // // // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // // //     pathname.includes("/dashboard/user-suppression"),
// // // // // //   );

// // // // // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // // //   );

// // // // // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // // // // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // // // // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // // // // //   const [userName, setUserName] = useState("");

// // // // // //   // hover state (existing)
// // // // // //   // const [isHovered, setIsHovered] = useState(false);

// // // // // //   useEffect(() => {
// // // // // //     const userString = localStorage.getItem("currentUser");
// // // // // //     if (userString) {
// // // // // //       try {
// // // // // //         const userObj = JSON.parse(userString);
// // // // // //         setUserName(userObj.name);
// // // // // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // // // // //       } catch {
// // // // // //         setCurrentUserRole(null);
// // // // // //       }
// // // // // //     }
// // // // // //   }, []);

// // // // // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // // // // //   const handleLinkClick = (pagePath) => {
// // // // // //     setSelectedPage(pagePath);
// // // // // //     navigate(pagePath);
// // // // // //     if (isSidebarOpen) {
// // // // // //       setIsSidebarOpen(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleCloseSidebar = () => {
// // // // // //     setSearchTerm("");
// // // // // //     setIsSidebarOpen(false);
// // // // // //   };
// // // // // //   const handleOpenSidebar = () => {
// // // // // //     setIsSidebarOpen(true);
// // // // // //   };
// // // // // //   const isExpanded = isSidebarOpen || isHovered;

// // // // // //   return (
// // // // // //     <div
// // // // // //       // onMouseOver={handleOpenSidebar}
// // // // // //       // onMouseLeave={handleCloseSidebar}
// // // // // //       className="flex min-h-screen font-inter bg-white"
// // // // // //     >
// // // // // //       {/* Mobile Toggle */}
// // // // // //       <button
// // // // // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // // // // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // // // // //       >
// // // // // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // // // // //       </button>

// // // // // //       {/* Sidebar - Hover to expand */}
// // // // // //       <div
// // // // // //         onMouseEnter={() => setIsHovered(true)}
// // // // // //         onMouseLeave={() => setIsHovered(false)}
// // // // // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // // // // //       bg-white border-r border-gray-200
// // // // // //       transition-all duration-300 ease-in-out shadow-sm
// // // // // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // // // // //       md:translate-x-0

// // // // // //     `}
// // // // // //       >
// // // // // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // // // // //           {/* Menu / General Toggle Section */}
// // // // // //           <div
// // // // // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // // // // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // // // // //           >
// // // // // //             <div className="w-8 flex justify-center">
// // // // // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // // // // //             </div>
// // // // // //             <span
// // // // // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // //                 }`}
// // // // // //             >
// // // // // //               Menu
// // // // // //             </span>
// // // // // //           </div>

// // // // // //           {generalMenuOpen && (
// // // // // //             <div className="space-y-1 mt-2">
// // // // // //               {/* --- PLANNING SECTION --- */}
// // // // // //               <div>
// // // // // //                 <div
// // // // // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // // // // //                 >
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     placeholder="Search..."
// // // // // //                     value={searchTerm}
// // // // // //                     onChange={(e) =>
// // // // // //                       setSearchTerm(e.target.value.toLowerCase())
// // // // // //                     }
// // // // // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // // // // //                   />
// // // // // //                 </div>
// // // // // //                 {!searchTerm && (
// // // // // //                   <div
// // // // // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // // // // //                   >
// // // // // //                     <div className="flex items-center">
// // // // // //                       <div className="w-8 flex justify-center">
// // // // // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // //                       </div>
// // // // // //                       <span
// // // // // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // //                           }`}
// // // // // //                       >
// // // // // //                         Planning
// // // // // //                       </span>
// // // // // //                     </div>
// // // // // //                     {isExpanded &&
// // // // // //                       (planningOpen ? (
// // // // // //                         <ChevronDown size={14} />
// // // // // //                       ) : (
// // // // // //                         <ChevronRight size={14} />
// // // // // //                       ))}
// // // // // //                   </div>
// // // // // //                 )}

// // // // // //                 {(planningOpen || searchTerm) && isExpanded && (
// // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // //                     <NavItem
// // // // // //                       label="Project Planning"
// // // // // //                       path="/dashboard/project-budget-status"
// // // // // //                       selected={selectedPage}
// // // // // //                       onClick={handleLinkClick}
// // // // // //                       searchTerm={searchTerm}
// // // // // //                     />
// // // // // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // // // // //                       <>
// // // // // //                         <NavItem
// // // // // //                           label="Reporting"
// // // // // //                           path="/dashboard/project-report"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                       </>
// // // // // //                     )}

// // // // // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // // // // //                       <NavItem
// // // // // //                         label="Mass Utility"
// // // // // //                         path="/dashboard/mass-utility"
// // // // // //                         selected={selectedPage}
// // // // // //                         onClick={handleLinkClick}
// // // // // //                         searchTerm={searchTerm}
// // // // // //                       />
// // // // // //                     )}
// // // // // //                     {canView("pricing") && !isHidden("pricing") && (
// // // // // //                       <NavItem
// // // // // //                         label="Pricing"
// // // // // //                         path="/dashboard/pricing"
// // // // // //                         selected={selectedPage}
// // // // // //                         onClick={handleLinkClick}
// // // // // //                         searchTerm={searchTerm}
// // // // // //                       />
// // // // // //                     )}

// // // // // //                     {canView("financialReport") &&
// // // // // //                       !isHidden("financialReport") && (
// // // // // //                         <NavItem
// // // // // //                           label="Financial Report"
// // // // // //                           path="/dashboard/financial-report"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                       )}
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // // // // //               {/* {currentUserRole === "admin" && ( */}
// // // // // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // // // // //                 (canView("transferUtility") &&
// // // // // //                   !isHidden("manageNewBusiness")) ||
// // // // // //                 (canView("impOpportunity") &&
// // // // // //                   !isHidden("transferUtility"))) && (
// // // // // //                   <div>
// // // // // //                     {!searchTerm && (
// // // // // //                       <div
// // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // //                         onClick={() =>
// // // // // //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // // // // //                         }
// // // // // //                       >
// // // // // //                         <div className="flex items-center">
// // // // // //                           <div className="w-8 flex justify-center">
// // // // // //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // //                           </div>
// // // // // //                           <span
// // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // //                               }`}
// // // // // //                           >
// // // // // //                             New Business Budget
// // // // // //                           </span>
// // // // // //                         </div>
// // // // // //                         {isExpanded &&
// // // // // //                           (newBusinessSectionOpen ? (
// // // // // //                             <ChevronDown size={14} />
// // // // // //                           ) : (
// // // // // //                             <ChevronRight size={14} />
// // // // // //                           ))}
// // // // // //                       </div>
// // // // // //                     )}

// // // // // //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // //                         {canView("impOpportunity") &&
// // // // // //                           !isHidden("impOpportunity") && (
// // // // // //                             <>
// // // // // //                               <NavItem
// // // // // //                                 label="Import Opportunity"
// // // // // //                                 path="/dashboard/import-opportunity"
// // // // // //                                 selected={selectedPage}
// // // // // //                                 onClick={handleLinkClick}
// // // // // //                                 searchTerm={searchTerm}
// // // // // //                               />
// // // // // //                             </>
// // // // // //                           )}
// // // // // //                         {canView("manageNewBusiness") &&
// // // // // //                           !isHidden("manageNewBusiness") && (
// // // // // //                             <NavItem
// // // // // //                               label="Manage New Business"
// // // // // //                               path="/dashboard/new-business"
// // // // // //                               selected={selectedPage}
// // // // // //                               onClick={handleLinkClick}
// // // // // //                               searchTerm={searchTerm}
// // // // // //                             />
// // // // // //                           )}
// // // // // //                         {canView("transferUtility") &&
// // // // // //                           !isHidden("transferUtility") && (
// // // // // //                             <NavItem
// // // // // //                               label="Transfer Project Budget"
// // // // // //                               path="/dashboard/create-project-budget"
// // // // // //                               selected={selectedPage}
// // // // // //                               onClick={handleLinkClick}
// // // // // //                               searchTerm={searchTerm}
// // // // // //                             />
// // // // // //                           )}
// // // // // //                       </div>
// // // // // //                     )}
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               {/* )} */}
// // // // // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // // // // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // // // // //                   //  ||
// // // // // //                   // (!isHidden("accountMaster")) ||
// // // // // //                   // (!isHidden("orgMaster")) ||
// // // // // //                   // (!isHidden("employeeMaster"))
// // // // // //                   <div>
// // // // // //                     {!searchTerm && (
// // // // // //                       <div
// // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // // // // //                       >
// // // // // //                         <div className="flex items-center">
// // // // // //                           <div className="w-8 flex justify-center">
// // // // // //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // //                           </div>
// // // // // //                           <span
// // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // //                               }`}
// // // // // //                           >
// // // // // //                             Manage
// // // // // //                           </span>
// // // // // //                         </div>
// // // // // //                         {isExpanded &&
// // // // // //                           (manageSectionOpen ? (
// // // // // //                             <ChevronDown size={14} />
// // // // // //                           ) : (
// // // // // //                             <ChevronRight size={14} />
// // // // // //                           ))}
// // // // // //                       </div>
// // // // // //                     )}

// // // // // //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// // // // // //                           <NavItem
// // // // // //                             label="Manage Groups"
// // // // // //                             path="/dashboard/manage-groups"
// // // // // //                             selected={selectedPage}
// // // // // //                             onClick={handleLinkClick}
// // // // // //                             searchTerm={searchTerm}
// // // // // //                           />
// // // // // //                         )}
// // // // // //                         {canView("manageUser") && !isHidden("manageUser") && (
// // // // // //                           <NavItem
// // // // // //                             label="Manage Users"
// // // // // //                             path="/dashboard/manage-users"
// // // // // //                             selected={selectedPage}
// // // // // //                             onClick={handleLinkClick}
// // // // // //                             searchTerm={searchTerm}
// // // // // //                           />
// // // // // //                         )}
// // // // // //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage Accounts"
// // // // // //                           path="/dashboard/account-master"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}
// // // // // //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage Orgs"
// // // // // //                           path="/dashboard/org-master"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}
// // // // // //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage Employees"
// // // // // //                           path="/dashboard/employee-master"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}
// // // // // //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage PLCs"
// // // // // //                           path="/dashboard/plc-master"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}
// // // // // //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage Projects"
// // // // // //                           path="/dashboard/project-master"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}

// // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage Revenue Formulas"
// // // // // //                           path="/dashboard/revenueFormula-master"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}
// // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // //                         <NavItem
// // // // // //                           label="Account Group Table"
// // // // // //                           path="/dashboard/accountgroup-mapping"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}
// // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage Account Group Code"
// // // // // //                           path="/dashboard/accountgroupcode-master"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}
// // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage Account Types"
// // // // // //                           path="/dashboard/accounttype-master"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}
// // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage Company ID"
// // // // // //                           path="/dashboard/company-master"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}
// // // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // // //                         <NavItem
// // // // // //                           label="Manage Data"
// // // // // //                           path="/dashboard/manage-data-manager"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                         {/* )} */}

// // // // // //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// // // // // //                           <NavItem
// // // // // //                             label="Manage Company"
// // // // // //                             path="/dashboard/manage-company"
// // // // // //                             selected={selectedPage}
// // // // // //                             onClick={handleLinkClick}
// // // // // //                             searchTerm={searchTerm}
// // // // // //                           />
// // // // // //                         )}

// // // // // //                         <NavItem
// // // // // //                           label="Manage Reference"
// // // // // //                           path="/dashboard/manage-reference"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Employee"
// // // // // //                           path="/dashboard/manage-employee"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Employee Salary"
// // // // // //                           path="/dashboard/manage-employee-salary"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Account Mass Link"
// // // // // //                           path="/dashboard/account-mass-link"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Accounts Link"
// // // // // //                           path="/dashboard/accounts-link"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Project Roles"
// // // // // //                           path="/dashboard/manage-project-role"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Revenue"
// // // // // //                           path="/dashboard/manage-revenue"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Revenue Formulas"
// // // // // //                           path="/dashboard/manage-revenue-formulas"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Print Project Revenue & Billing Formulas"
// // // // // //                           path="/dashboard/print-revenue-billing-formulas"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Rate Sequence Orders"
// // // // // //                           path="/dashboard/manage-rate-sequence-orders"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Cost of Goods Sold"
// // // // // //                           path="/dashboard/manage-cogs"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Alternate Project Revenue Profiles"
// // // // // //                           path="/dashboard/manage-alternate-project-revenue-profiles"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Alternate Revenue Profile Prior Year History"
// // // // // //                           path="/dashboard/manage-alternate-revenue-profile-prior-year-history"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Project Revenue Calculation Value History"
// // // // // //                           path="/dashboard/manage-project-revenue-calculation-value-history"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />

// // // // // //                         <NavItem
// // // // // //                           label="Manage Revenue Evaluation Info and Disclosures"
// // // // // //                           path="/dashboard/manage-revenue-evaluation-info-and-disclosures"
// // // // // //                           selected={selectedPage}
// // // // // //                           onClick={handleLinkClick}
// // // // // //                           searchTerm={searchTerm}
// // // // // //                         />
// // // // // //                       </div>
// // // // // //                     )}
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               {/* --- CONFIGURATION SECTION --- */}
// // // // // //               {((canView("globalConfiguration") &&
// // // // // //                 !isHidden("globalConfiguration")) ||
// // // // // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // // // // //                 (canView("projectOrgSecurity") &&
// // // // // //                   !isHidden("projectOrgSecurity")) ||
// // // // // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // // // // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // // // // //                 (canView("ceilingConfiguration") &&
// // // // // //                   !isHidden("ceilingConfiguration")) ||
// // // // // //                 (canView("fiscalYearPeriods") &&
// // // // // //                   !isHidden("fiscalYearPeriods")) ||
// // // // // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // // // // //                 (canView("prospectiveIdSetup") &&
// // // // // //                   !isHidden("prospectiveIdSetup")) ||
// // // // // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // // // // //                   <div>
// // // // // //                     {!searchTerm && (
// // // // // //                       <div
// // // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // // // // //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// // // // // //                       >
// // // // // //                         <div className="flex items-center">
// // // // // //                           <div className="w-8 flex justify-center">
// // // // // //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // // // // //                           </div>
// // // // // //                           <span
// // // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // //                               }`}
// // // // // //                           >
// // // // // //                             Settings
// // // // // //                           </span>
// // // // // //                         </div>
// // // // // //                         {isExpanded &&
// // // // // //                           (configurationOpen ? (
// // // // // //                             <ChevronDown size={14} />
// // // // // //                           ) : (
// // // // // //                             <ChevronRight size={14} />
// // // // // //                           ))}
// // // // // //                       </div>
// // // // // //                     )}

// // // // // //                     {(configurationOpen || searchTerm) && isExpanded && (
// // // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // //                         {canView("globalConfiguration") &&
// // // // // //                           !isHidden("globalConfiguration") && (
// // // // // //                             <NavItem
// // // // // //                               label="Configuration Setting"
// // // // // //                               path="/dashboard/global-configuration"
// // // // // //                               selected={selectedPage}
// // // // // //                               onClick={handleLinkClick}
// // // // // //                               searchTerm={searchTerm}
// // // // // //                             />
// // // // // //                           )}
// // // // // //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // // // // //                           <NavItem
// // // // // //                             label="Burden Setup"
// // // // // //                             path="/dashboard/pool-rate-tabs"
// // // // // //                             selected={selectedPage}
// // // // // //                             onClick={handleLinkClick}
// // // // // //                             searchTerm={searchTerm}
// // // // // //                           />
// // // // // //                         )}
// // // // // //                         {canView("projectOrgSecurity") &&
// // // // // //                           !isHidden("projectOrgSecurity") && (
// // // // // //                             <NavItem
// // // // // //                               label="Project Org Security"
// // // // // //                               path="/dashboard/projectmapping"
// // // // // //                               selected={selectedPage}
// // // // // //                               onClick={handleLinkClick}
// // // // // //                               searchTerm={searchTerm}
// // // // // //                             />
// // // // // //                           )}
// // // // // //                         {canView("accountMapping") &&
// // // // // //                           !isHidden("accountMapping") && (
// // // // // //                             <NavItem
// // // // // //                               label="Account Mapping"
// // // // // //                               path="/dashboard/account-mapping"
// // // // // //                               selected={selectedPage}
// // // // // //                               onClick={handleLinkClick}
// // // // // //                               searchTerm={searchTerm}
// // // // // //                             />
// // // // // //                           )}
// // // // // //                         {canView("analogRate") && !isHidden("analogRate") && (
// // // // // //                           <NavItem
// // // // // //                             label="NBIs Analogous Rate"
// // // // // //                             path="/dashboard/analog-rate"
// // // // // //                             selected={selectedPage}
// // // // // //                             onClick={handleLinkClick}
// // // // // //                             searchTerm={searchTerm}
// // // // // //                           />
// // // // // //                         )}
// // // // // //                         {canView("ceilingConfiguration") &&
// // // // // //                           !isHidden("ceilingConfiguration") && (
// // // // // //                             <NavItem
// // // // // //                               label="Ceiling Configuration"
// // // // // //                               path="/dashboard/ceiling-configuration"
// // // // // //                               selected={selectedPage}
// // // // // //                               onClick={handleLinkClick}
// // // // // //                               searchTerm={searchTerm}
// // // // // //                             />
// // // // // //                           )}
// // // // // //                         {canView("fiscalYearPeriods") &&
// // // // // //                           !isHidden("fiscalYearPeriods") && (
// // // // // //                             <NavItem
// // // // // //                               label="Fiscal Year Periods"
// // // // // //                               path="/dashboard/maintain-fiscal-year-periods"
// // // // // //                               selected={selectedPage}
// // // // // //                               onClick={handleLinkClick}
// // // // // //                               searchTerm={searchTerm}
// // // // // //                             />
// // // // // //                           )}
// // // // // //                         {canView("annualHolidays") &&
// // // // // //                           !isHidden("annualHolidays") && (
// // // // // //                             <NavItem
// // // // // //                               label="Annual Holidays"
// // // // // //                               path="/dashboard/annual-holidays"
// // // // // //                               selected={selectedPage}
// // // // // //                               onClick={handleLinkClick}
// // // // // //                               searchTerm={searchTerm}
// // // // // //                             />
// // // // // //                           )}
// // // // // //                         {canView("prospectiveIdSetup") &&
// // // // // //                           !isHidden("prospectiveIdSetup") && (
// // // // // //                             <NavItem
// // // // // //                               label="Prospective ID Setup"
// // // // // //                               path="/dashboard/prospective-id-setup"
// // // // // //                               selected={selectedPage}
// // // // // //                               onClick={handleLinkClick}
// // // // // //                               searchTerm={searchTerm}
// // // // // //                             />
// // // // // //                           )}
// // // // // //                         {canView("roleRights") && !isHidden("roleRights") && (
// // // // // //                           <NavItem
// // // // // //                             label="Rights Settings"
// // // // // //                             path="/dashboard/role-rights"
// // // // // //                             selected={selectedPage}
// // // // // //                             onClick={handleLinkClick}
// // // // // //                           />
// // // // // //                         )}
// // // // // //                         {/* <NavItem
// // // // // //                         label="Override Configuration"
// // // // // //                         path="/dashboard/override-settings"
// // // // // //                         selected={selectedPage}
// // // // // //                         onClick={handleLinkClick}
// // // // // //                       /> */}
// // // // // //                       </div>
// // // // // //                     )}
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               <div>
// // // // // //                 <div
// // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // // // // //                 >
// // // // // //                   <div className="flex items-center">
// // // // // //                     <div className="w-8 flex justify-center">
// // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // //                     </div>
// // // // // //                     <span
// // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // //                     >
// // // // // //                       System Security
// // // // // //                     </span>
// // // // // //                   </div>
// // // // // //                   {isExpanded &&
// // // // // //                     (securityMenuOpen ? (
// // // // // //                       <ChevronDown size={14} />
// // // // // //                     ) : (
// // // // // //                       <ChevronRight size={14} />
// // // // // //                     ))}
// // // // // //                 </div>

// // // // // //                 {securityMenuOpen && isExpanded && (
// // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // //                     <NavItem
// // // // // //                       label="Manage User Groups"
// // // // // //                       path="/dashboard/manage-user-groups"
// // // // // //                       selected={selectedPage}
// // // // // //                       onClick={handleLinkClick}
// // // // // //                     />
// // // // // //                     <NavItem
// // // // // //                       label="Manage User"
// // // // // //                       path="/dashboard/manage-users"
// // // // // //                       selected={selectedPage}
// // // // // //                       onClick={handleLinkClick}
// // // // // //                     />
// // // // // //                     <NavItem
// // // // // //                       label="Manage User Suppression"
// // // // // //                       path="/dashboard/user-suppression"
// // // // // //                       selected={selectedPage}
// // // // // //                       onClick={handleLinkClick}
// // // // // //                     />
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               </div>

// // // // // //               <div>
// // // // // //                 <div
// // // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // // // // //                 >
// // // // // //                   <div className="flex items-center">
// // // // // //                     <div className="w-8 flex justify-center">
// // // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // // //                     </div>
// // // // // //                     <span
// // // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // // //                     >
// // // // // //                       Organizational Security
// // // // // //                     </span>
// // // // // //                   </div>
// // // // // //                   {isExpanded &&
// // // // // //                     (securityOrgMenuOpen ? (
// // // // // //                       <ChevronDown size={14} />
// // // // // //                     ) : (
// // // // // //                       <ChevronRight size={14} />
// // // // // //                     ))}
// // // // // //                 </div>

// // // // // //                 {securityOrgMenuOpen && isExpanded && (
// // // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // // //                     <NavItem
// // // // // //                       label="Activate/Inactivate Organization Security by Module"
// // // // // //                       path="/dashboard/atc-ina-org-sec"
// // // // // //                       selected={selectedPage}
// // // // // //                       onClick={handleLinkClick}
// // // // // //                     />
// // // // // //                     <NavItem
// // // // // //                       label="Manage Organization Security Profiles"
// // // // // //                       path="/dashboard/prof-org-sec"
// // // // // //                       selected={selectedPage}
// // // // // //                       onClick={handleLinkClick}
// // // // // //                     />
// // // // // //                     <NavItem
// // // // // //                       label="Manage Organization Security Groups"
// // // // // //                       path="/dashboard/groups-org-sec"
// // // // // //                       selected={selectedPage}
// // // // // //                       onClick={handleLinkClick}
// // // // // //                     />
// // // // // //                     <NavItem
// // // // // //                       label="Update Organization Security Profiles"
// // // // // //                       path="/dashboard/prof-upd-org-sec"
// // // // // //                       selected={selectedPage}
// // // // // //                       onClick={handleLinkClick}
// // // // // //                     />
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </div>

// // // // // //         {/* Footer Version */}
// // // // // //         <div
// // // // // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // // //             }`}
// // // // // //         >
// // // // // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // // // // //             v{appVersion}
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Background Overlay for mobile */}
// // // // // //       {/* {isExpanded  && (
// // // // // //         <div
// // // // // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // // // // //           onClick={handleCloseSidebar}
// // // // // //         ></div>
// // // // // //       )} */}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // // // // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // // // // //     return null;
// // // // // //   }

// // // // // //   return (
// // // // // //     <Link
// // // // // //       to={path}
// // // // // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// // // // // //           ? "text-white font-semibold"
// // // // // //           : "text-gray-500 hover:text-gray-900"
// // // // // //         }`}
// // // // // //       style={{
// // // // // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // // // // //       }}
// // // // // //       onClick={(e) => {
// // // // // //         e.preventDefault();
// // // // // //         onClick(path);
// // // // // //       }}
// // // // // //     >
// // // // // //       {label}
// // // // // //     </Link>
// // // // // //   );
// // // // // // };

// // // // // // export default NavigationSidebar;

// // // // // import React, { useState, useEffect } from "react";
// // // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // // import {
// // // // //   Menu,
// // // // //   X,
// // // // //   ChevronDown,
// // // // //   ChevronRight,
// // // // //   Plus,
// // // // //   Minus,
// // // // //   BarChart2,
// // // // //   Layers,
// // // // //   FileText,
// // // // //   Settings,
// // // // //   BriefcaseBusiness,
// // // // //   SlidersHorizontal,
// // // // //   Users, // new icon for New Business Budget section
// // // // // } from "lucide-react";

// // // // // const NavigationSidebar = ({
// // // // //   setIsHovered,
// // // // //   isHovered,
// // // // //   setIsSidebarOpen,
// // // // //   isSidebarOpen,
// // // // //   canView,
// // // // // }) => {
// // // // //   const { pathname } = useLocation();
// // // // //   const navigate = useNavigate();

// // // // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // //   const HIDDEN_FEATURES =
// // // // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // // // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // // // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // // // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // //     pathname.includes("/dashboard/new-business") ||
// // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // //     pathname.includes("/dashboard/template") ||
// // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // //     pathname.includes("/dashboard/project-report") ||
// // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // //     pathname.includes("/dashboard/import-opportunity") ||
// // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // //     pathname.includes("/dashboard/pricing") ||
// // // // //     pathname.includes("/dashboard/financial-report") ||
// // // // //     pathname.includes("/dashboard/account-master") ||
// // // // //     pathname.includes("/dashboard/org-master") ||
// // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // //     pathname.includes("/dashboard/project-master") ||
// // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // //     pathname.includes("/dashboard/company-master") ||
// // // // //     pathname.includes("/service-unavailable") ||
// // // // //     pathname.includes("/dashboard/manage-data-manager") ||
// // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // // // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// // // // //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// // // // //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
// // // // //     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
// // // // //     pathname.includes("/dashboard/manage-performance-obligation-type-codes")

// // // // //   );

// // // // //   const [planningOpen, setPlanningOpen] = useState(
// // // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // // //     // pathname.includes("/dashboard/new-business") ||
// // // // //     pathname.includes("/dashboard/project-report") ||
// // // // //     pathname.includes("/dashboard/mass-utility") ||
// // // // //     pathname.includes("/dashboard/import-utility") ||
// // // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // // //     pathname.includes("/dashboard/pricing") ||
// // // // //     pathname.includes("/dashboard/financial-report"),
// // // // //   );

// // // // //   const [configurationOpen, setConfigurationOpen] = useState(
// // // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // // //     pathname.includes("/dashboard/template") ||
// // // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // // //     pathname.includes("/dashboard/display-settings") ||
// // // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // // //     pathname.includes("/dashboard/analog-rate") ||
// // // // //     pathname.includes("/dashboard/role-rights") ||
// // // // //     pathname.includes("/dashboard/account-mapping") ||
// // // // //     pathname.includes("/dashboard/projectmapping") ||
// // // // //     pathname.includes("/dashboard/override-settings") ||
// // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // //   );

// // // // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // // //     pathname.includes("/dashboard/template-pool-mapping"),
// // // // //   );

// // // // //   // NEW: New Business Budget section open state
// // // // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // // // //     pathname.includes("/dashboard/new-business") ||
// // // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // // //     pathname.includes("/dashboard/import-opportunity"),
// // // // //   );

// // // // //   // NEW: Manage (Users & Groups) section open state
// // // // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // //     pathname.includes("/dashboard/manage-groups") ||
// // // // //     pathname.includes("/dashboard/account-master") ||
// // // // //     pathname.includes("/dashboard/org-master") ||
// // // // //     pathname.includes("/dashboard/plc-master") ||
// // // // //     pathname.includes("/dashboard/employee-master") ||
// // // // //     pathname.includes("/dashboard/project-master") ||
// // // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // // //     pathname.includes("/dashboard/company-master") ||
// // // // //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // // //     pathname.includes("/dashboard/manage-employee") ||
// // // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // // //     pathname.includes("/dashboard/account-mass-link") ||
// // // // //     pathname.includes("/dashboard/accounts-link") ||
// // // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // // // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// // // // //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// // // // //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
// // // // //     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
// // // // //     pathname.includes("/dashboard/manage-performance-obligation-type-codes")
// // // // //   );

// // // // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // // // //     pathname.includes("/dashboard/global-configuration") ||
// // // // //     pathname.includes("/dashboard/display-settings"),
// // // // //   );

// // // // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // // //     pathname.includes("/dashboard/manage-users") ||
// // // // //     pathname.includes("/dashboard/user-suppression"),
// // // // //   );

// // // // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // // //   );

// // // // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // // // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // // // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // // // //   const [userName, setUserName] = useState("");

// // // // //   // hover state (existing)
// // // // //   // const [isHovered, setIsHovered] = useState(false);

// // // // //   useEffect(() => {
// // // // //     const userString = localStorage.getItem("currentUser");
// // // // //     if (userString) {
// // // // //       try {
// // // // //         const userObj = JSON.parse(userString);
// // // // //         setUserName(userObj.name);
// // // // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // // // //       } catch {
// // // // //         setCurrentUserRole(null);
// // // // //       }
// // // // //     }
// // // // //   }, []);

// // // // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // // // //   const handleLinkClick = (pagePath) => {
// // // // //     setSelectedPage(pagePath);
// // // // //     navigate(pagePath);
// // // // //     if (isSidebarOpen) {
// // // // //       setIsSidebarOpen(false);
// // // // //     }
// // // // //   };

// // // // //   const handleCloseSidebar = () => {
// // // // //     setSearchTerm("");
// // // // //     setIsSidebarOpen(false);
// // // // //   };
// // // // //   const handleOpenSidebar = () => {
// // // // //     setIsSidebarOpen(true);
// // // // //   };
// // // // //   const isExpanded = isSidebarOpen || isHovered;

// // // // //   return (
// // // // //     <div
// // // // //       // onMouseOver={handleOpenSidebar}
// // // // //       // onMouseLeave={handleCloseSidebar}
// // // // //       className="flex min-h-screen font-inter bg-white"
// // // // //     >
// // // // //       {/* Mobile Toggle */}
// // // // //       <button
// // // // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // // // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // // // //       >
// // // // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // // // //       </button>

// // // // //       {/* Sidebar - Hover to expand */}
// // // // //       <div
// // // // //         onMouseEnter={() => setIsHovered(true)}
// // // // //         onMouseLeave={() => setIsHovered(false)}
// // // // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // // // //       bg-white border-r border-gray-200
// // // // //       transition-all duration-300 ease-in-out shadow-sm
// // // // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // // // //       md:translate-x-0

// // // // //     `}
// // // // //       >
// // // // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // // // //           {/* Menu / General Toggle Section */}
// // // // //           <div
// // // // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // // // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // // // //           >
// // // // //             <div className="w-8 flex justify-center">
// // // // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // // // //             </div>
// // // // //             <span
// // // // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // //                 }`}
// // // // //             >
// // // // //               Menu
// // // // //             </span>
// // // // //           </div>

// // // // //           {generalMenuOpen && (
// // // // //             <div className="space-y-1 mt-2">
// // // // //               {/* --- PLANNING SECTION --- */}
// // // // //               <div>
// // // // //                 <div
// // // // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // // // //                 >
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     placeholder="Search..."
// // // // //                     value={searchTerm}
// // // // //                     onChange={(e) =>
// // // // //                       setSearchTerm(e.target.value.toLowerCase())
// // // // //                     }
// // // // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // // // //                   />
// // // // //                 </div>
// // // // //                 {!searchTerm && (
// // // // //                   <div
// // // // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // // // //                   >
// // // // //                     <div className="flex items-center">
// // // // //                       <div className="w-8 flex justify-center">
// // // // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // //                       </div>
// // // // //                       <span
// // // // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // //                           }`}
// // // // //                       >
// // // // //                         Planning
// // // // //                       </span>
// // // // //                     </div>
// // // // //                     {isExpanded &&
// // // // //                       (planningOpen ? (
// // // // //                         <ChevronDown size={14} />
// // // // //                       ) : (
// // // // //                         <ChevronRight size={14} />
// // // // //                       ))}
// // // // //                   </div>
// // // // //                 )}

// // // // //                 {(planningOpen || searchTerm) && isExpanded && (
// // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // //                     <NavItem
// // // // //                       label="Project Planning"
// // // // //                       path="/dashboard/project-budget-status"
// // // // //                       selected={selectedPage}
// // // // //                       onClick={handleLinkClick}
// // // // //                       searchTerm={searchTerm}
// // // // //                     />
// // // // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // // // //                       <>
// // // // //                         <NavItem
// // // // //                           label="Reporting"
// // // // //                           path="/dashboard/project-report"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                       </>
// // // // //                     )}

// // // // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // // // //                       <NavItem
// // // // //                         label="Mass Utility"
// // // // //                         path="/dashboard/mass-utility"
// // // // //                         selected={selectedPage}
// // // // //                         onClick={handleLinkClick}
// // // // //                         searchTerm={searchTerm}
// // // // //                       />
// // // // //                     )}
// // // // //                     {canView("pricing") && !isHidden("pricing") && (
// // // // //                       <NavItem
// // // // //                         label="Pricing"
// // // // //                         path="/dashboard/pricing"
// // // // //                         selected={selectedPage}
// // // // //                         onClick={handleLinkClick}
// // // // //                         searchTerm={searchTerm}
// // // // //                       />
// // // // //                     )}

// // // // //                     {canView("financialReport") &&
// // // // //                       !isHidden("financialReport") && (
// // // // //                         <NavItem
// // // // //                           label="Financial Report"
// // // // //                           path="/dashboard/financial-report"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                       )}
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // // // //               {/* {currentUserRole === "admin" && ( */}
// // // // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // // // //                 (canView("transferUtility") &&
// // // // //                   !isHidden("manageNewBusiness")) ||
// // // // //                 (canView("impOpportunity") &&
// // // // //                   !isHidden("transferUtility"))) && (
// // // // //                   <div>
// // // // //                     {!searchTerm && (
// // // // //                       <div
// // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // //                         onClick={() =>
// // // // //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // // // //                         }
// // // // //                       >
// // // // //                         <div className="flex items-center">
// // // // //                           <div className="w-8 flex justify-center">
// // // // //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // //                           </div>
// // // // //                           <span
// // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // //                               }`}
// // // // //                           >
// // // // //                             New Business Budget
// // // // //                           </span>
// // // // //                         </div>
// // // // //                         {isExpanded &&
// // // // //                           (newBusinessSectionOpen ? (
// // // // //                             <ChevronDown size={14} />
// // // // //                           ) : (
// // // // //                             <ChevronRight size={14} />
// // // // //                           ))}
// // // // //                       </div>
// // // // //                     )}

// // // // //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // //                         {canView("impOpportunity") &&
// // // // //                           !isHidden("impOpportunity") && (
// // // // //                             <>
// // // // //                               <NavItem
// // // // //                                 label="Import Opportunity"
// // // // //                                 path="/dashboard/import-opportunity"
// // // // //                                 selected={selectedPage}
// // // // //                                 onClick={handleLinkClick}
// // // // //                                 searchTerm={searchTerm}
// // // // //                               />
// // // // //                             </>
// // // // //                           )}
// // // // //                         {canView("manageNewBusiness") &&
// // // // //                           !isHidden("manageNewBusiness") && (
// // // // //                             <NavItem
// // // // //                               label="Manage New Business"
// // // // //                               path="/dashboard/new-business"
// // // // //                               selected={selectedPage}
// // // // //                               onClick={handleLinkClick}
// // // // //                               searchTerm={searchTerm}
// // // // //                             />
// // // // //                           )}
// // // // //                         {canView("transferUtility") &&
// // // // //                           !isHidden("transferUtility") && (
// // // // //                             <NavItem
// // // // //                               label="Transfer Project Budget"
// // // // //                               path="/dashboard/create-project-budget"
// // // // //                               selected={selectedPage}
// // // // //                               onClick={handleLinkClick}
// // // // //                               searchTerm={searchTerm}
// // // // //                             />
// // // // //                           )}
// // // // //                       </div>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 )}
// // // // //               {/* )} */}
// // // // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // // // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // // // //                   //  ||
// // // // //                   // (!isHidden("accountMaster")) ||
// // // // //                   // (!isHidden("orgMaster")) ||
// // // // //                   // (!isHidden("employeeMaster"))
// // // // //                   <div>
// // // // //                     {!searchTerm && (
// // // // //                       <div
// // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // // // //                       >
// // // // //                         <div className="flex items-center">
// // // // //                           <div className="w-8 flex justify-center">
// // // // //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // //                           </div>
// // // // //                           <span
// // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // //                               }`}
// // // // //                           >
// // // // //                             Manage
// // // // //                           </span>
// // // // //                         </div>
// // // // //                         {isExpanded &&
// // // // //                           (manageSectionOpen ? (
// // // // //                             <ChevronDown size={14} />
// // // // //                           ) : (
// // // // //                             <ChevronRight size={14} />
// // // // //                           ))}
// // // // //                       </div>
// // // // //                     )}

// // // // //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// // // // //                           <NavItem
// // // // //                             label="Manage Groups"
// // // // //                             path="/dashboard/manage-groups"
// // // // //                             selected={selectedPage}
// // // // //                             onClick={handleLinkClick}
// // // // //                             searchTerm={searchTerm}
// // // // //                           />
// // // // //                         )}
// // // // //                         {canView("manageUser") && !isHidden("manageUser") && (
// // // // //                           <NavItem
// // // // //                             label="Manage Users"
// // // // //                             path="/dashboard/manage-users"
// // // // //                             selected={selectedPage}
// // // // //                             onClick={handleLinkClick}
// // // // //                             searchTerm={searchTerm}
// // // // //                           />
// // // // //                         )}
// // // // //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // // // //                         <NavItem
// // // // //                           label="Manage Accounts"
// // // // //                           path="/dashboard/account-master"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}
// // // // //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // // // //                         <NavItem
// // // // //                           label="Manage Orgs"
// // // // //                           path="/dashboard/org-master"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}
// // // // //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // // // //                         <NavItem
// // // // //                           label="Manage Employees"
// // // // //                           path="/dashboard/employee-master"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}
// // // // //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // // // //                         <NavItem
// // // // //                           label="Manage PLCs"
// // // // //                           path="/dashboard/plc-master"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}
// // // // //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // // // //                         <NavItem
// // // // //                           label="Manage Projects"
// // // // //                           path="/dashboard/project-master"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}

// // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // //                         <NavItem
// // // // //                           label="Manage Revenue Formulas"
// // // // //                           path="/dashboard/revenueFormula-master"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}
// // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // //                         <NavItem
// // // // //                           label="Account Group Table"
// // // // //                           path="/dashboard/accountgroup-mapping"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}
// // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // //                         <NavItem
// // // // //                           label="Manage Account Group Code"
// // // // //                           path="/dashboard/accountgroupcode-master"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}
// // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // //                         <NavItem
// // // // //                           label="Manage Account Types"
// // // // //                           path="/dashboard/accounttype-master"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}
// // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // //                         <NavItem
// // // // //                           label="Manage Company ID"
// // // // //                           path="/dashboard/company-master"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}
// // // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // // //                         <NavItem
// // // // //                           label="Manage Data"
// // // // //                           path="/dashboard/manage-data-manager"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                         {/* )} */}

// // // // //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// // // // //                           <NavItem
// // // // //                             label="Manage Company"
// // // // //                             path="/dashboard/manage-company"
// // // // //                             selected={selectedPage}
// // // // //                             onClick={handleLinkClick}
// // // // //                             searchTerm={searchTerm}
// // // // //                           />
// // // // //                         )}

// // // // //                         <NavItem
// // // // //                           label="Manage Reference"
// // // // //                           path="/dashboard/manage-reference"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Employee"
// // // // //                           path="/dashboard/manage-employee"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Employee Salary"
// // // // //                           path="/dashboard/manage-employee-salary"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Account Mass Link"
// // // // //                           path="/dashboard/account-mass-link"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Accounts Link"
// // // // //                           path="/dashboard/accounts-link"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Project Roles"
// // // // //                           path="/dashboard/manage-project-role"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Revenue"
// // // // //                           path="/dashboard/manage-revenue"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Revenue Formulas"
// // // // //                           path="/dashboard/manage-revenue-formulas"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Print Project Revenue & Billing Formulas"
// // // // //                           path="/dashboard/print-revenue-billing-formulas"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Rate Sequence Orders"
// // // // //                           path="/dashboard/manage-rate-sequence-orders"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Cost of Goods Sold"
// // // // //                           path="/dashboard/manage-cogs"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Alternate Project Revenue Profiles"
// // // // //                           path="/dashboard/manage-alternate-project-revenue-profiles"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Alternate Revenue Profile Prior Year History"
// // // // //                           path="/dashboard/manage-alternate-revenue-profile-prior-year-history"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Project Revenue Calculation Value History"
// // // // //                           path="/dashboard/manage-project-revenue-calculation-value-history"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Revenue Evaluation Info and Disclosures"
// // // // //                           path="/dashboard/manage-revenue-evaluation-info-and-disclosures"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Revenue Evaluation Status Codes"
// // // // //                           path="/dashboard/manage-revenue-evaluation-status-codes"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />

// // // // //                         <NavItem
// // // // //                           label="Manage Performance Obligation Type Codes"
// // // // //                           path="/dashboard/manage-performance-obligation-type-codes"
// // // // //                           selected={selectedPage}
// // // // //                           onClick={handleLinkClick}
// // // // //                           searchTerm={searchTerm}
// // // // //                         />
// // // // //                       </div>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 )}
// // // // //               {/* --- CONFIGURATION SECTION --- */}
// // // // //               {((canView("globalConfiguration") &&
// // // // //                 !isHidden("globalConfiguration")) ||
// // // // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // // // //                 (canView("projectOrgSecurity") &&
// // // // //                   !isHidden("projectOrgSecurity")) ||
// // // // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // // // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // // // //                 (canView("ceilingConfiguration") &&
// // // // //                   !isHidden("ceilingConfiguration")) ||
// // // // //                 (canView("fiscalYearPeriods") &&
// // // // //                   !isHidden("fiscalYearPeriods")) ||
// // // // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // // // //                 (canView("prospectiveIdSetup") &&
// // // // //                   !isHidden("prospectiveIdSetup")) ||
// // // // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // // // //                   <div>
// // // // //                     {!searchTerm && (
// // // // //                       <div
// // // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // // // //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// // // // //                       >
// // // // //                         <div className="flex items-center">
// // // // //                           <div className="w-8 flex justify-center">
// // // // //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // // // //                           </div>
// // // // //                           <span
// // // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // //                               }`}
// // // // //                           >
// // // // //                             Settings
// // // // //                           </span>
// // // // //                         </div>
// // // // //                         {isExpanded &&
// // // // //                           (configurationOpen ? (
// // // // //                             <ChevronDown size={14} />
// // // // //                           ) : (
// // // // //                             <ChevronRight size={14} />
// // // // //                           ))}
// // // // //                       </div>
// // // // //                     )}

// // // // //                     {(configurationOpen || searchTerm) && isExpanded && (
// // // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // //                         {canView("globalConfiguration") &&
// // // // //                           !isHidden("globalConfiguration") && (
// // // // //                             <NavItem
// // // // //                               label="Configuration Setting"
// // // // //                               path="/dashboard/global-configuration"
// // // // //                               selected={selectedPage}
// // // // //                               onClick={handleLinkClick}
// // // // //                               searchTerm={searchTerm}
// // // // //                             />
// // // // //                           )}
// // // // //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // // // //                           <NavItem
// // // // //                             label="Burden Setup"
// // // // //                             path="/dashboard/pool-rate-tabs"
// // // // //                             selected={selectedPage}
// // // // //                             onClick={handleLinkClick}
// // // // //                             searchTerm={searchTerm}
// // // // //                           />
// // // // //                         )}
// // // // //                         {canView("projectOrgSecurity") &&
// // // // //                           !isHidden("projectOrgSecurity") && (
// // // // //                             <NavItem
// // // // //                               label="Project Org Security"
// // // // //                               path="/dashboard/projectmapping"
// // // // //                               selected={selectedPage}
// // // // //                               onClick={handleLinkClick}
// // // // //                               searchTerm={searchTerm}
// // // // //                             />
// // // // //                           )}
// // // // //                         {canView("accountMapping") &&
// // // // //                           !isHidden("accountMapping") && (
// // // // //                             <NavItem
// // // // //                               label="Account Mapping"
// // // // //                               path="/dashboard/account-mapping"
// // // // //                               selected={selectedPage}
// // // // //                               onClick={handleLinkClick}
// // // // //                               searchTerm={searchTerm}
// // // // //                             />
// // // // //                           )}
// // // // //                         {canView("analogRate") && !isHidden("analogRate") && (
// // // // //                           <NavItem
// // // // //                             label="NBIs Analogous Rate"
// // // // //                             path="/dashboard/analog-rate"
// // // // //                             selected={selectedPage}
// // // // //                             onClick={handleLinkClick}
// // // // //                             searchTerm={searchTerm}
// // // // //                           />
// // // // //                         )}
// // // // //                         {canView("ceilingConfiguration") &&
// // // // //                           !isHidden("ceilingConfiguration") && (
// // // // //                             <NavItem
// // // // //                               label="Ceiling Configuration"
// // // // //                               path="/dashboard/ceiling-configuration"
// // // // //                               selected={selectedPage}
// // // // //                               onClick={handleLinkClick}
// // // // //                               searchTerm={searchTerm}
// // // // //                             />
// // // // //                           )}
// // // // //                         {canView("fiscalYearPeriods") &&
// // // // //                           !isHidden("fiscalYearPeriods") && (
// // // // //                             <NavItem
// // // // //                               label="Fiscal Year Periods"
// // // // //                               path="/dashboard/maintain-fiscal-year-periods"
// // // // //                               selected={selectedPage}
// // // // //                               onClick={handleLinkClick}
// // // // //                               searchTerm={searchTerm}
// // // // //                             />
// // // // //                           )}
// // // // //                         {canView("annualHolidays") &&
// // // // //                           !isHidden("annualHolidays") && (
// // // // //                             <NavItem
// // // // //                               label="Annual Holidays"
// // // // //                               path="/dashboard/annual-holidays"
// // // // //                               selected={selectedPage}
// // // // //                               onClick={handleLinkClick}
// // // // //                               searchTerm={searchTerm}
// // // // //                             />
// // // // //                           )}
// // // // //                         {canView("prospectiveIdSetup") &&
// // // // //                           !isHidden("prospectiveIdSetup") && (
// // // // //                             <NavItem
// // // // //                               label="Prospective ID Setup"
// // // // //                               path="/dashboard/prospective-id-setup"
// // // // //                               selected={selectedPage}
// // // // //                               onClick={handleLinkClick}
// // // // //                               searchTerm={searchTerm}
// // // // //                             />
// // // // //                           )}
// // // // //                         {canView("roleRights") && !isHidden("roleRights") && (
// // // // //                           <NavItem
// // // // //                             label="Rights Settings"
// // // // //                             path="/dashboard/role-rights"
// // // // //                             selected={selectedPage}
// // // // //                             onClick={handleLinkClick}
// // // // //                           />
// // // // //                         )}
// // // // //                         {/* <NavItem
// // // // //                         label="Override Configuration"
// // // // //                         path="/dashboard/override-settings"
// // // // //                         selected={selectedPage}
// // // // //                         onClick={handleLinkClick}
// // // // //                       /> */}
// // // // //                       </div>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 )}
// // // // //               <div>
// // // // //                 <div
// // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // // // //                 >
// // // // //                   <div className="flex items-center">
// // // // //                     <div className="w-8 flex justify-center">
// // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // //                     </div>
// // // // //                     <span
// // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // //                     >
// // // // //                       System Security
// // // // //                     </span>
// // // // //                   </div>
// // // // //                   {isExpanded &&
// // // // //                     (securityMenuOpen ? (
// // // // //                       <ChevronDown size={14} />
// // // // //                     ) : (
// // // // //                       <ChevronRight size={14} />
// // // // //                     ))}
// // // // //                 </div>

// // // // //                 {securityMenuOpen && isExpanded && (
// // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // //                     <NavItem
// // // // //                       label="Manage User Groups"
// // // // //                       path="/dashboard/manage-user-groups"
// // // // //                       selected={selectedPage}
// // // // //                       onClick={handleLinkClick}
// // // // //                     />
// // // // //                     <NavItem
// // // // //                       label="Manage User"
// // // // //                       path="/dashboard/manage-users"
// // // // //                       selected={selectedPage}
// // // // //                       onClick={handleLinkClick}
// // // // //                     />
// // // // //                     <NavItem
// // // // //                       label="Manage User Suppression"
// // // // //                       path="/dashboard/user-suppression"
// // // // //                       selected={selectedPage}
// // // // //                       onClick={handleLinkClick}
// // // // //                     />
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>

// // // // //               <div>
// // // // //                 <div
// // // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // // // //                 >
// // // // //                   <div className="flex items-center">
// // // // //                     <div className="w-8 flex justify-center">
// // // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // // //                     </div>
// // // // //                     <span
// // // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // // //                     >
// // // // //                       Organizational Security
// // // // //                     </span>
// // // // //                   </div>
// // // // //                   {isExpanded &&
// // // // //                     (securityOrgMenuOpen ? (
// // // // //                       <ChevronDown size={14} />
// // // // //                     ) : (
// // // // //                       <ChevronRight size={14} />
// // // // //                     ))}
// // // // //                 </div>

// // // // //                 {securityOrgMenuOpen && isExpanded && (
// // // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // // //                     <NavItem
// // // // //                       label="Activate/Inactivate Organization Security by Module"
// // // // //                       path="/dashboard/atc-ina-org-sec"
// // // // //                       selected={selectedPage}
// // // // //                       onClick={handleLinkClick}
// // // // //                     />
// // // // //                     <NavItem
// // // // //                       label="Manage Organization Security Profiles"
// // // // //                       path="/dashboard/prof-org-sec"
// // // // //                       selected={selectedPage}
// // // // //                       onClick={handleLinkClick}
// // // // //                     />
// // // // //                     <NavItem
// // // // //                       label="Manage Organization Security Groups"
// // // // //                       path="/dashboard/groups-org-sec"
// // // // //                       selected={selectedPage}
// // // // //                       onClick={handleLinkClick}
// // // // //                     />
// // // // //                     <NavItem
// // // // //                       label="Update Organization Security Profiles"
// // // // //                       path="/dashboard/prof-upd-org-sec"
// // // // //                       selected={selectedPage}
// // // // //                       onClick={handleLinkClick}
// // // // //                     />
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Footer Version */}
// // // // //         <div
// // // // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // // //             }`}
// // // // //         >
// // // // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // // // //             v{appVersion}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Background Overlay for mobile */}
// // // // //       {/* {isExpanded  && (
// // // // //         <div
// // // // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // // // //           onClick={handleCloseSidebar}
// // // // //         ></div>
// // // // //       )} */}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // // // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // // // //     return null;
// // // // //   }

// // // // //   return (
// // // // //     <Link
// // // // //       to={path}
// // // // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// // // // //           ? "text-white font-semibold"
// // // // //           : "text-gray-500 hover:text-gray-900"
// // // // //         }`}
// // // // //       style={{
// // // // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // // // //       }}
// // // // //       onClick={(e) => {
// // // // //         e.preventDefault();
// // // // //         onClick(path);
// // // // //       }}
// // // // //     >
// // // // //       {label}
// // // // //     </Link>
// // // // //   );
// // // // // };

// // // // // export default NavigationSidebar;

// // // // import React, { useState, useEffect } from "react";
// // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // import {
// // // //   Menu,
// // // //   X,
// // // //   ChevronDown,
// // // //   ChevronRight,
// // // //   Plus,
// // // //   Minus,
// // // //   BarChart2,
// // // //   Layers,
// // // //   FileText,
// // // //   Settings,
// // // //   BriefcaseBusiness,
// // // //   SlidersHorizontal,
// // // //   Users, // new icon for New Business Budget section
// // // // } from "lucide-react";

// // // // const NavigationSidebar = ({
// // // //   setIsHovered,
// // // //   isHovered,
// // // //   setIsSidebarOpen,
// // // //   isSidebarOpen,
// // // //   canView,
// // // // }) => {
// // // //   const { pathname } = useLocation();
// // // //   const navigate = useNavigate();

// // // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // // //   const [searchTerm, setSearchTerm] = useState("");

// // // //   const HIDDEN_FEATURES =
// // // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // //     pathname.includes("/dashboard/new-business") ||
// // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // //     pathname.includes("/dashboard/template") ||
// // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // //     pathname.includes("/dashboard/global-configuration") ||
// // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // //     pathname.includes("/dashboard/display-settings") ||
// // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // //     pathname.includes("/dashboard/analog-rate") ||
// // // //     pathname.includes("/dashboard/project-report") ||
// // // //     pathname.includes("/dashboard/role-rights") ||
// // // //     pathname.includes("/dashboard/mass-utility") ||
// // // //     pathname.includes("/dashboard/import-utility") ||
// // // //     pathname.includes("/dashboard/account-mapping") ||
// // // //     pathname.includes("/dashboard/projectmapping") ||
// // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // //     pathname.includes("/dashboard/import-opportunity") ||
// // // //     pathname.includes("/dashboard/manage-users") ||
// // // //     pathname.includes("/dashboard/manage-groups") ||
// // // //     pathname.includes("/dashboard/override-settings") ||
// // // //     pathname.includes("/dashboard/pricing") ||
// // // //     pathname.includes("/dashboard/financial-report") ||
// // // //     pathname.includes("/dashboard/account-master") ||
// // // //     pathname.includes("/dashboard/org-master") ||
// // // //     pathname.includes("/dashboard/employee-master") ||
// // // //     pathname.includes("/dashboard/plc-master") ||
// // // //     pathname.includes("/dashboard/project-master") ||
// // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // //     pathname.includes("/dashboard/company-master") ||
// // // //     pathname.includes("/service-unavailable") ||
// // // //     pathname.includes("/dashboard/manage-data-manager") ||
// // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // //     pathname.includes("/dashboard/manage-users") ||
// // // //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // //     pathname.includes("/dashboard/manage-employee") ||
// // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// // // //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// // // //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
// // // //     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
// // // //     pathname.includes("/dashboard/manage-performance-obligation-type-codes") ||
// // // //     pathname.includes("/dashboard/manage-total-ceilings") ||
// // // //     pathname.includes("/dashboard/manage-burden-cost-ceilings") ||
// // // //     pathname.includes("/dashboard/manage-direct-cost-ceilings")

// // // //   );

// // // //   const [planningOpen, setPlanningOpen] = useState(
// // // //     pathname.includes("/dashboard/project-budget-status") ||
// // // //     // pathname.includes("/dashboard/new-business") ||
// // // //     pathname.includes("/dashboard/project-report") ||
// // // //     pathname.includes("/dashboard/mass-utility") ||
// // // //     pathname.includes("/dashboard/import-utility") ||
// // // //     pathname.includes("/dashboard/monthly-forecast") ||
// // // //     pathname.includes("/dashboard/pricing") ||
// // // //     pathname.includes("/dashboard/financial-report"),
// // // //   );

// // // //   const [configurationOpen, setConfigurationOpen] = useState(
// // // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // // //     pathname.includes("/dashboard/template") ||
// // // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // // //     pathname.includes("/dashboard/global-configuration") ||
// // // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // // //     pathname.includes("/dashboard/display-settings") ||
// // // //     pathname.includes("/dashboard/annual-holidays") ||
// // // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // // //     pathname.includes("/dashboard/analog-rate") ||
// // // //     pathname.includes("/dashboard/role-rights") ||
// // // //     pathname.includes("/dashboard/account-mapping") ||
// // // //     pathname.includes("/dashboard/projectmapping") ||
// // // //     pathname.includes("/dashboard/override-settings") ||
// // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // //   );

// // // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // // //     pathname.includes("/dashboard/pool-configuration") ||
// // // //     pathname.includes("/dashboard/template-pool-mapping"),
// // // //   );

// // // //   // NEW: New Business Budget section open state
// // // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // // //     pathname.includes("/dashboard/new-business") ||
// // // //     pathname.includes("/dashboard/create-project-budget") ||
// // // //     pathname.includes("/dashboard/import-opportunity"),
// // // //   );

// // // //   // NEW: Manage (Users & Groups) section open state
// // // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // // //     pathname.includes("/dashboard/manage-users") ||
// // // //     pathname.includes("/dashboard/manage-groups") ||
// // // //     pathname.includes("/dashboard/account-master") ||
// // // //     pathname.includes("/dashboard/org-master") ||
// // // //     pathname.includes("/dashboard/plc-master") ||
// // // //     pathname.includes("/dashboard/employee-master") ||
// // // //     pathname.includes("/dashboard/project-master") ||
// // // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // // //     pathname.includes("/dashboard/accounttype-master") ||
// // // //     pathname.includes("/dashboard/company-master") ||
// // // //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // // //     pathname.includes("/dashboard/manage-employee") ||
// // // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // // //     pathname.includes("/dashboard/account-mass-link") ||
// // // //     pathname.includes("/dashboard/accounts-link") ||
// // // //     pathname.includes("/dashboard/manage-project-role") ||
// // // //     pathname.includes("/dashboard/manage-revenue") ||
// // // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // // //     pathname.includes("/dashboard/manage-cogs") ||
// // // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// // // //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// // // //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
// // // //     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
// // // //     pathname.includes("/dashboard/manage-performance-obligation-type-codes") ||
// // // //     pathname.includes("/dashboard/manage-total-ceilings") ||
// // // //     pathname.includes("/dashboard/manage-burden-cost-ceilings") ||
// // // //     pathname.includes("/dashboard/manage-direct-cost-ceilings")
// // // //   );

// // // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // // //     pathname.includes("/dashboard/global-configuration") ||
// // // //     pathname.includes("/dashboard/display-settings"),
// // // //   );

// // // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // // //     pathname.includes("/dashboard/manage-user-groups") ||
// // // //     pathname.includes("/dashboard/manage-users") ||
// // // //     pathname.includes("/dashboard/user-suppression"),
// // // //   );

// // // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // // //     pathname.includes("/dashboard/prof-org-sec") ||
// // // //     pathname.includes("/dashboard/groups-org-sec") ||
// // // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // // //   );

// // // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // // //   const [userName, setUserName] = useState("");

// // // //   // hover state (existing)
// // // //   // const [isHovered, setIsHovered] = useState(false);

// // // //   useEffect(() => {
// // // //     const userString = localStorage.getItem("currentUser");
// // // //     if (userString) {
// // // //       try {
// // // //         const userObj = JSON.parse(userString);
// // // //         setUserName(userObj.name);
// // // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // // //       } catch {
// // // //         setCurrentUserRole(null);
// // // //       }
// // // //     }
// // // //   }, []);

// // // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // // //   const handleLinkClick = (pagePath) => {
// // // //     setSelectedPage(pagePath);
// // // //     navigate(pagePath);
// // // //     if (isSidebarOpen) {
// // // //       setIsSidebarOpen(false);
// // // //     }
// // // //   };

// // // //   const handleCloseSidebar = () => {
// // // //     setSearchTerm("");
// // // //     setIsSidebarOpen(false);
// // // //   };
// // // //   const handleOpenSidebar = () => {
// // // //     setIsSidebarOpen(true);
// // // //   };
// // // //   const isExpanded = isSidebarOpen || isHovered;

// // // //   return (
// // // //     <div
// // // //       // onMouseOver={handleOpenSidebar}
// // // //       // onMouseLeave={handleCloseSidebar}
// // // //       className="flex min-h-screen font-inter bg-white"
// // // //     >
// // // //       {/* Mobile Toggle */}
// // // //       <button
// // // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // // //       >
// // // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // // //       </button>

// // // //       {/* Sidebar - Hover to expand */}
// // // //       <div
// // // //         onMouseEnter={() => setIsHovered(true)}
// // // //         onMouseLeave={() => setIsHovered(false)}
// // // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // // //       bg-white border-r border-gray-200
// // // //       transition-all duration-300 ease-in-out shadow-sm
// // // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // // //       md:translate-x-0

// // // //     `}
// // // //       >
// // // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // // //           {/* Menu / General Toggle Section */}
// // // //           <div
// // // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // // //           >
// // // //             <div className="w-8 flex justify-center">
// // // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // // //             </div>
// // // //             <span
// // // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // //                 }`}
// // // //             >
// // // //               Menu
// // // //             </span>
// // // //           </div>

// // // //           {generalMenuOpen && (
// // // //             <div className="space-y-1 mt-2">
// // // //               {/* --- PLANNING SECTION --- */}
// // // //               <div>
// // // //                 <div
// // // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // // //                 >
// // // //                   <input
// // // //                     type="text"
// // // //                     placeholder="Search..."
// // // //                     value={searchTerm}
// // // //                     onChange={(e) =>
// // // //                       setSearchTerm(e.target.value.toLowerCase())
// // // //                     }
// // // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // // //                   />
// // // //                 </div>
// // // //                 {!searchTerm && (
// // // //                   <div
// // // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // // //                   >
// // // //                     <div className="flex items-center">
// // // //                       <div className="w-8 flex justify-center">
// // // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // //                       </div>
// // // //                       <span
// // // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // //                           }`}
// // // //                       >
// // // //                         Planning
// // // //                       </span>
// // // //                     </div>
// // // //                     {isExpanded &&
// // // //                       (planningOpen ? (
// // // //                         <ChevronDown size={14} />
// // // //                       ) : (
// // // //                         <ChevronRight size={14} />
// // // //                       ))}
// // // //                   </div>
// // // //                 )}

// // // //                 {(planningOpen || searchTerm) && isExpanded && (
// // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // //                     <NavItem
// // // //                       label="Project Planning"
// // // //                       path="/dashboard/project-budget-status"
// // // //                       selected={selectedPage}
// // // //                       onClick={handleLinkClick}
// // // //                       searchTerm={searchTerm}
// // // //                     />
// // // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // // //                       <>
// // // //                         <NavItem
// // // //                           label="Reporting"
// // // //                           path="/dashboard/project-report"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                       </>
// // // //                     )}

// // // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // // //                       <NavItem
// // // //                         label="Mass Utility"
// // // //                         path="/dashboard/mass-utility"
// // // //                         selected={selectedPage}
// // // //                         onClick={handleLinkClick}
// // // //                         searchTerm={searchTerm}
// // // //                       />
// // // //                     )}
// // // //                     {canView("pricing") && !isHidden("pricing") && (
// // // //                       <NavItem
// // // //                         label="Pricing"
// // // //                         path="/dashboard/pricing"
// // // //                         selected={selectedPage}
// // // //                         onClick={handleLinkClick}
// // // //                         searchTerm={searchTerm}
// // // //                       />
// // // //                     )}

// // // //                     {canView("financialReport") &&
// // // //                       !isHidden("financialReport") && (
// // // //                         <NavItem
// // // //                           label="Financial Report"
// // // //                           path="/dashboard/financial-report"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                       )}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // // //               {/* {currentUserRole === "admin" && ( */}
// // // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // // //                 (canView("transferUtility") &&
// // // //                   !isHidden("manageNewBusiness")) ||
// // // //                 (canView("impOpportunity") &&
// // // //                   !isHidden("transferUtility"))) && (
// // // //                   <div>
// // // //                     {!searchTerm && (
// // // //                       <div
// // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // //                         onClick={() =>
// // // //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // // //                         }
// // // //                       >
// // // //                         <div className="flex items-center">
// // // //                           <div className="w-8 flex justify-center">
// // // //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // //                           </div>
// // // //                           <span
// // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // //                               }`}
// // // //                           >
// // // //                             New Business Budget
// // // //                           </span>
// // // //                         </div>
// // // //                         {isExpanded &&
// // // //                           (newBusinessSectionOpen ? (
// // // //                             <ChevronDown size={14} />
// // // //                           ) : (
// // // //                             <ChevronRight size={14} />
// // // //                           ))}
// // // //                       </div>
// // // //                     )}

// // // //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // //                         {canView("impOpportunity") &&
// // // //                           !isHidden("impOpportunity") && (
// // // //                             <>
// // // //                               <NavItem
// // // //                                 label="Import Opportunity"
// // // //                                 path="/dashboard/import-opportunity"
// // // //                                 selected={selectedPage}
// // // //                                 onClick={handleLinkClick}
// // // //                                 searchTerm={searchTerm}
// // // //                               />
// // // //                             </>
// // // //                           )}
// // // //                         {canView("manageNewBusiness") &&
// // // //                           !isHidden("manageNewBusiness") && (
// // // //                             <NavItem
// // // //                               label="Manage New Business"
// // // //                               path="/dashboard/new-business"
// // // //                               selected={selectedPage}
// // // //                               onClick={handleLinkClick}
// // // //                               searchTerm={searchTerm}
// // // //                             />
// // // //                           )}
// // // //                         {canView("transferUtility") &&
// // // //                           !isHidden("transferUtility") && (
// // // //                             <NavItem
// // // //                               label="Transfer Project Budget"
// // // //                               path="/dashboard/create-project-budget"
// // // //                               selected={selectedPage}
// // // //                               onClick={handleLinkClick}
// // // //                               searchTerm={searchTerm}
// // // //                             />
// // // //                           )}
// // // //                       </div>
// // // //                     )}
// // // //                   </div>
// // // //                 )}
// // // //               {/* )} */}
// // // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // // //                   //  ||
// // // //                   // (!isHidden("accountMaster")) ||
// // // //                   // (!isHidden("orgMaster")) ||
// // // //                   // (!isHidden("employeeMaster"))
// // // //                   <div>
// // // //                     {!searchTerm && (
// // // //                       <div
// // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // // //                       >
// // // //                         <div className="flex items-center">
// // // //                           <div className="w-8 flex justify-center">
// // // //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // //                           </div>
// // // //                           <span
// // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // //                               }`}
// // // //                           >
// // // //                             Manage
// // // //                           </span>
// // // //                         </div>
// // // //                         {isExpanded &&
// // // //                           (manageSectionOpen ? (
// // // //                             <ChevronDown size={14} />
// // // //                           ) : (
// // // //                             <ChevronRight size={14} />
// // // //                           ))}
// // // //                       </div>
// // // //                     )}

// // // //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// // // //                           <NavItem
// // // //                             label="Manage Groups"
// // // //                             path="/dashboard/manage-groups"
// // // //                             selected={selectedPage}
// // // //                             onClick={handleLinkClick}
// // // //                             searchTerm={searchTerm}
// // // //                           />
// // // //                         )}
// // // //                         {canView("manageUser") && !isHidden("manageUser") && (
// // // //                           <NavItem
// // // //                             label="Manage Users"
// // // //                             path="/dashboard/manage-users"
// // // //                             selected={selectedPage}
// // // //                             onClick={handleLinkClick}
// // // //                             searchTerm={searchTerm}
// // // //                           />
// // // //                         )}
// // // //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // // //                         <NavItem
// // // //                           label="Manage Accounts"
// // // //                           path="/dashboard/account-master"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}
// // // //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // // //                         <NavItem
// // // //                           label="Manage Orgs"
// // // //                           path="/dashboard/org-master"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}
// // // //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // // //                         <NavItem
// // // //                           label="Manage Employees"
// // // //                           path="/dashboard/employee-master"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}
// // // //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // // //                         <NavItem
// // // //                           label="Manage PLCs"
// // // //                           path="/dashboard/plc-master"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}
// // // //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // // //                         <NavItem
// // // //                           label="Manage Projects"
// // // //                           path="/dashboard/project-master"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}

// // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // //                         <NavItem
// // // //                           label="Manage Revenue Formulas"
// // // //                           path="/dashboard/revenueFormula-master"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}
// // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // //                         <NavItem
// // // //                           label="Account Group Table"
// // // //                           path="/dashboard/accountgroup-mapping"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}
// // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // //                         <NavItem
// // // //                           label="Manage Account Group Code"
// // // //                           path="/dashboard/accountgroupcode-master"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}
// // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // //                         <NavItem
// // // //                           label="Manage Account Types"
// // // //                           path="/dashboard/accounttype-master"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}
// // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // //                         <NavItem
// // // //                           label="Manage Company ID"
// // // //                           path="/dashboard/company-master"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}
// // // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // // //                         <NavItem
// // // //                           label="Manage Data"
// // // //                           path="/dashboard/manage-data-manager"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                         {/* )} */}

// // // //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// // // //                           <NavItem
// // // //                             label="Manage Company"
// // // //                             path="/dashboard/manage-company"
// // // //                             selected={selectedPage}
// // // //                             onClick={handleLinkClick}
// // // //                             searchTerm={searchTerm}
// // // //                           />
// // // //                         )}

// // // //                         <NavItem
// // // //                           label="Manage Reference"
// // // //                           path="/dashboard/manage-reference"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Employee"
// // // //                           path="/dashboard/manage-employee"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Employee Salary"
// // // //                           path="/dashboard/manage-employee-salary"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Account Mass Link"
// // // //                           path="/dashboard/account-mass-link"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Accounts Link"
// // // //                           path="/dashboard/accounts-link"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Project Roles"
// // // //                           path="/dashboard/manage-project-role"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Revenue"
// // // //                           path="/dashboard/manage-revenue"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Revenue Formulas"
// // // //                           path="/dashboard/manage-revenue-formulas"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Print Project Revenue & Billing Formulas"
// // // //                           path="/dashboard/print-revenue-billing-formulas"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Rate Sequence Orders"
// // // //                           path="/dashboard/manage-rate-sequence-orders"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Cost of Goods Sold"
// // // //                           path="/dashboard/manage-cogs"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Alternate Project Revenue Profiles"
// // // //                           path="/dashboard/manage-alternate-project-revenue-profiles"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Alternate Revenue Profile Prior Year History"
// // // //                           path="/dashboard/manage-alternate-revenue-profile-prior-year-history"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Project Revenue Calculation Value History"
// // // //                           path="/dashboard/manage-project-revenue-calculation-value-history"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Revenue Evaluation Info and Disclosures"
// // // //                           path="/dashboard/manage-revenue-evaluation-info-and-disclosures"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Revenue Evaluation Status Codes"
// // // //                           path="/dashboard/manage-revenue-evaluation-status-codes"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Performance Obligation Type Codes"
// // // //                           path="/dashboard/manage-performance-obligation-type-codes"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Total Ceilings"
// // // //                           path="/dashboard/manage-total-ceilings"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Burden Cost Ceilings"
// // // //                           path="/dashboard/manage-burden-cost-ceilings"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />

// // // //                         <NavItem
// // // //                           label="Manage Direct Cost Ceilings"
// // // //                           path="/dashboard/manage-direct-cost-ceilings"
// // // //                           selected={selectedPage}
// // // //                           onClick={handleLinkClick}
// // // //                           searchTerm={searchTerm}
// // // //                         />
// // // //                       </div>
// // // //                     )}
// // // //                   </div>
// // // //                 )}
// // // //               {/* --- CONFIGURATION SECTION --- */}
// // // //               {((canView("globalConfiguration") &&
// // // //                 !isHidden("globalConfiguration")) ||
// // // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // // //                 (canView("projectOrgSecurity") &&
// // // //                   !isHidden("projectOrgSecurity")) ||
// // // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // // //                 (canView("ceilingConfiguration") &&
// // // //                   !isHidden("ceilingConfiguration")) ||
// // // //                 (canView("fiscalYearPeriods") &&
// // // //                   !isHidden("fiscalYearPeriods")) ||
// // // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // // //                 (canView("prospectiveIdSetup") &&
// // // //                   !isHidden("prospectiveIdSetup")) ||
// // // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // // //                   <div>
// // // //                     {!searchTerm && (
// // // //                       <div
// // // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // // //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// // // //                       >
// // // //                         <div className="flex items-center">
// // // //                           <div className="w-8 flex justify-center">
// // // //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // // //                           </div>
// // // //                           <span
// // // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // //                               }`}
// // // //                           >
// // // //                             Settings
// // // //                           </span>
// // // //                         </div>
// // // //                         {isExpanded &&
// // // //                           (configurationOpen ? (
// // // //                             <ChevronDown size={14} />
// // // //                           ) : (
// // // //                             <ChevronRight size={14} />
// // // //                           ))}
// // // //                       </div>
// // // //                     )}

// // // //                     {(configurationOpen || searchTerm) && isExpanded && (
// // // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // //                         {canView("globalConfiguration") &&
// // // //                           !isHidden("globalConfiguration") && (
// // // //                             <NavItem
// // // //                               label="Configuration Setting"
// // // //                               path="/dashboard/global-configuration"
// // // //                               selected={selectedPage}
// // // //                               onClick={handleLinkClick}
// // // //                               searchTerm={searchTerm}
// // // //                             />
// // // //                           )}
// // // //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // // //                           <NavItem
// // // //                             label="Burden Setup"
// // // //                             path="/dashboard/pool-rate-tabs"
// // // //                             selected={selectedPage}
// // // //                             onClick={handleLinkClick}
// // // //                             searchTerm={searchTerm}
// // // //                           />
// // // //                         )}
// // // //                         {canView("projectOrgSecurity") &&
// // // //                           !isHidden("projectOrgSecurity") && (
// // // //                             <NavItem
// // // //                               label="Project Org Security"
// // // //                               path="/dashboard/projectmapping"
// // // //                               selected={selectedPage}
// // // //                               onClick={handleLinkClick}
// // // //                               searchTerm={searchTerm}
// // // //                             />
// // // //                           )}
// // // //                         {canView("accountMapping") &&
// // // //                           !isHidden("accountMapping") && (
// // // //                             <NavItem
// // // //                               label="Account Mapping"
// // // //                               path="/dashboard/account-mapping"
// // // //                               selected={selectedPage}
// // // //                               onClick={handleLinkClick}
// // // //                               searchTerm={searchTerm}
// // // //                             />
// // // //                           )}
// // // //                         {canView("analogRate") && !isHidden("analogRate") && (
// // // //                           <NavItem
// // // //                             label="NBIs Analogous Rate"
// // // //                             path="/dashboard/analog-rate"
// // // //                             selected={selectedPage}
// // // //                             onClick={handleLinkClick}
// // // //                             searchTerm={searchTerm}
// // // //                           />
// // // //                         )}
// // // //                         {canView("ceilingConfiguration") &&
// // // //                           !isHidden("ceilingConfiguration") && (
// // // //                             <NavItem
// // // //                               label="Ceiling Configuration"
// // // //                               path="/dashboard/ceiling-configuration"
// // // //                               selected={selectedPage}
// // // //                               onClick={handleLinkClick}
// // // //                               searchTerm={searchTerm}
// // // //                             />
// // // //                           )}
// // // //                         {canView("fiscalYearPeriods") &&
// // // //                           !isHidden("fiscalYearPeriods") && (
// // // //                             <NavItem
// // // //                               label="Fiscal Year Periods"
// // // //                               path="/dashboard/maintain-fiscal-year-periods"
// // // //                               selected={selectedPage}
// // // //                               onClick={handleLinkClick}
// // // //                               searchTerm={searchTerm}
// // // //                             />
// // // //                           )}
// // // //                         {canView("annualHolidays") &&
// // // //                           !isHidden("annualHolidays") && (
// // // //                             <NavItem
// // // //                               label="Annual Holidays"
// // // //                               path="/dashboard/annual-holidays"
// // // //                               selected={selectedPage}
// // // //                               onClick={handleLinkClick}
// // // //                               searchTerm={searchTerm}
// // // //                             />
// // // //                           )}
// // // //                         {canView("prospectiveIdSetup") &&
// // // //                           !isHidden("prospectiveIdSetup") && (
// // // //                             <NavItem
// // // //                               label="Prospective ID Setup"
// // // //                               path="/dashboard/prospective-id-setup"
// // // //                               selected={selectedPage}
// // // //                               onClick={handleLinkClick}
// // // //                               searchTerm={searchTerm}
// // // //                             />
// // // //                           )}
// // // //                         {canView("roleRights") && !isHidden("roleRights") && (
// // // //                           <NavItem
// // // //                             label="Rights Settings"
// // // //                             path="/dashboard/role-rights"
// // // //                             selected={selectedPage}
// // // //                             onClick={handleLinkClick}
// // // //                           />
// // // //                         )}
// // // //                         {/* <NavItem
// // // //                         label="Override Configuration"
// // // //                         path="/dashboard/override-settings"
// // // //                         selected={selectedPage}
// // // //                         onClick={handleLinkClick}
// // // //                       /> */}
// // // //                       </div>
// // // //                     )}
// // // //                   </div>
// // // //                 )}
// // // //               <div>
// // // //                 <div
// // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // // //                 >
// // // //                   <div className="flex items-center">
// // // //                     <div className="w-8 flex justify-center">
// // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // //                     </div>
// // // //                     <span
// // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // //                     >
// // // //                       System Security
// // // //                     </span>
// // // //                   </div>
// // // //                   {isExpanded &&
// // // //                     (securityMenuOpen ? (
// // // //                       <ChevronDown size={14} />
// // // //                     ) : (
// // // //                       <ChevronRight size={14} />
// // // //                     ))}
// // // //                 </div>

// // // //                 {securityMenuOpen && isExpanded && (
// // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // //                     <NavItem
// // // //                       label="Manage User Groups"
// // // //                       path="/dashboard/manage-user-groups"
// // // //                       selected={selectedPage}
// // // //                       onClick={handleLinkClick}
// // // //                     />
// // // //                     <NavItem
// // // //                       label="Manage User"
// // // //                       path="/dashboard/manage-users"
// // // //                       selected={selectedPage}
// // // //                       onClick={handleLinkClick}
// // // //                     />
// // // //                     <NavItem
// // // //                       label="Manage User Suppression"
// // // //                       path="/dashboard/user-suppression"
// // // //                       selected={selectedPage}
// // // //                       onClick={handleLinkClick}
// // // //                     />
// // // //                   </div>
// // // //                 )}
// // // //               </div>

// // // //               <div>
// // // //                 <div
// // // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // // //                 >
// // // //                   <div className="flex items-center">
// // // //                     <div className="w-8 flex justify-center">
// // // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // // //                     </div>
// // // //                     <span
// // // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // // //                     >
// // // //                       Organizational Security
// // // //                     </span>
// // // //                   </div>
// // // //                   {isExpanded &&
// // // //                     (securityOrgMenuOpen ? (
// // // //                       <ChevronDown size={14} />
// // // //                     ) : (
// // // //                       <ChevronRight size={14} />
// // // //                     ))}
// // // //                 </div>

// // // //                 {securityOrgMenuOpen && isExpanded && (
// // // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // // //                     <NavItem
// // // //                       label="Activate/Inactivate Organization Security by Module"
// // // //                       path="/dashboard/atc-ina-org-sec"
// // // //                       selected={selectedPage}
// // // //                       onClick={handleLinkClick}
// // // //                     />
// // // //                     <NavItem
// // // //                       label="Manage Organization Security Profiles"
// // // //                       path="/dashboard/prof-org-sec"
// // // //                       selected={selectedPage}
// // // //                       onClick={handleLinkClick}
// // // //                     />
// // // //                     <NavItem
// // // //                       label="Manage Organization Security Groups"
// // // //                       path="/dashboard/groups-org-sec"
// // // //                       selected={selectedPage}
// // // //                       onClick={handleLinkClick}
// // // //                     />
// // // //                     <NavItem
// // // //                       label="Update Organization Security Profiles"
// // // //                       path="/dashboard/prof-upd-org-sec"
// // // //                       selected={selectedPage}
// // // //                       onClick={handleLinkClick}
// // // //                     />
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         {/* Footer Version */}
// // // //         <div
// // // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // // //             }`}
// // // //         >
// // // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // // //             v{appVersion}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Background Overlay for mobile */}
// // // //       {/* {isExpanded  && (
// // // //         <div
// // // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // // //           onClick={handleCloseSidebar}
// // // //         ></div>
// // // //       )} */}
// // // //     </div>
// // // //   );
// // // // };

// // // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // // //     return null;
// // // //   }

// // // //   return (
// // // //     <Link
// // // //       to={path}
// // // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// // // //           ? "text-white font-semibold"
// // // //           : "text-gray-500 hover:text-gray-900"
// // // //         }`}
// // // //       style={{
// // // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // // //       }}
// // // //       onClick={(e) => {
// // // //         e.preventDefault();
// // // //         onClick(path);
// // // //       }}
// // // //     >
// // // //       {label}
// // // //     </Link>
// // // //   );
// // // // };

// // // // export default NavigationSidebar;

// // // import React, { useState, useEffect } from "react";
// // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // import {
// // //   Menu,
// // //   X,
// // //   ChevronDown,
// // //   ChevronRight,
// // //   Plus,
// // //   Minus,
// // //   BarChart2,
// // //   Layers,
// // //   FileText,
// // //   Settings,
// // //   BriefcaseBusiness,
// // //   SlidersHorizontal,
// // //   Users, // new icon for New Business Budget section
// // // } from "lucide-react";

// // // const NavigationSidebar = ({
// // //   setIsHovered,
// // //   isHovered,
// // //   setIsSidebarOpen,
// // //   isSidebarOpen,
// // //   canView,
// // // }) => {
// // //   const { pathname } = useLocation();
// // //   const navigate = useNavigate();

// // //   const [onHoverChange, setOnhoverChange] = useState(false);

// // //   const [searchTerm, setSearchTerm] = useState("");

// // //   const HIDDEN_FEATURES =
// // //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// // //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// // //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// // //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// // //     pathname.includes("/dashboard/project-budget-status") ||
// // //     pathname.includes("/dashboard/new-business") ||
// // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // //     pathname.includes("/dashboard/pool-configuration") ||
// // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // //     pathname.includes("/dashboard/template") ||
// // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // //     pathname.includes("/dashboard/global-configuration") ||
// // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // //     pathname.includes("/dashboard/display-settings") ||
// // //     pathname.includes("/dashboard/annual-holidays") ||
// // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // //     pathname.includes("/dashboard/analog-rate") ||
// // //     pathname.includes("/dashboard/project-report") ||
// // //     pathname.includes("/dashboard/role-rights") ||
// // //     pathname.includes("/dashboard/mass-utility") ||
// // //     pathname.includes("/dashboard/import-utility") ||
// // //     pathname.includes("/dashboard/account-mapping") ||
// // //     pathname.includes("/dashboard/projectmapping") ||
// // //     pathname.includes("/dashboard/monthly-forecast") ||
// // //     pathname.includes("/dashboard/create-project-budget") ||
// // //     pathname.includes("/dashboard/import-opportunity") ||
// // //     pathname.includes("/dashboard/manage-users") ||
// // //     pathname.includes("/dashboard/manage-groups") ||
// // //     pathname.includes("/dashboard/override-settings") ||
// // //     pathname.includes("/dashboard/pricing") ||
// // //     pathname.includes("/dashboard/financial-report") ||
// // //     pathname.includes("/dashboard/account-master") ||
// // //     pathname.includes("/dashboard/org-master") ||
// // //     pathname.includes("/dashboard/employee-master") ||
// // //     pathname.includes("/dashboard/plc-master") ||
// // //     pathname.includes("/dashboard/project-master") ||
// // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // //     pathname.includes("/dashboard/accounttype-master") ||
// // //     pathname.includes("/dashboard/company-master") ||
// // //     pathname.includes("/service-unavailable") ||
// // //     pathname.includes("/dashboard/manage-data-manager") ||
// // //     pathname.includes("/dashboard/manage-user-groups") ||
// // //     pathname.includes("/dashboard/manage-users") ||
// // //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // //     pathname.includes("/dashboard/manage-employee") ||
// // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // //     pathname.includes("/dashboard/manage-project-role") ||
// // //     pathname.includes("/dashboard/manage-revenue") ||
// // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // //     pathname.includes("/dashboard/manage-cogs") ||
// // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// // //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// // //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
// // //     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
// // //     pathname.includes("/dashboard/manage-performance-obligation-type-codes") ||
// // //     pathname.includes("/dashboard/manage-total-ceilings") ||
// // //     pathname.includes("/dashboard/manage-burden-cost-ceilings") ||
// // //     pathname.includes("/dashboard/manage-direct-cost-ceilings") ||
// // //     pathname.includes("/dashboard/manage-burden-fee-overrides") ||
// // //     pathname.includes("/dashboard/manage-cost-fee-overrides") ||
// // //     pathname.includes("/dashboard/manage-multiplier-overrides")

// // //   );

// // //   const [planningOpen, setPlanningOpen] = useState(
// // //     pathname.includes("/dashboard/project-budget-status") ||
// // //     // pathname.includes("/dashboard/new-business") ||
// // //     pathname.includes("/dashboard/project-report") ||
// // //     pathname.includes("/dashboard/mass-utility") ||
// // //     pathname.includes("/dashboard/import-utility") ||
// // //     pathname.includes("/dashboard/monthly-forecast") ||
// // //     pathname.includes("/dashboard/pricing") ||
// // //     pathname.includes("/dashboard/financial-report"),
// // //   );

// // //   const [configurationOpen, setConfigurationOpen] = useState(
// // //     pathname.includes("/dashboard/pool-rate-tabs") ||
// // //     pathname.includes("/dashboard/pool-configuration") ||
// // //     pathname.includes("/dashboard/template-pool-mapping") ||
// // //     pathname.includes("/dashboard/template") ||
// // //     pathname.includes("/dashboard/ceiling-configuration") ||
// // //     pathname.includes("/dashboard/global-configuration") ||
// // //     pathname.includes("/dashboard/prospective-id-setup") ||
// // //     pathname.includes("/dashboard/display-settings") ||
// // //     pathname.includes("/dashboard/annual-holidays") ||
// // //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// // //     pathname.includes("/dashboard/analog-rate") ||
// // //     pathname.includes("/dashboard/role-rights") ||
// // //     pathname.includes("/dashboard/account-mapping") ||
// // //     pathname.includes("/dashboard/projectmapping") ||
// // //     pathname.includes("/dashboard/override-settings") ||
// // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // //     pathname.includes("/dashboard/prof-org-sec") ||
// // //     pathname.includes("/dashboard/groups-org-sec") ||
// // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // //   );

// // //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// // //     pathname.includes("/dashboard/pool-configuration") ||
// // //     pathname.includes("/dashboard/template-pool-mapping"),
// // //   );

// // //   // NEW: New Business Budget section open state
// // //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// // //     pathname.includes("/dashboard/new-business") ||
// // //     pathname.includes("/dashboard/create-project-budget") ||
// // //     pathname.includes("/dashboard/import-opportunity"),
// // //   );

// // //   // NEW: Manage (Users & Groups) section open state
// // //   const [manageSectionOpen, setManageSectionOpen] = useState(
// // //     pathname.includes("/dashboard/manage-users") ||
// // //     pathname.includes("/dashboard/manage-groups") ||
// // //     pathname.includes("/dashboard/account-master") ||
// // //     pathname.includes("/dashboard/org-master") ||
// // //     pathname.includes("/dashboard/plc-master") ||
// // //     pathname.includes("/dashboard/employee-master") ||
// // //     pathname.includes("/dashboard/project-master") ||
// // //     pathname.includes("/dashboard/revenueFormula-master") ||
// // //     pathname.includes("/dashboard/accountgroup-mapping") ||
// // //     pathname.includes("/dashboard/accountgroupcode-master") ||
// // //     pathname.includes("/dashboard/accounttype-master") ||
// // //     pathname.includes("/dashboard/company-master") ||
// // //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// // //     pathname.includes("/dashboard/manage-employee") ||
// // //     pathname.includes("/dashboard/manage-employee-salary") ||
// // //     pathname.includes("/dashboard/account-mass-link") ||
// // //     pathname.includes("/dashboard/accounts-link") ||
// // //     pathname.includes("/dashboard/manage-project-role") ||
// // //     pathname.includes("/dashboard/manage-revenue") ||
// // //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// // //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// // //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// // //     pathname.includes("/dashboard/manage-cogs") ||
// // //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// // //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// // //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// // //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
// // //     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
// // //     pathname.includes("/dashboard/manage-performance-obligation-type-codes") ||
// // //     pathname.includes("/dashboard/manage-total-ceilings") ||
// // //     pathname.includes("/dashboard/manage-burden-cost-ceilings") ||
// // //     pathname.includes("/dashboard/manage-direct-cost-ceilings")
// // //   );

// // //   const [manageSettingOpen, setManageSettingOpen] = useState(
// // //     pathname.includes("/dashboard/global-configuration") ||
// // //     pathname.includes("/dashboard/display-settings"),
// // //   );

// // //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// // //     pathname.includes("/dashboard/manage-user-groups") ||
// // //     pathname.includes("/dashboard/manage-users") ||
// // //     pathname.includes("/dashboard/user-suppression"),
// // //   );

// // //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// // //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// // //     pathname.includes("/dashboard/prof-org-sec") ||
// // //     pathname.includes("/dashboard/groups-org-sec") ||
// // //     pathname.includes("/dashboard/prof-upd-org-sec"),
// // //   );

// // //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// // //   const [selectedPage, setSelectedPage] = useState(pathname);
// // //   const [currentUserRole, setCurrentUserRole] = useState(null);
// // //   const [userName, setUserName] = useState("");

// // //   // hover state (existing)
// // //   // const [isHovered, setIsHovered] = useState(false);

// // //   useEffect(() => {
// // //     const userString = localStorage.getItem("currentUser");
// // //     if (userString) {
// // //       try {
// // //         const userObj = JSON.parse(userString);
// // //         setUserName(userObj.name);
// // //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// // //       } catch {
// // //         setCurrentUserRole(null);
// // //       }
// // //     }
// // //   }, []);

// // //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// // //   const handleLinkClick = (pagePath) => {
// // //     setSelectedPage(pagePath);
// // //     navigate(pagePath);
// // //     if (isSidebarOpen) {
// // //       setIsSidebarOpen(false);
// // //     }
// // //   };

// // //   const handleCloseSidebar = () => {
// // //     setSearchTerm("");
// // //     setIsSidebarOpen(false);
// // //   };
// // //   const handleOpenSidebar = () => {
// // //     setIsSidebarOpen(true);
// // //   };
// // //   const isExpanded = isSidebarOpen || isHovered;

// // //   return (
// // //     <div
// // //       // onMouseOver={handleOpenSidebar}
// // //       // onMouseLeave={handleCloseSidebar}
// // //       className="flex min-h-screen font-inter bg-white"
// // //     >
// // //       {/* Mobile Toggle */}
// // //       <button
// // //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// // //         onClick={() => setIsSidebarOpen(!isExpanded)}
// // //       >
// // //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// // //       </button>

// // //       {/* Sidebar - Hover to expand */}
// // //       <div
// // //         onMouseEnter={() => setIsHovered(true)}
// // //         onMouseLeave={() => setIsHovered(false)}
// // //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// // //       bg-white border-r border-gray-200
// // //       transition-all duration-300 ease-in-out shadow-sm
// // //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// // //       md:translate-x-0

// // //     `}
// // //       >
// // //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// // //           {/* Menu / General Toggle Section */}
// // //           <div
// // //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// // //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// // //           >
// // //             <div className="w-8 flex justify-center">
// // //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// // //             </div>
// // //             <span
// // //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // //                 }`}
// // //             >
// // //               Menu
// // //             </span>
// // //           </div>

// // //           {generalMenuOpen && (
// // //             <div className="space-y-1 mt-2">
// // //               {/* --- PLANNING SECTION --- */}
// // //               <div>
// // //                 <div
// // //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// // //                 >
// // //                   <input
// // //                     type="text"
// // //                     placeholder="Search..."
// // //                     value={searchTerm}
// // //                     onChange={(e) =>
// // //                       setSearchTerm(e.target.value.toLowerCase())
// // //                     }
// // //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// // //                   />
// // //                 </div>
// // //                 {!searchTerm && (
// // //                   <div
// // //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // //                     onClick={() => setPlanningOpen(!planningOpen)}
// // //                   >
// // //                     <div className="flex items-center">
// // //                       <div className="w-8 flex justify-center">
// // //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // //                       </div>
// // //                       <span
// // //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // //                           }`}
// // //                       >
// // //                         Planning
// // //                       </span>
// // //                     </div>
// // //                     {isExpanded &&
// // //                       (planningOpen ? (
// // //                         <ChevronDown size={14} />
// // //                       ) : (
// // //                         <ChevronRight size={14} />
// // //                       ))}
// // //                   </div>
// // //                 )}

// // //                 {(planningOpen || searchTerm) && isExpanded && (
// // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // //                     <NavItem
// // //                       label="Project Planning"
// // //                       path="/dashboard/project-budget-status"
// // //                       selected={selectedPage}
// // //                       onClick={handleLinkClick}
// // //                       searchTerm={searchTerm}
// // //                     />
// // //                     {canView("projectReport") && !isHidden("projectReport") && (
// // //                       <>
// // //                         <NavItem
// // //                           label="Reporting"
// // //                           path="/dashboard/project-report"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                       </>
// // //                     )}

// // //                     {canView("massUtility") && !isHidden("massUtility") && (
// // //                       <NavItem
// // //                         label="Mass Utility"
// // //                         path="/dashboard/mass-utility"
// // //                         selected={selectedPage}
// // //                         onClick={handleLinkClick}
// // //                         searchTerm={searchTerm}
// // //                       />
// // //                     )}
// // //                     {canView("pricing") && !isHidden("pricing") && (
// // //                       <NavItem
// // //                         label="Pricing"
// // //                         path="/dashboard/pricing"
// // //                         selected={selectedPage}
// // //                         onClick={handleLinkClick}
// // //                         searchTerm={searchTerm}
// // //                       />
// // //                     )}

// // //                     {canView("financialReport") &&
// // //                       !isHidden("financialReport") && (
// // //                         <NavItem
// // //                           label="Financial Report"
// // //                           path="/dashboard/financial-report"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                       )}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// // //               {/* {currentUserRole === "admin" && ( */}
// // //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// // //                 (canView("transferUtility") &&
// // //                   !isHidden("manageNewBusiness")) ||
// // //                 (canView("impOpportunity") &&
// // //                   !isHidden("transferUtility"))) && (
// // //                   <div>
// // //                     {!searchTerm && (
// // //                       <div
// // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // //                         onClick={() =>
// // //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// // //                         }
// // //                       >
// // //                         <div className="flex items-center">
// // //                           <div className="w-8 flex justify-center">
// // //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // //                           </div>
// // //                           <span
// // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // //                               }`}
// // //                           >
// // //                             New Business Budget
// // //                           </span>
// // //                         </div>
// // //                         {isExpanded &&
// // //                           (newBusinessSectionOpen ? (
// // //                             <ChevronDown size={14} />
// // //                           ) : (
// // //                             <ChevronRight size={14} />
// // //                           ))}
// // //                       </div>
// // //                     )}

// // //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // //                         {canView("impOpportunity") &&
// // //                           !isHidden("impOpportunity") && (
// // //                             <>
// // //                               <NavItem
// // //                                 label="Import Opportunity"
// // //                                 path="/dashboard/import-opportunity"
// // //                                 selected={selectedPage}
// // //                                 onClick={handleLinkClick}
// // //                                 searchTerm={searchTerm}
// // //                               />
// // //                             </>
// // //                           )}
// // //                         {canView("manageNewBusiness") &&
// // //                           !isHidden("manageNewBusiness") && (
// // //                             <NavItem
// // //                               label="Manage New Business"
// // //                               path="/dashboard/new-business"
// // //                               selected={selectedPage}
// // //                               onClick={handleLinkClick}
// // //                               searchTerm={searchTerm}
// // //                             />
// // //                           )}
// // //                         {canView("transferUtility") &&
// // //                           !isHidden("transferUtility") && (
// // //                             <NavItem
// // //                               label="Transfer Project Budget"
// // //                               path="/dashboard/create-project-budget"
// // //                               selected={selectedPage}
// // //                               onClick={handleLinkClick}
// // //                               searchTerm={searchTerm}
// // //                             />
// // //                           )}
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 )}
// // //               {/* )} */}
// // //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// // //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// // //                   //  ||
// // //                   // (!isHidden("accountMaster")) ||
// // //                   // (!isHidden("orgMaster")) ||
// // //                   // (!isHidden("employeeMaster"))
// // //                   <div>
// // //                     {!searchTerm && (
// // //                       <div
// // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// // //                       >
// // //                         <div className="flex items-center">
// // //                           <div className="w-8 flex justify-center">
// // //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // //                           </div>
// // //                           <span
// // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // //                               }`}
// // //                           >
// // //                             Manage
// // //                           </span>
// // //                         </div>
// // //                         {isExpanded &&
// // //                           (manageSectionOpen ? (
// // //                             <ChevronDown size={14} />
// // //                           ) : (
// // //                             <ChevronRight size={14} />
// // //                           ))}
// // //                       </div>
// // //                     )}

// // //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// // //                           <NavItem
// // //                             label="Manage Groups"
// // //                             path="/dashboard/manage-groups"
// // //                             selected={selectedPage}
// // //                             onClick={handleLinkClick}
// // //                             searchTerm={searchTerm}
// // //                           />
// // //                         )}
// // //                         {canView("manageUser") && !isHidden("manageUser") && (
// // //                           <NavItem
// // //                             label="Manage Users"
// // //                             path="/dashboard/manage-users"
// // //                             selected={selectedPage}
// // //                             onClick={handleLinkClick}
// // //                             searchTerm={searchTerm}
// // //                           />
// // //                         )}
// // //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// // //                         <NavItem
// // //                           label="Manage Accounts"
// // //                           path="/dashboard/account-master"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}
// // //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// // //                         <NavItem
// // //                           label="Manage Orgs"
// // //                           path="/dashboard/org-master"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}
// // //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// // //                         <NavItem
// // //                           label="Manage Employees"
// // //                           path="/dashboard/employee-master"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}
// // //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// // //                         <NavItem
// // //                           label="Manage PLCs"
// // //                           path="/dashboard/plc-master"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}
// // //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// // //                         <NavItem
// // //                           label="Manage Projects"
// // //                           path="/dashboard/project-master"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}

// // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // //                         <NavItem
// // //                           label="Manage Revenue Formulas"
// // //                           path="/dashboard/revenueFormula-master"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}
// // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // //                         <NavItem
// // //                           label="Account Group Table"
// // //                           path="/dashboard/accountgroup-mapping"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}
// // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // //                         <NavItem
// // //                           label="Manage Account Group Code"
// // //                           path="/dashboard/accountgroupcode-master"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}
// // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // //                         <NavItem
// // //                           label="Manage Account Types"
// // //                           path="/dashboard/accounttype-master"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}
// // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // //                         <NavItem
// // //                           label="Manage Company ID"
// // //                           path="/dashboard/company-master"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}
// // //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// // //                         <NavItem
// // //                           label="Manage Data"
// // //                           path="/dashboard/manage-data-manager"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                         {/* )} */}

// // //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// // //                           <NavItem
// // //                             label="Manage Company"
// // //                             path="/dashboard/manage-company"
// // //                             selected={selectedPage}
// // //                             onClick={handleLinkClick}
// // //                             searchTerm={searchTerm}
// // //                           />
// // //                         )}

// // //                         <NavItem
// // //                           label="Manage Reference"
// // //                           path="/dashboard/manage-reference"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Employee"
// // //                           path="/dashboard/manage-employee"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Employee Salary"
// // //                           path="/dashboard/manage-employee-salary"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Account Mass Link"
// // //                           path="/dashboard/account-mass-link"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Accounts Link"
// // //                           path="/dashboard/accounts-link"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Project Roles"
// // //                           path="/dashboard/manage-project-role"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Revenue"
// // //                           path="/dashboard/manage-revenue"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Revenue Formulas"
// // //                           path="/dashboard/manage-revenue-formulas"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Print Project Revenue & Billing Formulas"
// // //                           path="/dashboard/print-revenue-billing-formulas"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Rate Sequence Orders"
// // //                           path="/dashboard/manage-rate-sequence-orders"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Cost of Goods Sold"
// // //                           path="/dashboard/manage-cogs"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Alternate Project Revenue Profiles"
// // //                           path="/dashboard/manage-alternate-project-revenue-profiles"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Alternate Revenue Profile Prior Year History"
// // //                           path="/dashboard/manage-alternate-revenue-profile-prior-year-history"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Project Revenue Calculation Value History"
// // //                           path="/dashboard/manage-project-revenue-calculation-value-history"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Revenue Evaluation Info and Disclosures"
// // //                           path="/dashboard/manage-revenue-evaluation-info-and-disclosures"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Revenue Evaluation Status Codes"
// // //                           path="/dashboard/manage-revenue-evaluation-status-codes"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Performance Obligation Type Codes"
// // //                           path="/dashboard/manage-performance-obligation-type-codes"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Total Ceilings"
// // //                           path="/dashboard/manage-total-ceilings"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Burden Cost Ceilings"
// // //                           path="/dashboard/manage-burden-cost-ceilings"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Direct Cost Ceilings"
// // //                           path="/dashboard/manage-direct-cost-ceilings"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Burden Fee Overrides"
// // //                           path="/dashboard/manage-burden-fee-overrides"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Cost Fee Overrides"
// // //                           path="/dashboard/manage-cost-fee-overrides"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />

// // //                         <NavItem
// // //                           label="Manage Multiplier Overrides"
// // //                           path="/dashboard/manage-multiplier-overrides"
// // //                           selected={selectedPage}
// // //                           onClick={handleLinkClick}
// // //                           searchTerm={searchTerm}
// // //                         />
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 )}
// // //               {/* --- CONFIGURATION SECTION --- */}
// // //               {((canView("globalConfiguration") &&
// // //                 !isHidden("globalConfiguration")) ||
// // //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// // //                 (canView("projectOrgSecurity") &&
// // //                   !isHidden("projectOrgSecurity")) ||
// // //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// // //                 (canView("analogRate") && !isHidden("analogRate")) ||
// // //                 (canView("ceilingConfiguration") &&
// // //                   !isHidden("ceilingConfiguration")) ||
// // //                 (canView("fiscalYearPeriods") &&
// // //                   !isHidden("fiscalYearPeriods")) ||
// // //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// // //                 (canView("prospectiveIdSetup") &&
// // //                   !isHidden("prospectiveIdSetup")) ||
// // //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// // //                   <div>
// // //                     {!searchTerm && (
// // //                       <div
// // //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// // //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// // //                       >
// // //                         <div className="flex items-center">
// // //                           <div className="w-8 flex justify-center">
// // //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// // //                           </div>
// // //                           <span
// // //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // //                               }`}
// // //                           >
// // //                             Settings
// // //                           </span>
// // //                         </div>
// // //                         {isExpanded &&
// // //                           (configurationOpen ? (
// // //                             <ChevronDown size={14} />
// // //                           ) : (
// // //                             <ChevronRight size={14} />
// // //                           ))}
// // //                       </div>
// // //                     )}

// // //                     {(configurationOpen || searchTerm) && isExpanded && (
// // //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // //                         {canView("globalConfiguration") &&
// // //                           !isHidden("globalConfiguration") && (
// // //                             <NavItem
// // //                               label="Configuration Setting"
// // //                               path="/dashboard/global-configuration"
// // //                               selected={selectedPage}
// // //                               onClick={handleLinkClick}
// // //                               searchTerm={searchTerm}
// // //                             />
// // //                           )}
// // //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// // //                           <NavItem
// // //                             label="Burden Setup"
// // //                             path="/dashboard/pool-rate-tabs"
// // //                             selected={selectedPage}
// // //                             onClick={handleLinkClick}
// // //                             searchTerm={searchTerm}
// // //                           />
// // //                         )}
// // //                         {canView("projectOrgSecurity") &&
// // //                           !isHidden("projectOrgSecurity") && (
// // //                             <NavItem
// // //                               label="Project Org Security"
// // //                               path="/dashboard/projectmapping"
// // //                               selected={selectedPage}
// // //                               onClick={handleLinkClick}
// // //                               searchTerm={searchTerm}
// // //                             />
// // //                           )}
// // //                         {canView("accountMapping") &&
// // //                           !isHidden("accountMapping") && (
// // //                             <NavItem
// // //                               label="Account Mapping"
// // //                               path="/dashboard/account-mapping"
// // //                               selected={selectedPage}
// // //                               onClick={handleLinkClick}
// // //                               searchTerm={searchTerm}
// // //                             />
// // //                           )}
// // //                         {canView("analogRate") && !isHidden("analogRate") && (
// // //                           <NavItem
// // //                             label="NBIs Analogous Rate"
// // //                             path="/dashboard/analog-rate"
// // //                             selected={selectedPage}
// // //                             onClick={handleLinkClick}
// // //                             searchTerm={searchTerm}
// // //                           />
// // //                         )}
// // //                         {canView("ceilingConfiguration") &&
// // //                           !isHidden("ceilingConfiguration") && (
// // //                             <NavItem
// // //                               label="Ceiling Configuration"
// // //                               path="/dashboard/ceiling-configuration"
// // //                               selected={selectedPage}
// // //                               onClick={handleLinkClick}
// // //                               searchTerm={searchTerm}
// // //                             />
// // //                           )}
// // //                         {canView("fiscalYearPeriods") &&
// // //                           !isHidden("fiscalYearPeriods") && (
// // //                             <NavItem
// // //                               label="Fiscal Year Periods"
// // //                               path="/dashboard/maintain-fiscal-year-periods"
// // //                               selected={selectedPage}
// // //                               onClick={handleLinkClick}
// // //                               searchTerm={searchTerm}
// // //                             />
// // //                           )}
// // //                         {canView("annualHolidays") &&
// // //                           !isHidden("annualHolidays") && (
// // //                             <NavItem
// // //                               label="Annual Holidays"
// // //                               path="/dashboard/annual-holidays"
// // //                               selected={selectedPage}
// // //                               onClick={handleLinkClick}
// // //                               searchTerm={searchTerm}
// // //                             />
// // //                           )}
// // //                         {canView("prospectiveIdSetup") &&
// // //                           !isHidden("prospectiveIdSetup") && (
// // //                             <NavItem
// // //                               label="Prospective ID Setup"
// // //                               path="/dashboard/prospective-id-setup"
// // //                               selected={selectedPage}
// // //                               onClick={handleLinkClick}
// // //                               searchTerm={searchTerm}
// // //                             />
// // //                           )}
// // //                         {canView("roleRights") && !isHidden("roleRights") && (
// // //                           <NavItem
// // //                             label="Rights Settings"
// // //                             path="/dashboard/role-rights"
// // //                             selected={selectedPage}
// // //                             onClick={handleLinkClick}
// // //                           />
// // //                         )}
// // //                         {/* <NavItem
// // //                         label="Override Configuration"
// // //                         path="/dashboard/override-settings"
// // //                         selected={selectedPage}
// // //                         onClick={handleLinkClick}
// // //                       /> */}
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 )}
// // //               <div>
// // //                 <div
// // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// // //                 >
// // //                   <div className="flex items-center">
// // //                     <div className="w-8 flex justify-center">
// // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // //                     </div>
// // //                     <span
// // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // //                     >
// // //                       System Security
// // //                     </span>
// // //                   </div>
// // //                   {isExpanded &&
// // //                     (securityMenuOpen ? (
// // //                       <ChevronDown size={14} />
// // //                     ) : (
// // //                       <ChevronRight size={14} />
// // //                     ))}
// // //                 </div>

// // //                 {securityMenuOpen && isExpanded && (
// // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // //                     <NavItem
// // //                       label="Manage User Groups"
// // //                       path="/dashboard/manage-user-groups"
// // //                       selected={selectedPage}
// // //                       onClick={handleLinkClick}
// // //                     />
// // //                     <NavItem
// // //                       label="Manage User"
// // //                       path="/dashboard/manage-users"
// // //                       selected={selectedPage}
// // //                       onClick={handleLinkClick}
// // //                     />
// // //                     <NavItem
// // //                       label="Manage User Suppression"
// // //                       path="/dashboard/user-suppression"
// // //                       selected={selectedPage}
// // //                       onClick={handleLinkClick}
// // //                     />
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <div>
// // //                 <div
// // //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// // //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// // //                 >
// // //                   <div className="flex items-center">
// // //                     <div className="w-8 flex justify-center">
// // //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// // //                     </div>
// // //                     <span
// // //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// // //                     >
// // //                       Organizational Security
// // //                     </span>
// // //                   </div>
// // //                   {isExpanded &&
// // //                     (securityOrgMenuOpen ? (
// // //                       <ChevronDown size={14} />
// // //                     ) : (
// // //                       <ChevronRight size={14} />
// // //                     ))}
// // //                 </div>

// // //                 {securityOrgMenuOpen && isExpanded && (
// // //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// // //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// // //                     <NavItem
// // //                       label="Activate/Inactivate Organization Security by Module"
// // //                       path="/dashboard/atc-ina-org-sec"
// // //                       selected={selectedPage}
// // //                       onClick={handleLinkClick}
// // //                     />
// // //                     <NavItem
// // //                       label="Manage Organization Security Profiles"
// // //                       path="/dashboard/prof-org-sec"
// // //                       selected={selectedPage}
// // //                       onClick={handleLinkClick}
// // //                     />
// // //                     <NavItem
// // //                       label="Manage Organization Security Groups"
// // //                       path="/dashboard/groups-org-sec"
// // //                       selected={selectedPage}
// // //                       onClick={handleLinkClick}
// // //                     />
// // //                     <NavItem
// // //                       label="Update Organization Security Profiles"
// // //                       path="/dashboard/prof-upd-org-sec"
// // //                       selected={selectedPage}
// // //                       onClick={handleLinkClick}
// // //                     />
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Footer Version */}
// // //         <div
// // //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// // //             }`}
// // //         >
// // //           <div className="text-[10px] text-gray-400 font-mono select-none">
// // //             v{appVersion}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Background Overlay for mobile */}
// // //       {/* {isExpanded  && (
// // //         <div
// // //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// // //           onClick={handleCloseSidebar}
// // //         ></div>
// // //       )} */}
// // //     </div>
// // //   );
// // // };

// // // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// // //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// // //     return null;
// // //   }

// // //   return (
// // //     <Link
// // //       to={path}
// // //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// // //           ? "text-white font-semibold"
// // //           : "text-gray-500 hover:text-gray-900"
// // //         }`}
// // //       style={{
// // //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// // //       }}
// // //       onClick={(e) => {
// // //         e.preventDefault();
// // //         onClick(path);
// // //       }}
// // //     >
// // //       {label}
// // //     </Link>
// // //   );
// // // };

// // // export default NavigationSidebar;

// // import React, { useState, useEffect } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import {
// //   Menu,
// //   X,
// //   ChevronDown,
// //   ChevronRight,
// //   Plus,
// //   Minus,
// //   BarChart2,
// //   Layers,
// //   FileText,
// //   Settings,
// //   BriefcaseBusiness,
// //   SlidersHorizontal,
// //   Users, // new icon for New Business Budget section
// // } from "lucide-react";

// // const NavigationSidebar = ({
// //   setIsHovered,
// //   isHovered,
// //   setIsSidebarOpen,
// //   isSidebarOpen,
// //   canView,
// // }) => {
// //   const { pathname } = useLocation();
// //   const navigate = useNavigate();

// //   const [onHoverChange, setOnhoverChange] = useState(false);

// //   const [searchTerm, setSearchTerm] = useState("");

// //   const HIDDEN_FEATURES =
// //     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
// //   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

// //   // --- ALL ORIGINAL LOGIC PRESERVED ---
// //   const [generalMenuOpen, setGeneralMenuOpen] = useState(
// //     pathname.includes("/dashboard/project-budget-status") ||
// //     pathname.includes("/dashboard/new-business") ||
// //     pathname.includes("/dashboard/pool-rate-tabs") ||
// //     pathname.includes("/dashboard/pool-configuration") ||
// //     pathname.includes("/dashboard/template-pool-mapping") ||
// //     pathname.includes("/dashboard/template") ||
// //     pathname.includes("/dashboard/ceiling-configuration") ||
// //     pathname.includes("/dashboard/global-configuration") ||
// //     pathname.includes("/dashboard/prospective-id-setup") ||
// //     pathname.includes("/dashboard/display-settings") ||
// //     pathname.includes("/dashboard/annual-holidays") ||
// //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// //     pathname.includes("/dashboard/analog-rate") ||
// //     pathname.includes("/dashboard/project-report") ||
// //     pathname.includes("/dashboard/role-rights") ||
// //     pathname.includes("/dashboard/mass-utility") ||
// //     pathname.includes("/dashboard/import-utility") ||
// //     pathname.includes("/dashboard/account-mapping") ||
// //     pathname.includes("/dashboard/projectmapping") ||
// //     pathname.includes("/dashboard/monthly-forecast") ||
// //     pathname.includes("/dashboard/create-project-budget") ||
// //     pathname.includes("/dashboard/import-opportunity") ||
// //     pathname.includes("/dashboard/manage-users") ||
// //     pathname.includes("/dashboard/manage-groups") ||
// //     pathname.includes("/dashboard/override-settings") ||
// //     pathname.includes("/dashboard/pricing") ||
// //     pathname.includes("/dashboard/financial-report") ||
// //     pathname.includes("/dashboard/account-master") ||
// //     pathname.includes("/dashboard/org-master") ||
// //     pathname.includes("/dashboard/employee-master") ||
// //     pathname.includes("/dashboard/plc-master") ||
// //     pathname.includes("/dashboard/project-master") ||
// //     pathname.includes("/dashboard/revenueFormula-master") ||
// //     pathname.includes("/dashboard/accountgroup-mapping") ||
// //     pathname.includes("/dashboard/accountgroupcode-master") ||
// //     pathname.includes("/dashboard/accounttype-master") ||
// //     pathname.includes("/dashboard/company-master") ||
// //     pathname.includes("/service-unavailable") ||
// //     pathname.includes("/dashboard/manage-data-manager") ||
// //     pathname.includes("/dashboard/manage-user-groups") ||
// //     pathname.includes("/dashboard/manage-users") ||
// //     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// //     pathname.includes("/dashboard/manage-employee") ||
// //     pathname.includes("/dashboard/manage-employee-salary") ||
// //     pathname.includes("/dashboard/manage-project-role") ||
// //     pathname.includes("/dashboard/manage-revenue") ||
// //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// //     pathname.includes("/dashboard/manage-cogs") ||
// //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
// //     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
// //     pathname.includes("/dashboard/manage-performance-obligation-type-codes") ||
// //     pathname.includes("/dashboard/manage-total-ceilings") ||
// //     pathname.includes("/dashboard/manage-burden-cost-ceilings") ||
// //     pathname.includes("/dashboard/manage-direct-cost-ceilings") ||
// //     pathname.includes("/dashboard/manage-burden-fee-overrides") ||
// //     pathname.includes("/dashboard/manage-cost-fee-overrides") ||
// //     pathname.includes("/dashboard/manage-multiplier-overrides") ||
// //     pathname.includes("/dashboard/manage-hours-ceilings") ||
// //     pathname.includes("/dashboard/manage-employee-hours-ceilings") ||
// //     pathname.includes("/dashboard/manage-vendor-hours-ceilings")

// //   );

// //   const [planningOpen, setPlanningOpen] = useState(
// //     pathname.includes("/dashboard/project-budget-status") ||
// //     // pathname.includes("/dashboard/new-business") ||
// //     pathname.includes("/dashboard/project-report") ||
// //     pathname.includes("/dashboard/mass-utility") ||
// //     pathname.includes("/dashboard/import-utility") ||
// //     pathname.includes("/dashboard/monthly-forecast") ||
// //     pathname.includes("/dashboard/pricing") ||
// //     pathname.includes("/dashboard/financial-report"),
// //   );

// //   const [configurationOpen, setConfigurationOpen] = useState(
// //     pathname.includes("/dashboard/pool-rate-tabs") ||
// //     pathname.includes("/dashboard/pool-configuration") ||
// //     pathname.includes("/dashboard/template-pool-mapping") ||
// //     pathname.includes("/dashboard/template") ||
// //     pathname.includes("/dashboard/ceiling-configuration") ||
// //     pathname.includes("/dashboard/global-configuration") ||
// //     pathname.includes("/dashboard/prospective-id-setup") ||
// //     pathname.includes("/dashboard/display-settings") ||
// //     pathname.includes("/dashboard/annual-holidays") ||
// //     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
// //     pathname.includes("/dashboard/analog-rate") ||
// //     pathname.includes("/dashboard/role-rights") ||
// //     pathname.includes("/dashboard/account-mapping") ||
// //     pathname.includes("/dashboard/projectmapping") ||
// //     pathname.includes("/dashboard/override-settings") ||
// //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// //     pathname.includes("/dashboard/prof-org-sec") ||
// //     pathname.includes("/dashboard/groups-org-sec") ||
// //     pathname.includes("/dashboard/prof-upd-org-sec"),
// //   );

// //   const [poolMappingOpen, setPoolMappingOpen] = useState(
// //     pathname.includes("/dashboard/pool-configuration") ||
// //     pathname.includes("/dashboard/template-pool-mapping"),
// //   );

// //   // NEW: New Business Budget section open state
// //   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
// //     pathname.includes("/dashboard/new-business") ||
// //     pathname.includes("/dashboard/create-project-budget") ||
// //     pathname.includes("/dashboard/import-opportunity"),
// //   );

// //   // NEW: Manage (Users & Groups) section open state
// //   const [manageSectionOpen, setManageSectionOpen] = useState(
// //     pathname.includes("/dashboard/manage-users") ||
// //     pathname.includes("/dashboard/manage-groups") ||
// //     pathname.includes("/dashboard/account-master") ||
// //     pathname.includes("/dashboard/org-master") ||
// //     pathname.includes("/dashboard/plc-master") ||
// //     pathname.includes("/dashboard/employee-master") ||
// //     pathname.includes("/dashboard/project-master") ||
// //     pathname.includes("/dashboard/revenueFormula-master") ||
// //     pathname.includes("/dashboard/accountgroup-mapping") ||
// //     pathname.includes("/dashboard/accountgroupcode-master") ||
// //     pathname.includes("/dashboard/accounttype-master") ||
// //     pathname.includes("/dashboard/company-master") ||
// //     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
// //     pathname.includes("/dashboard/manage-employee") ||
// //     pathname.includes("/dashboard/manage-employee-salary") ||
// //     pathname.includes("/dashboard/account-mass-link") ||
// //     pathname.includes("/dashboard/accounts-link") ||
// //     pathname.includes("/dashboard/manage-project-role") ||
// //     pathname.includes("/dashboard/manage-revenue") ||
// //     pathname.includes("/dashboard/manage-revenue-formulas") ||
// //     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
// //     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
// //     pathname.includes("/dashboard/manage-cogs") ||
// //     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
// //     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
// //     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
// //     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
// //     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
// //     pathname.includes("/dashboard/manage-performance-obligation-type-codes") ||
// //     pathname.includes("/dashboard/manage-total-ceilings") ||
// //     pathname.includes("/dashboard/manage-burden-cost-ceilings") ||
// //     pathname.includes("/dashboard/manage-direct-cost-ceilings") ||
// //     pathname.includes("/dashboard/manage-hours-ceilings") ||
// //     pathname.includes("/dashboard/manage-employee-hours-ceilings") ||
// //     pathname.includes("/dashboard/manage-vendor-hours-ceilings")
// //   );

// //   const [manageSettingOpen, setManageSettingOpen] = useState(
// //     pathname.includes("/dashboard/global-configuration") ||
// //     pathname.includes("/dashboard/display-settings"),
// //   );

// //   const [securityMenuOpen, setSecurityMenuOpen] = useState(
// //     pathname.includes("/dashboard/manage-user-groups") ||
// //     pathname.includes("/dashboard/manage-users") ||
// //     pathname.includes("/dashboard/user-suppression"),
// //   );

// //   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
// //     pathname.includes("/dashboard/atc-ina-org-sec") ||
// //     pathname.includes("/dashboard/prof-org-sec") ||
// //     pathname.includes("/dashboard/groups-org-sec") ||
// //     pathname.includes("/dashboard/prof-upd-org-sec"),
// //   );

// //   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //   const [selectedPage, setSelectedPage] = useState(pathname);
// //   const [currentUserRole, setCurrentUserRole] = useState(null);
// //   const [userName, setUserName] = useState("");

// //   // hover state (existing)
// //   // const [isHovered, setIsHovered] = useState(false);

// //   useEffect(() => {
// //     const userString = localStorage.getItem("currentUser");
// //     if (userString) {
// //       try {
// //         const userObj = JSON.parse(userString);
// //         setUserName(userObj.name);
// //         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
// //       } catch {
// //         setCurrentUserRole(null);
// //       }
// //     }
// //   }, []);

// //   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
// //   const handleLinkClick = (pagePath) => {
// //     setSelectedPage(pagePath);
// //     navigate(pagePath);
// //     if (isSidebarOpen) {
// //       setIsSidebarOpen(false);
// //     }
// //   };

// //   const handleCloseSidebar = () => {
// //     setSearchTerm("");
// //     setIsSidebarOpen(false);
// //   };
// //   const handleOpenSidebar = () => {
// //     setIsSidebarOpen(true);
// //   };
// //   const isExpanded = isSidebarOpen || isHovered;

// //   return (
// //     <div
// //       // onMouseOver={handleOpenSidebar}
// //       // onMouseLeave={handleCloseSidebar}
// //       className="flex min-h-screen font-inter bg-white"
// //     >
// //       {/* Mobile Toggle */}
// //       <button
// //         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
// //         onClick={() => setIsSidebarOpen(!isExpanded)}
// //       >
// //         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// //       </button>

// //       {/* Sidebar - Hover to expand */}
// //       <div
// //         onMouseEnter={() => setIsHovered(true)}
// //         onMouseLeave={() => setIsHovered(false)}
// //         className={`fixed inset-y-0 left-0 z-40 flex flex-col
// //       bg-white border-r border-gray-200
// //       transition-all duration-300 ease-in-out shadow-sm
// //       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
// //       md:translate-x-0

// //     `}
// //       >
// //         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
// //           {/* Menu / General Toggle Section */}
// //           <div
// //             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
// //             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
// //           >
// //             <div className="w-8 flex justify-center">
// //               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
// //             </div>
// //             <span
// //               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// //                 }`}
// //             >
// //               Menu
// //             </span>
// //           </div>

// //           {generalMenuOpen && (
// //             <div className="space-y-1 mt-2">
// //               {/* --- PLANNING SECTION --- */}
// //               <div>
// //                 <div
// //                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
// //                 >
// //                   <input
// //                     type="text"
// //                     placeholder="Search..."
// //                     value={searchTerm}
// //                     onChange={(e) =>
// //                       setSearchTerm(e.target.value.toLowerCase())
// //                     }
// //                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
// //                   />
// //                 </div>
// //                 {!searchTerm && (
// //                   <div
// //                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                     onClick={() => setPlanningOpen(!planningOpen)}
// //                   >
// //                     <div className="flex items-center">
// //                       <div className="w-8 flex justify-center">
// //                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                       </div>
// //                       <span
// //                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// //                           }`}
// //                       >
// //                         Planning
// //                       </span>
// //                     </div>
// //                     {isExpanded &&
// //                       (planningOpen ? (
// //                         <ChevronDown size={14} />
// //                       ) : (
// //                         <ChevronRight size={14} />
// //                       ))}
// //                   </div>
// //                 )}

// //                 {(planningOpen || searchTerm) && isExpanded && (
// //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                     <NavItem
// //                       label="Project Planning"
// //                       path="/dashboard/project-budget-status"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                       searchTerm={searchTerm}
// //                     />
// //                     {canView("projectReport") && !isHidden("projectReport") && (
// //                       <>
// //                         <NavItem
// //                           label="Reporting"
// //                           path="/dashboard/project-report"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       </>
// //                     )}

// //                     {canView("massUtility") && !isHidden("massUtility") && (
// //                       <NavItem
// //                         label="Mass Utility"
// //                         path="/dashboard/mass-utility"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                     )}
// //                     {canView("pricing") && !isHidden("pricing") && (
// //                       <NavItem
// //                         label="Pricing"
// //                         path="/dashboard/pricing"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                         searchTerm={searchTerm}
// //                       />
// //                     )}

// //                     {canView("financialReport") &&
// //                       !isHidden("financialReport") && (
// //                         <NavItem
// //                           label="Financial Report"
// //                           path="/dashboard/financial-report"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       )}
// //                   </div>
// //                 )}
// //               </div>
// //               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
// //               {/* {currentUserRole === "admin" && ( */}
// //               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
// //                 (canView("transferUtility") &&
// //                   !isHidden("manageNewBusiness")) ||
// //                 (canView("impOpportunity") &&
// //                   !isHidden("transferUtility"))) && (
// //                   <div>
// //                     {!searchTerm && (
// //                       <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                         onClick={() =>
// //                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
// //                         }
// //                       >
// //                         <div className="flex items-center">
// //                           <div className="w-8 flex justify-center">
// //                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                           </div>
// //                           <span
// //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// //                               }`}
// //                           >
// //                             New Business Budget
// //                           </span>
// //                         </div>
// //                         {isExpanded &&
// //                           (newBusinessSectionOpen ? (
// //                             <ChevronDown size={14} />
// //                           ) : (
// //                             <ChevronRight size={14} />
// //                           ))}
// //                       </div>
// //                     )}

// //                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
// //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                         {canView("impOpportunity") &&
// //                           !isHidden("impOpportunity") && (
// //                             <>
// //                               <NavItem
// //                                 label="Import Opportunity"
// //                                 path="/dashboard/import-opportunity"
// //                                 selected={selectedPage}
// //                                 onClick={handleLinkClick}
// //                                 searchTerm={searchTerm}
// //                               />
// //                             </>
// //                           )}
// //                         {canView("manageNewBusiness") &&
// //                           !isHidden("manageNewBusiness") && (
// //                             <NavItem
// //                               label="Manage New Business"
// //                               path="/dashboard/new-business"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {canView("transferUtility") &&
// //                           !isHidden("transferUtility") && (
// //                             <NavItem
// //                               label="Transfer Project Budget"
// //                               path="/dashboard/create-project-budget"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               {/* )} */}
// //               {((canView("manageGroups") && !isHidden("manageGroups")) ||
// //                 (canView("manageUser") && !isHidden("manageUser"))) && (
// //                   //  ||
// //                   // (!isHidden("accountMaster")) ||
// //                   // (!isHidden("orgMaster")) ||
// //                   // (!isHidden("employeeMaster"))
// //                   <div>
// //                     {!searchTerm && (
// //                       <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
// //                       >
// //                         <div className="flex items-center">
// //                           <div className="w-8 flex justify-center">
// //                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                           </div>
// //                           <span
// //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// //                               }`}
// //                           >
// //                             Manage
// //                           </span>
// //                         </div>
// //                         {isExpanded &&
// //                           (manageSectionOpen ? (
// //                             <ChevronDown size={14} />
// //                           ) : (
// //                             <ChevronRight size={14} />
// //                           ))}
// //                       </div>
// //                     )}

// //                     {(manageSectionOpen || searchTerm) && isExpanded && (
// //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                         {canView("manageGroups") && !isHidden("manageGroups") && (
// //                           <NavItem
// //                             label="Manage Groups"
// //                             path="/dashboard/manage-groups"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("manageUser") && !isHidden("manageUser") && (
// //                           <NavItem
// //                             label="Manage Users"
// //                             path="/dashboard/manage-users"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
// //                         <NavItem
// //                           label="Manage Accounts"
// //                           path="/dashboard/account-master"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}
// //                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
// //                         <NavItem
// //                           label="Manage Orgs"
// //                           path="/dashboard/org-master"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}
// //                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
// //                         <NavItem
// //                           label="Manage Employees"
// //                           path="/dashboard/employee-master"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}
// //                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
// //                         <NavItem
// //                           label="Manage PLCs"
// //                           path="/dashboard/plc-master"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}
// //                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
// //                         <NavItem
// //                           label="Manage Projects"
// //                           path="/dashboard/project-master"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}

// //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// //                         <NavItem
// //                           label="Manage Revenue Formulas"
// //                           path="/dashboard/revenueFormula-master"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}
// //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// //                         <NavItem
// //                           label="Account Group Table"
// //                           path="/dashboard/accountgroup-mapping"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}
// //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// //                         <NavItem
// //                           label="Manage Account Group Code"
// //                           path="/dashboard/accountgroupcode-master"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}
// //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// //                         <NavItem
// //                           label="Manage Account Types"
// //                           path="/dashboard/accounttype-master"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}
// //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// //                         <NavItem
// //                           label="Manage Company ID"
// //                           path="/dashboard/company-master"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}
// //                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
// //                         <NavItem
// //                           label="Manage Data"
// //                           path="/dashboard/manage-data-manager"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                         {/* )} */}

// //                         {canView("manageCompany") && !isHidden("manageCompany") && (
// //                           <NavItem
// //                             label="Manage Company"
// //                             path="/dashboard/manage-company"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}

// //                         <NavItem
// //                           label="Manage Reference"
// //                           path="/dashboard/manage-reference"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Employee"
// //                           path="/dashboard/manage-employee"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Employee Salary"
// //                           path="/dashboard/manage-employee-salary"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Account Mass Link"
// //                           path="/dashboard/account-mass-link"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Accounts Link"
// //                           path="/dashboard/accounts-link"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Project Roles"
// //                           path="/dashboard/manage-project-role"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Revenue"
// //                           path="/dashboard/manage-revenue"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Revenue Formulas"
// //                           path="/dashboard/manage-revenue-formulas"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Print Project Revenue & Billing Formulas"
// //                           path="/dashboard/print-revenue-billing-formulas"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Rate Sequence Orders"
// //                           path="/dashboard/manage-rate-sequence-orders"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Cost of Goods Sold"
// //                           path="/dashboard/manage-cogs"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Alternate Project Revenue Profiles"
// //                           path="/dashboard/manage-alternate-project-revenue-profiles"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Alternate Revenue Profile Prior Year History"
// //                           path="/dashboard/manage-alternate-revenue-profile-prior-year-history"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Project Revenue Calculation Value History"
// //                           path="/dashboard/manage-project-revenue-calculation-value-history"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Revenue Evaluation Info and Disclosures"
// //                           path="/dashboard/manage-revenue-evaluation-info-and-disclosures"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Revenue Evaluation Status Codes"
// //                           path="/dashboard/manage-revenue-evaluation-status-codes"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Performance Obligation Type Codes"
// //                           path="/dashboard/manage-performance-obligation-type-codes"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Total Ceilings"
// //                           path="/dashboard/manage-total-ceilings"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Burden Cost Ceilings"
// //                           path="/dashboard/manage-burden-cost-ceilings"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Direct Cost Ceilings"
// //                           path="/dashboard/manage-direct-cost-ceilings"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Burden Fee Overrides"
// //                           path="/dashboard/manage-burden-fee-overrides"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Cost Fee Overrides"
// //                           path="/dashboard/manage-cost-fee-overrides"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Multiplier Overrides"
// //                           path="/dashboard/manage-multiplier-overrides"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Hours Ceilings"
// //                           path="/dashboard/manage-hours-ceilings"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Employee Hours Ceilings"
// //                           path="/dashboard/manage-employee-hours-ceilings"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />

// //                         <NavItem
// //                           label="Manage Vendor Hours Ceilings"
// //                           path="/dashboard/manage-vendor-hours-ceilings"
// //                           selected={selectedPage}
// //                           onClick={handleLinkClick}
// //                           searchTerm={searchTerm}
// //                         />
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               {/* --- CONFIGURATION SECTION --- */}
// //               {((canView("globalConfiguration") &&
// //                 !isHidden("globalConfiguration")) ||
// //                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
// //                 (canView("projectOrgSecurity") &&
// //                   !isHidden("projectOrgSecurity")) ||
// //                 (canView("accountMapping") && !isHidden("accountMapping")) ||
// //                 (canView("analogRate") && !isHidden("analogRate")) ||
// //                 (canView("ceilingConfiguration") &&
// //                   !isHidden("ceilingConfiguration")) ||
// //                 (canView("fiscalYearPeriods") &&
// //                   !isHidden("fiscalYearPeriods")) ||
// //                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
// //                 (canView("prospectiveIdSetup") &&
// //                   !isHidden("prospectiveIdSetup")) ||
// //                 (canView("roleRights") && !isHidden("roleRights"))) && (
// //                   <div>
// //                     {!searchTerm && (
// //                       <div
// //                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
// //                         onClick={() => setConfigurationOpen(!configurationOpen)}
// //                       >
// //                         <div className="flex items-center">
// //                           <div className="w-8 flex justify-center">
// //                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
// //                           </div>
// //                           <span
// //                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// //                               }`}
// //                           >
// //                             Settings
// //                           </span>
// //                         </div>
// //                         {isExpanded &&
// //                           (configurationOpen ? (
// //                             <ChevronDown size={14} />
// //                           ) : (
// //                             <ChevronRight size={14} />
// //                           ))}
// //                       </div>
// //                     )}

// //                     {(configurationOpen || searchTerm) && isExpanded && (
// //                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                         {canView("globalConfiguration") &&
// //                           !isHidden("globalConfiguration") && (
// //                             <NavItem
// //                               label="Configuration Setting"
// //                               path="/dashboard/global-configuration"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
// //                           <NavItem
// //                             label="Burden Setup"
// //                             path="/dashboard/pool-rate-tabs"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("projectOrgSecurity") &&
// //                           !isHidden("projectOrgSecurity") && (
// //                             <NavItem
// //                               label="Project Org Security"
// //                               path="/dashboard/projectmapping"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {canView("accountMapping") &&
// //                           !isHidden("accountMapping") && (
// //                             <NavItem
// //                               label="Account Mapping"
// //                               path="/dashboard/account-mapping"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {canView("analogRate") && !isHidden("analogRate") && (
// //                           <NavItem
// //                             label="NBIs Analogous Rate"
// //                             path="/dashboard/analog-rate"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                             searchTerm={searchTerm}
// //                           />
// //                         )}
// //                         {canView("ceilingConfiguration") &&
// //                           !isHidden("ceilingConfiguration") && (
// //                             <NavItem
// //                               label="Ceiling Configuration"
// //                               path="/dashboard/ceiling-configuration"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {canView("fiscalYearPeriods") &&
// //                           !isHidden("fiscalYearPeriods") && (
// //                             <NavItem
// //                               label="Fiscal Year Periods"
// //                               path="/dashboard/maintain-fiscal-year-periods"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {canView("annualHolidays") &&
// //                           !isHidden("annualHolidays") && (
// //                             <NavItem
// //                               label="Annual Holidays"
// //                               path="/dashboard/annual-holidays"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {canView("prospectiveIdSetup") &&
// //                           !isHidden("prospectiveIdSetup") && (
// //                             <NavItem
// //                               label="Prospective ID Setup"
// //                               path="/dashboard/prospective-id-setup"
// //                               selected={selectedPage}
// //                               onClick={handleLinkClick}
// //                               searchTerm={searchTerm}
// //                             />
// //                           )}
// //                         {canView("roleRights") && !isHidden("roleRights") && (
// //                           <NavItem
// //                             label="Rights Settings"
// //                             path="/dashboard/role-rights"
// //                             selected={selectedPage}
// //                             onClick={handleLinkClick}
// //                           />
// //                         )}
// //                         {/* <NavItem
// //                         label="Override Configuration"
// //                         path="/dashboard/override-settings"
// //                         selected={selectedPage}
// //                         onClick={handleLinkClick}
// //                       /> */}
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               <div>
// //                 <div
// //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
// //                 >
// //                   <div className="flex items-center">
// //                     <div className="w-8 flex justify-center">
// //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                     </div>
// //                     <span
// //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// //                     >
// //                       System Security
// //                     </span>
// //                   </div>
// //                   {isExpanded &&
// //                     (securityMenuOpen ? (
// //                       <ChevronDown size={14} />
// //                     ) : (
// //                       <ChevronRight size={14} />
// //                     ))}
// //                 </div>

// //                 {securityMenuOpen && isExpanded && (
// //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// //                     <NavItem
// //                       label="Manage User Groups"
// //                       path="/dashboard/manage-user-groups"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                     />
// //                     <NavItem
// //                       label="Manage User"
// //                       path="/dashboard/manage-users"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                     />
// //                     <NavItem
// //                       label="Manage User Suppression"
// //                       path="/dashboard/user-suppression"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                     />
// //                   </div>
// //                 )}
// //               </div>

// //               <div>
// //                 <div
// //                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
// //                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
// //                 >
// //                   <div className="flex items-center">
// //                     <div className="w-8 flex justify-center">
// //                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
// //                     </div>
// //                     <span
// //                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
// //                     >
// //                       Organizational Security
// //                     </span>
// //                   </div>
// //                   {isExpanded &&
// //                     (securityOrgMenuOpen ? (
// //                       <ChevronDown size={14} />
// //                     ) : (
// //                       <ChevronRight size={14} />
// //                     ))}
// //                 </div>

// //                 {securityOrgMenuOpen && isExpanded && (
// //                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
// //                     {/* Passing the state 'manageGroups' to the component via the path or state */}
// //                     <NavItem
// //                       label="Activate/Inactivate Organization Security by Module"
// //                       path="/dashboard/atc-ina-org-sec"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                     />
// //                     <NavItem
// //                       label="Manage Organization Security Profiles"
// //                       path="/dashboard/prof-org-sec"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                     />
// //                     <NavItem
// //                       label="Manage Organization Security Groups"
// //                       path="/dashboard/groups-org-sec"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                     />
// //                     <NavItem
// //                       label="Update Organization Security Profiles"
// //                       path="/dashboard/prof-upd-org-sec"
// //                       selected={selectedPage}
// //                       onClick={handleLinkClick}
// //                     />
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Footer Version */}
// //         <div
// //           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
// //             }`}
// //         >
// //           <div className="text-[10px] text-gray-400 font-mono select-none">
// //             v{appVersion}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Background Overlay for mobile */}
// //       {/* {isExpanded  && (
// //         <div
// //           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
// //           onClick={handleCloseSidebar}
// //         ></div>
// //       )} */}
// //     </div>
// //   );
// // };

// // const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
// //   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
// //     return null;
// //   }

// //   return (
// //     <Link
// //       to={path}
// //       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
// //           ? "text-white font-semibold"
// //           : "text-gray-500 hover:text-gray-900"
// //         }`}
// //       style={{
// //         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
// //       }}
// //       onClick={(e) => {
// //         e.preventDefault();
// //         onClick(path);
// //       }}
// //     >
// //       {label}
// //     </Link>
// //   );
// // };

// // export default NavigationSidebar;

// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   X,
//   ChevronDown,
//   ChevronRight,
//   Plus,
//   Minus,
//   BarChart2,
//   Layers,
//   FileText,
//   Settings,
//   BriefcaseBusiness,
//   SlidersHorizontal,
//   Users, // new icon for New Business Budget section
// } from "lucide-react";

// const NavigationSidebar = ({
//   setIsHovered,
//   isHovered,
//   setIsSidebarOpen,
//   isSidebarOpen,
//   canView,
// }) => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   const [onHoverChange, setOnhoverChange] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");

//   const HIDDEN_FEATURES =
//     import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
//   const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

//   // --- ALL ORIGINAL LOGIC PRESERVED ---
//   const [generalMenuOpen, setGeneralMenuOpen] = useState(
//     pathname.includes("/dashboard/project-budget-status") ||
//     pathname.includes("/dashboard/new-business") ||
//     pathname.includes("/dashboard/pool-rate-tabs") ||
//     pathname.includes("/dashboard/pool-configuration") ||
//     pathname.includes("/dashboard/template-pool-mapping") ||
//     pathname.includes("/dashboard/template") ||
//     pathname.includes("/dashboard/ceiling-configuration") ||
//     pathname.includes("/dashboard/global-configuration") ||
//     pathname.includes("/dashboard/prospective-id-setup") ||
//     pathname.includes("/dashboard/display-settings") ||
//     pathname.includes("/dashboard/annual-holidays") ||
//     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
//     pathname.includes("/dashboard/analog-rate") ||
//     pathname.includes("/dashboard/project-report") ||
//     pathname.includes("/dashboard/role-rights") ||
//     pathname.includes("/dashboard/mass-utility") ||
//     pathname.includes("/dashboard/import-utility") ||
//     pathname.includes("/dashboard/account-mapping") ||
//     pathname.includes("/dashboard/projectmapping") ||
//     pathname.includes("/dashboard/monthly-forecast") ||
//     pathname.includes("/dashboard/create-project-budget") ||
//     pathname.includes("/dashboard/import-opportunity") ||
//     pathname.includes("/dashboard/manage-users") ||
//     pathname.includes("/dashboard/manage-groups") ||
//     pathname.includes("/dashboard/override-settings") ||
//     pathname.includes("/dashboard/pricing") ||
//     pathname.includes("/dashboard/financial-report") ||
//     pathname.includes("/dashboard/account-master") ||
//     pathname.includes("/dashboard/org-master") ||
//     pathname.includes("/dashboard/employee-master") ||
//     pathname.includes("/dashboard/plc-master") ||
//     pathname.includes("/dashboard/project-master") ||
//     pathname.includes("/dashboard/revenueFormula-master") ||
//     pathname.includes("/dashboard/accountgroup-mapping") ||
//     pathname.includes("/dashboard/accountgroupcode-master") ||
//     pathname.includes("/dashboard/accounttype-master") ||
//     pathname.includes("/dashboard/company-master") ||
//     pathname.includes("/service-unavailable") ||
//     pathname.includes("/dashboard/manage-data-manager") ||
//     pathname.includes("/dashboard/manage-user-groups") ||
//     pathname.includes("/dashboard/manage-users") ||
//     pathname.includes("/dashboard/user-suppression") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
//     pathname.includes("/dashboard/manage-employee") ||
//     pathname.includes("/dashboard/manage-employee-salary") ||
//     pathname.includes("/dashboard/manage-project-role") ||
//     pathname.includes("/dashboard/manage-revenue") ||
//     pathname.includes("/dashboard/manage-revenue-formulas") ||
//     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
//     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
//     pathname.includes("/dashboard/manage-cogs") ||
//     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
//     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
//     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
//     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
//     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
//     pathname.includes("/dashboard/manage-performance-obligation-type-codes") ||
//     pathname.includes("/dashboard/manage-total-ceilings") ||
//     pathname.includes("/dashboard/manage-burden-cost-ceilings") ||
//     pathname.includes("/dashboard/manage-direct-cost-ceilings") ||
//     pathname.includes("/dashboard/manage-burden-fee-overrides") ||
//     pathname.includes("/dashboard/manage-cost-fee-overrides") ||
//     pathname.includes("/dashboard/manage-multiplier-overrides") ||
//     pathname.includes("/dashboard/manage-hours-ceilings") ||
//     pathname.includes("/dashboard/manage-employee-hours-ceilings") ||
//     pathname.includes("/dashboard/manage-vendor-hours-ceilings") ||
//     pathname.includes("/dashboard/manage-plc") ||
//     pathname.includes("/dashboard/link-plc-to-projects") ||
//     pathname.includes("/dashboard/link-plc-rates-to-projects")

//   );

//   const [planningOpen, setPlanningOpen] = useState(
//     pathname.includes("/dashboard/project-budget-status") ||
//     // pathname.includes("/dashboard/new-business") ||
//     pathname.includes("/dashboard/project-report") ||
//     pathname.includes("/dashboard/mass-utility") ||
//     pathname.includes("/dashboard/import-utility") ||
//     pathname.includes("/dashboard/monthly-forecast") ||
//     pathname.includes("/dashboard/pricing") ||
//     pathname.includes("/dashboard/financial-report"),
//   );

//   const [configurationOpen, setConfigurationOpen] = useState(
//     pathname.includes("/dashboard/pool-rate-tabs") ||
//     pathname.includes("/dashboard/pool-configuration") ||
//     pathname.includes("/dashboard/template-pool-mapping") ||
//     pathname.includes("/dashboard/template") ||
//     pathname.includes("/dashboard/ceiling-configuration") ||
//     pathname.includes("/dashboard/global-configuration") ||
//     pathname.includes("/dashboard/prospective-id-setup") ||
//     pathname.includes("/dashboard/display-settings") ||
//     pathname.includes("/dashboard/annual-holidays") ||
//     pathname.includes("/dashboard/maintain-fiscal-year-periods") ||
//     pathname.includes("/dashboard/analog-rate") ||
//     pathname.includes("/dashboard/role-rights") ||
//     pathname.includes("/dashboard/account-mapping") ||
//     pathname.includes("/dashboard/projectmapping") ||
//     pathname.includes("/dashboard/override-settings") ||
//     pathname.includes("/dashboard/atc-ina-org-sec") ||
//     pathname.includes("/dashboard/prof-org-sec") ||
//     pathname.includes("/dashboard/groups-org-sec") ||
//     pathname.includes("/dashboard/prof-upd-org-sec"),
//   );

//   const [poolMappingOpen, setPoolMappingOpen] = useState(
//     pathname.includes("/dashboard/pool-configuration") ||
//     pathname.includes("/dashboard/template-pool-mapping"),
//   );

//   // NEW: New Business Budget section open state
//   const [newBusinessSectionOpen, setNewBusinessSectionOpen] = useState(
//     pathname.includes("/dashboard/new-business") ||
//     pathname.includes("/dashboard/create-project-budget") ||
//     pathname.includes("/dashboard/import-opportunity"),
//   );

//   // NEW: Manage (Users & Groups) section open state
//   const [manageSectionOpen, setManageSectionOpen] = useState(
//     pathname.includes("/dashboard/manage-users") ||
//     pathname.includes("/dashboard/manage-groups") ||
//     pathname.includes("/dashboard/account-master") ||
//     pathname.includes("/dashboard/org-master") ||
//     pathname.includes("/dashboard/plc-master") ||
//     pathname.includes("/dashboard/employee-master") ||
//     pathname.includes("/dashboard/project-master") ||
//     pathname.includes("/dashboard/revenueFormula-master") ||
//     pathname.includes("/dashboard/accountgroup-mapping") ||
//     pathname.includes("/dashboard/accountgroupcode-master") ||
//     pathname.includes("/dashboard/accounttype-master") ||
//     pathname.includes("/dashboard/company-master") ||
//     pathname.includes("/dashboard/manage-data-manager") || pathname.includes("/dashboard/manage-company") || pathname.includes("/dashboard/manage-reference") ||
//     pathname.includes("/dashboard/manage-employee") ||
//     pathname.includes("/dashboard/manage-employee-salary") ||
//     pathname.includes("/dashboard/account-mass-link") ||
//     pathname.includes("/dashboard/accounts-link") ||
//     pathname.includes("/dashboard/manage-project-role") ||
//     pathname.includes("/dashboard/manage-revenue") ||
//     pathname.includes("/dashboard/manage-revenue-formulas") ||
//     pathname.includes("/dashboard/print-revenue-billing-formulas") ||
//     pathname.includes("/dashboard/manage-rate-sequence-orders") ||
//     pathname.includes("/dashboard/manage-cogs") ||
//     pathname.includes("/dashboard/manage-alternate-project-revenue-profiles") ||
//     pathname.includes("/dashboard/manage-alternate-revenue-profile-prior-year-history") ||
//     pathname.includes("/dashboard/manage-project-revenue-calculation-value-history") ||
//     pathname.includes("/dashboard/manage-revenue-evaluation-info-and-disclosures") ||
//     pathname.includes("/dashboard/manage-revenue-evaluation-status-codes") ||
//     pathname.includes("/dashboard/manage-performance-obligation-type-codes") ||
//     pathname.includes("/dashboard/manage-total-ceilings") ||
//     pathname.includes("/dashboard/manage-burden-cost-ceilings") ||
//     pathname.includes("/dashboard/manage-direct-cost-ceilings") ||
//     pathname.includes("/dashboard/manage-hours-ceilings") ||
//     pathname.includes("/dashboard/manage-employee-hours-ceilings") ||
//     pathname.includes("/dashboard/manage-vendor-hours-ceilings") ||
//     pathname.includes("/dashboard/manage-plc") ||
//     pathname.includes("/dashboard/link-plc-to-projects") ||
//     pathname.includes("/dashboard/link-plc-rates-to-projects")
//   );

//   const [manageSettingOpen, setManageSettingOpen] = useState(
//     pathname.includes("/dashboard/global-configuration") ||
//     pathname.includes("/dashboard/display-settings"),
//   );

//   const [securityMenuOpen, setSecurityMenuOpen] = useState(
//     pathname.includes("/dashboard/manage-user-groups") ||
//     pathname.includes("/dashboard/manage-users") ||
//     pathname.includes("/dashboard/user-suppression"),
//   );

//   const [securityOrgMenuOpen, setSecurityOrgMenuOpen] = useState(
//     pathname.includes("/dashboard/atc-ina-org-sec") ||
//     pathname.includes("/dashboard/prof-org-sec") ||
//     pathname.includes("/dashboard/groups-org-sec") ||
//     pathname.includes("/dashboard/prof-upd-org-sec"),
//   );

//   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [selectedPage, setSelectedPage] = useState(pathname);
//   const [currentUserRole, setCurrentUserRole] = useState(null);
//   const [userName, setUserName] = useState("");

//   // hover state (existing)
//   // const [isHovered, setIsHovered] = useState(false);

//   useEffect(() => {
//     const userString = localStorage.getItem("currentUser");
//     if (userString) {
//       try {
//         const userObj = JSON.parse(userString);
//         setUserName(userObj.name);
//         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
//       } catch {
//         setCurrentUserRole(null);
//       }
//     }
//   }, []);

//   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
//   const handleLinkClick = (pagePath) => {
//     setSelectedPage(pagePath);
//     navigate(pagePath);
//     if (isSidebarOpen) {
//       setIsSidebarOpen(false);
//     }
//   };

//   const handleCloseSidebar = () => {
//     setSearchTerm("");
//     setIsSidebarOpen(false);
//   };
//   const handleOpenSidebar = () => {
//     setIsSidebarOpen(true);
//   };
//   const isExpanded = isSidebarOpen || isHovered;

//   return (
//     <div
//       // onMouseOver={handleOpenSidebar}
//       // onMouseLeave={handleCloseSidebar}
//       className="flex min-h-screen font-inter bg-white"
//     >
//       {/* Mobile Toggle */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-1 rounded-md"
//         onClick={() => setIsSidebarOpen(!isExpanded)}
//       >
//         {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//       </button>

//       {/* Sidebar - Hover to expand */}
//       <div
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         className={`fixed inset-y-0 left-0 z-40 flex flex-col
//       bg-white border-r border-gray-200
//       transition-all duration-300 ease-in-out shadow-sm
//       ${isExpanded ? "translate-x-0 w-55" : "-translate-x-full w-14"}
//       md:translate-x-0

//     `}
//       >
//         <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 ">
//           {/* Menu / General Toggle Section */}
//           <div
//             className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition`}
//             onClick={() => setGeneralMenuOpen(!generalMenuOpen)}
//           >
//             <div className="w-8 flex justify-center">
//               {generalMenuOpen ? <Minus size={16} /> : <Plus size={16} />}
//             </div>
//             <span
//               className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
//                 }`}
//             >
//               Menu
//             </span>
//           </div>

//           {generalMenuOpen && (
//             <div className="space-y-1 mt-2">
//               {/* --- PLANNING SECTION --- */}
//               <div>
//                 <div
//                   className={`px-3 pt-4 pb-2 ${isExpanded ? "block" : "hidden"}`}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) =>
//                       setSearchTerm(e.target.value.toLowerCase())
//                     }
//                     className="border border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17414d] w-full  bg-white shadow-inner"
//                   />
//                 </div>
//                 {!searchTerm && (
//                   <div
//                     className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                     onClick={() => setPlanningOpen(!planningOpen)}
//                   >
//                     <div className="flex items-center">
//                       <div className="w-8 flex justify-center">
//                         <BarChart2 className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                       </div>
//                       <span
//                         className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
//                           }`}
//                       >
//                         Planning
//                       </span>
//                     </div>
//                     {isExpanded &&
//                       (planningOpen ? (
//                         <ChevronDown size={14} />
//                       ) : (
//                         <ChevronRight size={14} />
//                       ))}
//                   </div>
//                 )}

//                 {(planningOpen || searchTerm) && isExpanded && (
//                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                     <NavItem
//                       label="Project Planning"
//                       path="/dashboard/project-budget-status"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                       searchTerm={searchTerm}
//                     />
//                     {canView("projectReport") && !isHidden("projectReport") && (
//                       <>
//                         <NavItem
//                           label="Reporting"
//                           path="/dashboard/project-report"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       </>
//                     )}

//                     {canView("massUtility") && !isHidden("massUtility") && (
//                       <NavItem
//                         label="Mass Utility"
//                         path="/dashboard/mass-utility"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}
//                     {canView("pricing") && !isHidden("pricing") && (
//                       <NavItem
//                         label="Pricing"
//                         path="/dashboard/pricing"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                         searchTerm={searchTerm}
//                       />
//                     )}

//                     {canView("financialReport") &&
//                       !isHidden("financialReport") && (
//                         <NavItem
//                           label="Financial Report"
//                           path="/dashboard/financial-report"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       )}
//                   </div>
//                 )}
//               </div>
//               {/* --- NEW BUSINESS BUDGET SECTION (NEW) --- */}
//               {/* {currentUserRole === "admin" && ( */}
//               {((canView("manageNewBusiness") && !isHidden("impOpportunity")) ||
//                 (canView("transferUtility") &&
//                   !isHidden("manageNewBusiness")) ||
//                 (canView("impOpportunity") &&
//                   !isHidden("transferUtility"))) && (
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                         onClick={() =>
//                           setNewBusinessSectionOpen(!newBusinessSectionOpen)
//                         }
//                       >
//                         <div className="flex items-center">
//                           <div className="w-8 flex justify-center">
//                             <BriefcaseBusiness className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                           </div>
//                           <span
//                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
//                               }`}
//                           >
//                             New Business Budget
//                           </span>
//                         </div>
//                         {isExpanded &&
//                           (newBusinessSectionOpen ? (
//                             <ChevronDown size={14} />
//                           ) : (
//                             <ChevronRight size={14} />
//                           ))}
//                       </div>
//                     )}

//                     {(newBusinessSectionOpen || searchTerm) && isExpanded && (
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                         {canView("impOpportunity") &&
//                           !isHidden("impOpportunity") && (
//                             <>
//                               <NavItem
//                                 label="Import Opportunity"
//                                 path="/dashboard/import-opportunity"
//                                 selected={selectedPage}
//                                 onClick={handleLinkClick}
//                                 searchTerm={searchTerm}
//                               />
//                             </>
//                           )}
//                         {canView("manageNewBusiness") &&
//                           !isHidden("manageNewBusiness") && (
//                             <NavItem
//                               label="Manage New Business"
//                               path="/dashboard/new-business"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {canView("transferUtility") &&
//                           !isHidden("transferUtility") && (
//                             <NavItem
//                               label="Transfer Project Budget"
//                               path="/dashboard/create-project-budget"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               {/* )} */}
//               {((canView("manageGroups") && !isHidden("manageGroups")) ||
//                 (canView("manageUser") && !isHidden("manageUser"))) && (
//                   //  ||
//                   // (!isHidden("accountMaster")) ||
//                   // (!isHidden("orgMaster")) ||
//                   // (!isHidden("employeeMaster"))
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                         onClick={() => setManageSectionOpen(!manageSectionOpen)}
//                       >
//                         <div className="flex items-center">
//                           <div className="w-8 flex justify-center">
//                             <Users className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                           </div>
//                           <span
//                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
//                               }`}
//                           >
//                             Manage
//                           </span>
//                         </div>
//                         {isExpanded &&
//                           (manageSectionOpen ? (
//                             <ChevronDown size={14} />
//                           ) : (
//                             <ChevronRight size={14} />
//                           ))}
//                       </div>
//                     )}

//                     {(manageSectionOpen || searchTerm) && isExpanded && (
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                         {canView("manageGroups") && !isHidden("manageGroups") && (
//                           <NavItem
//                             label="Manage Groups"
//                             path="/dashboard/manage-groups"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("manageUser") && !isHidden("manageUser") && (
//                           <NavItem
//                             label="Manage Users"
//                             path="/dashboard/manage-users"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {/* {canView("accountMaster") && !isHidden("accountMaster") && ( */}
//                         <NavItem
//                           label="Manage Accounts"
//                           path="/dashboard/account-master"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}
//                         {/* {canView("orgMaster") &&  !isHidden("orgMaster") && ( */}
//                         <NavItem
//                           label="Manage Orgs"
//                           path="/dashboard/org-master"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}
//                         {/* {canView("employeeMaster") && !isHidden("employeeMaster") &&( */}
//                         <NavItem
//                           label="Manage Employees"
//                           path="/dashboard/employee-master"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}
//                         {/* {canView("plcMaster") && !isHidden("plcMaster") &&( */}
//                         <NavItem
//                           label="Manage PLCs"
//                           path="/dashboard/plc-master"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}
//                         {/* {canView("projectMaster") && !isHidden("projectMaster") &&( */}
//                         <NavItem
//                           label="Manage Projects"
//                           path="/dashboard/project-master"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}

//                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
//                         <NavItem
//                           label="Manage Revenue Formulas"
//                           path="/dashboard/revenueFormula-master"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}
//                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
//                         <NavItem
//                           label="Account Group Table"
//                           path="/dashboard/accountgroup-mapping"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}
//                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
//                         <NavItem
//                           label="Manage Account Group Code"
//                           path="/dashboard/accountgroupcode-master"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}
//                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
//                         <NavItem
//                           label="Manage Account Types"
//                           path="/dashboard/accounttype-master"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}
//                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
//                         <NavItem
//                           label="Manage Company ID"
//                           path="/dashboard/company-master"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}
//                         {/* {canView("revenueFormulaMaster") && !isHidden("revenueFormulaMaster") &&( */}
//                         <NavItem
//                           label="Manage Data"
//                           path="/dashboard/manage-data-manager"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                         {/* )} */}

//                         {canView("manageCompany") && !isHidden("manageCompany") && (
//                           <NavItem
//                             label="Manage Company"
//                             path="/dashboard/manage-company"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}

//                         <NavItem
//                           label="Manage Reference"
//                           path="/dashboard/manage-reference"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Employee"
//                           path="/dashboard/manage-employee"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Employee Salary"
//                           path="/dashboard/manage-employee-salary"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Account Mass Link"
//                           path="/dashboard/account-mass-link"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Accounts Link"
//                           path="/dashboard/accounts-link"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Project Roles"
//                           path="/dashboard/manage-project-role"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Revenue"
//                           path="/dashboard/manage-revenue"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Revenue Formulas"
//                           path="/dashboard/manage-revenue-formulas"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Print Project Revenue & Billing Formulas"
//                           path="/dashboard/print-revenue-billing-formulas"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Rate Sequence Orders"
//                           path="/dashboard/manage-rate-sequence-orders"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Cost of Goods Sold"
//                           path="/dashboard/manage-cogs"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Alternate Project Revenue Profiles"
//                           path="/dashboard/manage-alternate-project-revenue-profiles"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Alternate Revenue Profile Prior Year History"
//                           path="/dashboard/manage-alternate-revenue-profile-prior-year-history"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Project Revenue Calculation Value History"
//                           path="/dashboard/manage-project-revenue-calculation-value-history"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Revenue Evaluation Info and Disclosures"
//                           path="/dashboard/manage-revenue-evaluation-info-and-disclosures"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Revenue Evaluation Status Codes"
//                           path="/dashboard/manage-revenue-evaluation-status-codes"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Performance Obligation Type Codes"
//                           path="/dashboard/manage-performance-obligation-type-codes"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Total Ceilings"
//                           path="/dashboard/manage-total-ceilings"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Burden Cost Ceilings"
//                           path="/dashboard/manage-burden-cost-ceilings"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Direct Cost Ceilings"
//                           path="/dashboard/manage-direct-cost-ceilings"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Burden Fee Overrides"
//                           path="/dashboard/manage-burden-fee-overrides"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Cost Fee Overrides"
//                           path="/dashboard/manage-cost-fee-overrides"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Multiplier Overrides"
//                           path="/dashboard/manage-multiplier-overrides"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Hours Ceilings"
//                           path="/dashboard/manage-hours-ceilings"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Employee Hours Ceilings"
//                           path="/dashboard/manage-employee-hours-ceilings"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Manage Vendor Hours Ceilings"
//                           path="/dashboard/manage-vendor-hours-ceilings"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Project Labor Categories (PLC)"
//                           path="/dashboard/manage-plc"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Link PLCs to Projects"
//                           path="/dashboard/link-plc-to-projects"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />

//                         <NavItem
//                           label="Link PLC Rates to Projects"
//                           path="/dashboard/link-plc-rates-to-projects"
//                           selected={selectedPage}
//                           onClick={handleLinkClick}
//                           searchTerm={searchTerm}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               {/* --- CONFIGURATION SECTION --- */}
//               {((canView("globalConfiguration") &&
//                 !isHidden("globalConfiguration")) ||
//                 (canView("poolRateTabs") && !isHidden("poolRateTabs")) ||
//                 (canView("projectOrgSecurity") &&
//                   !isHidden("projectOrgSecurity")) ||
//                 (canView("accountMapping") && !isHidden("accountMapping")) ||
//                 (canView("analogRate") && !isHidden("analogRate")) ||
//                 (canView("ceilingConfiguration") &&
//                   !isHidden("ceilingConfiguration")) ||
//                 (canView("fiscalYearPeriods") &&
//                   !isHidden("fiscalYearPeriods")) ||
//                 (canView("annualHolidays") && !isHidden("annualHolidays")) ||
//                 (canView("prospectiveIdSetup") &&
//                   !isHidden("prospectiveIdSetup")) ||
//                 (canView("roleRights") && !isHidden("roleRights"))) && (
//                   <div>
//                     {!searchTerm && (
//                       <div
//                         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:text-[#17414d] "
//                         onClick={() => setConfigurationOpen(!configurationOpen)}
//                       >
//                         <div className="flex items-center">
//                           <div className="w-8 flex justify-center">
//                             <Layers className="w-6 h-6 text-gray-600 roup-hover:text-[#17414d]" />
//                           </div>
//                           <span
//                             className={`ml-4 text-sm font-medium text-gray-700 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
//                               }`}
//                           >
//                             Settings
//                           </span>
//                         </div>
//                         {isExpanded &&
//                           (configurationOpen ? (
//                             <ChevronDown size={14} />
//                           ) : (
//                             <ChevronRight size={14} />
//                           ))}
//                       </div>
//                     )}

//                     {(configurationOpen || searchTerm) && isExpanded && (
//                       <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                         {canView("globalConfiguration") &&
//                           !isHidden("globalConfiguration") && (
//                             <NavItem
//                               label="Configuration Setting"
//                               path="/dashboard/global-configuration"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {canView("poolRateTabs") && !isHidden("poolRateTabs") && (
//                           <NavItem
//                             label="Burden Setup"
//                             path="/dashboard/pool-rate-tabs"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("projectOrgSecurity") &&
//                           !isHidden("projectOrgSecurity") && (
//                             <NavItem
//                               label="Project Org Security"
//                               path="/dashboard/projectmapping"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {canView("accountMapping") &&
//                           !isHidden("accountMapping") && (
//                             <NavItem
//                               label="Account Mapping"
//                               path="/dashboard/account-mapping"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {canView("analogRate") && !isHidden("analogRate") && (
//                           <NavItem
//                             label="NBIs Analogous Rate"
//                             path="/dashboard/analog-rate"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                             searchTerm={searchTerm}
//                           />
//                         )}
//                         {canView("ceilingConfiguration") &&
//                           !isHidden("ceilingConfiguration") && (
//                             <NavItem
//                               label="Ceiling Configuration"
//                               path="/dashboard/ceiling-configuration"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {canView("fiscalYearPeriods") &&
//                           !isHidden("fiscalYearPeriods") && (
//                             <NavItem
//                               label="Fiscal Year Periods"
//                               path="/dashboard/maintain-fiscal-year-periods"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {canView("annualHolidays") &&
//                           !isHidden("annualHolidays") && (
//                             <NavItem
//                               label="Annual Holidays"
//                               path="/dashboard/annual-holidays"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {canView("prospectiveIdSetup") &&
//                           !isHidden("prospectiveIdSetup") && (
//                             <NavItem
//                               label="Prospective ID Setup"
//                               path="/dashboard/prospective-id-setup"
//                               selected={selectedPage}
//                               onClick={handleLinkClick}
//                               searchTerm={searchTerm}
//                             />
//                           )}
//                         {canView("roleRights") && !isHidden("roleRights") && (
//                           <NavItem
//                             label="Rights Settings"
//                             path="/dashboard/role-rights"
//                             selected={selectedPage}
//                             onClick={handleLinkClick}
//                           />
//                         )}
//                         {/* <NavItem
//                         label="Override Configuration"
//                         path="/dashboard/override-settings"
//                         selected={selectedPage}
//                         onClick={handleLinkClick}
//                       /> */}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               <div>
//                 <div
//                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                   onClick={() => setSecurityMenuOpen(!securityMenuOpen)}
//                 >
//                   <div className="flex items-center">
//                     <div className="w-8 flex justify-center">
//                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                     </div>
//                     <span
//                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
//                     >
//                       System Security
//                     </span>
//                   </div>
//                   {isExpanded &&
//                     (securityMenuOpen ? (
//                       <ChevronDown size={14} />
//                     ) : (
//                       <ChevronRight size={14} />
//                     ))}
//                 </div>

//                 {securityMenuOpen && isExpanded && (
//                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                     {/* Passing the state 'manageGroups' to the component via the path or state */}
//                     <NavItem
//                       label="Manage User Groups"
//                       path="/dashboard/manage-user-groups"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                     />
//                     <NavItem
//                       label="Manage User"
//                       path="/dashboard/manage-users"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                     />
//                     <NavItem
//                       label="Manage User Suppression"
//                       path="/dashboard/user-suppression"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                     />
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <div
//                   className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 group"
//                   onClick={() => setSecurityOrgMenuOpen(!securityOrgMenuOpen)}
//                 >
//                   <div className="flex items-center">
//                     <div className="w-8 flex justify-center">
//                       <Settings className="w-6 h-6 text-gray-600 group-hover:text-[#17414d]" />
//                     </div>
//                     <span
//                       className={`ml-4 text-sm font-medium text-gray-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}
//                     >
//                       Organizational Security
//                     </span>
//                   </div>
//                   {isExpanded &&
//                     (securityOrgMenuOpen ? (
//                       <ChevronDown size={14} />
//                     ) : (
//                       <ChevronRight size={14} />
//                     ))}
//                 </div>

//                 {securityOrgMenuOpen && isExpanded && (
//                   <div className="ml-12 mr-4 space-y-1 border-l border-gray-100">
//                     {/* Passing the state 'manageGroups' to the component via the path or state */}
//                     <NavItem
//                       label="Activate/Inactivate Organization Security by Module"
//                       path="/dashboard/atc-ina-org-sec"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                     />
//                     <NavItem
//                       label="Manage Organization Security Profiles"
//                       path="/dashboard/prof-org-sec"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                     />
//                     <NavItem
//                       label="Manage Organization Security Groups"
//                       path="/dashboard/groups-org-sec"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                     />
//                     <NavItem
//                       label="Update Organization Security Profiles"
//                       path="/dashboard/prof-upd-org-sec"
//                       selected={selectedPage}
//                       onClick={handleLinkClick}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer Version */}
//         <div
//           className={`mt-auto p-4 border-t border-gray-100 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"
//             }`}
//         >
//           <div className="text-[10px] text-gray-400 font-mono select-none">
//             v{appVersion}
//           </div>
//         </div>
//       </div>

//       {/* Background Overlay for mobile */}
//       {/* {isExpanded  && (
//         <div
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
//           onClick={handleCloseSidebar}
//         ></div>
//       )} */}
//     </div>
//   );
// };

// const NavItem = ({ label, path, selected, onClick, searchTerm }) => {
//   if (searchTerm && !label.toLowerCase().includes(searchTerm)) {
//     return null;
//   }

//   return (
//     <Link
//       to={path}
//       className={`block px-3 py-2 text-xs transition-colors rounded-md ${selected === path
//           ? "text-white font-semibold"
//           : "text-gray-500 hover:text-gray-900"
//         }`}
//       style={{
//         backgroundColor: selected === path ? "#17414d" : "rgb(245,245,245)",
//       }}
//       onClick={(e) => {
//         e.preventDefault();
//         onClick(path);
//       }}
//     >
//       {label}
//     </Link>
//   );
// };

// export default NavigationSidebar;

// previous with correct css without recent tabs
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
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
} from "lucide-react";
import { appendRecentPage, loadRecentPages } from "../utils/recentPages";

const NavigationSidebar = ({ canView }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // State for which main module is active/open in the flyout
  const [activeModule, setActiveModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRailHovered, setIsRailHovered] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [recentPages, setRecentPages] = useState([]);

  const HIDDEN_FEATURES =
    import.meta.env.VITE_HIDE?.replace(/["\s]/g, "").split(",") || [];
  const isHidden = (featureName) => HIDDEN_FEATURES.includes(featureName);

  const toggleSubMenu = (key) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getRouteLabel = (path) => {
    const allItems = [...modules, ...Admin].flatMap((section) => section.items);
    const findLabel = (items) => {
      for (const item of items) {
        if (item.path === path) return item.label;
        if (item.subItems) {
          const nested = findLabel(item.subItems);
          if (nested) return nested;
        }
      }
      return null;
    };

    return (
      findLabel(allItems) ||
      path
        .replace(/^\/dashboard\/?/, "")
        .split(/[\/]/)
        .filter(Boolean)
        .join(" / ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) ||
      "Dashboard"
    );
  };

  useEffect(() => {
    setRecentPages(loadRecentPages());
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/dashboard")) return;
    const pages = appendRecentPage({
      path: pathname,
      label: getRouteLabel(pathname),
    });
    setRecentPages(pages);
  }, [pathname]);

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
                  path: "/dashboard/manage-fiscalyear",
                  permission: "fiscalYear",
                },
                {
                  label: "Accounting Period",
                  path: "/dashboard/manage-accountingperiod",
                  permission: "fiscalYear",
                },
                {
                  label: "Subperiod",
                  path: "/dashboard/manage-subperiod",
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
              label: "Taxes & Countries",
              subItems: [
                {
                  label: "Countries",
                  path: "/dashboard/manage-countries",
                  permission: "organization",
                },
                {
                  label: "Sales Taxes",
                  path: "/dashboard/manage-sales-taxes",
                  permission: "organization",
                },
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

  return (
    <div className="flex fixed inset-y-0 left-0 items-center ml-1 mt-5 z-50 font-sans pointer-events-none">
      {/* PANEL 1: STATIC ICON RAIL */}
      <div
        onMouseEnter={() => setIsRailHovered(true)}
        onMouseLeave={() => setIsRailHovered(false)}
        className={` h-[90%] bg-white rounded-lg border border-[#17414d]/40  flex flex-col items-center py-4 space-y-4 shadow-sm pointer-events-auto transition-all ease-in-out delay-75 ${isRailHovered ? "w-40" : "w-12"}`}
      >
        {/* className={` h-[90%] bg-white rounded-lg border-t-4 border-b-4 border-[#17414d]  flex flex-col items-center py-4 space-y-4 shadow-sm pointer-events-auto transition-all ease-in-out delay-75 ${isRailHovered ? "w-38" : "w-12"}`}> */}

        {/* Top Actions */}
        {/* <RailIcon icon={<Home size={20} />} label="Home" onClick={() => navigate('/')} />
        <RailIcon icon={<Star size={20} />} label="Favorites" />
        <RailIcon icon={<Clock size={20} />} label="Recent" />

        <div className="w-8 h-[1px] bg-gray-200 my-2" /> */}

        {/* Dynamic Modules */}
        <div className="flex flex-col h-full w-full justify-between">
          <div>
            <RailIcon
              icon={<HomeIcon size={20} />}
              isHovered={isRailHovered}
              // Update: Check if the current URL is exactly /dashboard
              active={pathname === "/dashboard"}
              label="Home"
              onClick={() => {
                setActiveModule(null); // Close any open flyouts
                navigate("/dashboard");
              }}
            />

            <div className="flex justify-center py-0.5">
              <div
                className={`h-[1px] bg-gray-200 transition-all duration-300 ${
                  isRailHovered ? "w-full mx-2" : "w-6"
                }`}
              />
            </div>

            <RailIcon
              icon={<Search size={20} />}
              label="Search"
              isHovered={isRailHovered}
              active={activeModule === "global-search"}
              onClick={() =>
                setActiveModule(
                  activeModule === "global-search" ? null : "global-search",
                )
              }
            />

            <RailIcon
              icon={<Clock size={20} />}
              label="Recent"
              isHovered={isRailHovered}
              active={activeModule === "recent-pages"}
              onClick={() =>
                setActiveModule(
                  activeModule === "recent-pages" ? null : "recent-pages",
                )
              }
            />

            {modules.map((mod) => (
              <RailIcon
                key={mod.id}
                icon={mod.icon}
                label={mod.label}
                active={activeModule === mod.id}
                isHovered={isRailHovered}
                onClick={() =>
                  setActiveModule(activeModule === mod.id ? null : mod.id)
                }
              />
            ))}
          </div>
          <div>
            {Admin.map((mod) => (
              <RailIcon
                key={mod.id}
                icon={mod.icon}
                label={mod.label}
                active={activeModule === mod.id}
                isHovered={isRailHovered}
                onClick={() =>
                  setActiveModule(activeModule === mod.id ? null : mod.id)
                }
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
            onClick={() => setActiveModule(null)}
          />
          <div className="relative w-64 bg-white shadow-2xl border border-gray-200 rounded-xl flex flex-col animate-in slide-in-from-left-2 duration-200 h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xs font-bold  tracking-wider text-gray-500">
                {/* Find label from either modules or Admin array */}
                {[...modules, ...Admin].find((m) => m.id === activeModule)
                  ?.label || "Menu"}
              </h2>
              <button
                onClick={() => setActiveModule(null)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </div>

            <div className="p-3 flex-1 flex flex-col min-h-0">
              {/* Search Bar */}
              {activeModule === "global-search" && (
                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={14}
                  />
                  <input
                    className="w-full bg-gray-100 border-none outline-none rounded-lg py-2 pl-9 text-xs  transition-all"
                    placeholder="Quick find..."
                    autoFocus
                    onChange={(e) =>
                      setSearchTerm(e.target.value.toLowerCase())
                    }
                  />
                </div>
              )}

              {/* Scrollable Navigation Area */}
              <nav className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                {activeModule === "recent-pages" ? (
                  <div className="space-y-2">
                    <div className="px-3 py-1 text-[10px] font-semibold text-[#104e64] opacity-70 tracking-wider">
                      Recent
                    </div>
                    {recentPages.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-gray-500">
                        Visit a page to add it here.
                      </div>
                    ) : (
                      recentPages.map((page) => (
                        <button
                          key={page.path}
                          onClick={() => handleLinkClick(page.path)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                            pathname === page.path
                              ? "bg-[#104e64] text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-[#104e64]"
                          }`}
                        >
                          {page.label}
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  (activeModule === "global-search"
                    ? [...modules, ...Admin]
                    : [
                        [...modules, ...Admin].find(
                          (m) => m.id === activeModule,
                        ),
                      ]
                  )
                    .filter(Boolean)
                    .map((section) => {
                      const filteredItems = section.items.filter(
                        (item) =>
                          (!item.permission || canView(item.permission)) &&
                          !isHidden(item.permission) &&
                          item.label.toLowerCase().includes(searchTerm),
                      );

                      if (filteredItems.length === 0) return null;

                      return (
                        <div key={section.id} className="space-y-1">
                          {activeModule === "global-search" && (
                            <div className="px-3 py-1 text-[10px] font-semibold text-[#104e64] opacity-70 tracking-tighter">
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
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                                    pathname === item.path
                                      ? "bg-[#104e64] text-white shadow-md"
                                      : "text-gray-600 hover:bg-gray-100 hover:text-[#104e64]"
                                  }`}
                                >
                                  <span className="truncate">{item.label}</span>

                                  {hasSubItems && (
                                    <ChevronRight
                                      size={14}
                                      className={`transition-transform ${
                                        isSubOpen ? "rotate-90" : ""
                                      }`}
                                    />
                                  )}
                                </button>

                                {/* LEVEL 2 */}
                                {hasSubItems && isSubOpen && (
                                  <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-1">
                                    {item.subItems.map((sub) => {
                                      const hasNested =
                                        sub.subItems?.length > 0;
                                      const subKey = sub.path || sub.label;
                                      const isNestedOpen = openSubMenus[subKey];

                                      //                                     // ✅ NORMAL SUB ITEM
                                      if (!hasNested) {
                                        return (
                                          <button
                                            key={subKey}
                                            onClick={() =>
                                              handleLinkClick(sub.path)
                                            }
                                            className={`w-full text-left px-4 py-1.5 rounded-lg text-[11px] transition-all ${
                                              pathname === sub.path
                                                ? "bg-[#104e64] text-white"
                                                : "text-gray-500 hover:text-[#104e64] hover:bg-gray-50"
                                            }`}
                                          >
                                            {sub.label}
                                          </button>
                                        );
                                      }

                                      //   ✅ LEVEL 3 DROPDOWN
                                      return (
                                        <div
                                          key={subKey}
                                          className="flex flex-col"
                                        >
                                          <button
                                            onClick={() =>
                                              toggleSubMenu(subKey)
                                            }
                                            className="w-full flex items-center justify-between px-4 py-1.5 text-[11px] text-gray-500 hover:text-[#104e64] hover:bg-gray-50 rounded-lg"
                                          >
                                            <span>{sub.label}</span>

                                            <ChevronRight
                                              size={12}
                                              className={`transition-transform ${
                                                isNestedOpen ? "rotate-90" : ""
                                              }`}
                                            />
                                          </button>

                                          {isNestedOpen && (
                                            <div className="ml-4 mt-1 space-y-1">
                                              {sub.subItems.map((deep) => (
                                                <button
                                                  key={deep.path}
                                                  onClick={() =>
                                                    handleLinkClick(deep.path)
                                                  }
                                                  className={`w-full text-left px-4 py-1 rounded-md text-[10px] ${
                                                    pathname === deep.path
                                                      ? "bg-[#104e64] text-white"
                                                      : "text-gray-400 hover:text-[#104e64] hover:bg-gray-50"
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
                    })
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Sub-component for the Rail Icons */
const RailIcon = ({ icon, label, onClick, active, isHovered }) => (
  <div className="flex flex-col mb-2 items-center w-full px-1">
    <button
      onClick={onClick}
      className={`w-full flex items-center cursor-pointer p-2 rounded-lg transition-all duration-300 group relative ${
        active ? "bg-[#104e64] text-white" : "text-black hover:bg-gray-100"
      }`}
    >
      {/* Icon Containe: Removed background/text logic to prevent flickering */}
      <div className="min-w-[24px] h-4 flex items-center justify-center">
        {icon}
      </div>

      {/* Label Container */}
      <div
        className={`ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap ${
          isHovered ? "opacity-100 w-auto" : "opacity-0 w-0 pointer-events-none"
        }`}
      >
        {/* Removed the background/text classes from the span */}
        <span className="text-xs font-medium tracking-wide">{label}</span>
      </div>
    </button>
  </div>
);

export default NavigationSidebar;
