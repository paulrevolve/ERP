// Route to Title & Category Mapping
export const getRouteMeta = (pathname) => {
  const routesMap = {
    "/dashboard": { title: "Home", category: "Dashboard" },
    "/dashboard/manage-fiscalyear": { title: "Fiscal Year", category: "Accounting > General Ledger" },
    "/dashboard/manage-accountingperiod": { title: "Period", category: "Accounting > General Ledger" },
    "/dashboard/manage-subperiod": { title: "Subperiod", category: "Accounting > General Ledger" },
    "/dashboard/org-master": { title: "Organization Setup", category: "Accounting > Organizations" },
    "/dashboard/account-master": { title: "Manage Accounts", category: "Manage" },
    "/dashboard/employee-master": { title: "Manage Employees", category: "Manage" },
    "/dashboard/project-master": { title: "Project Master", category: "Manage" },
    "/dashboard/manage-revenue": { title: "Manage Revenue", category: "Manage" },
    "/dashboard/manage-revenue-formulas": { title: "Manage Revenue Formulas", category: "Manage" },
    "/dashboard/project-budget-status": { title: "Project Planning", category: "Planning" },
    "/dashboard/project-report": { title: "Reporting", category: "Planning" },
    "/dashboard/mass-utility": { title: "Mass Utility", category: "Planning" },
    "/dashboard/pricing": { title: "Pricing", category: "Planning" },
    "/dashboard/financial-report": { title: "Financial Report", category: "Planning" },
    "/dashboard/import-opportunity": { title: "Import Opportunity", category: "New Business" },
    "/dashboard/new-business": { title: "Manage New Business", category: "New Business" },
    "/dashboard/create-project-budget": { title: "Transfer Project Budget", category: "New Business" },
    "/dashboard/manage-groups": { title: "Manage Groups", category: "Manage" },
    "/dashboard/manage-users": { title: "Manage Users", category: "Manage" },
    "/dashboard/accts-payable/accounts-payable-vouchers": { title: "Accounts Payable Vouchers", category: "Accounts Payable" },
    "/dashboard/accts-payable/approve-vouchers": { title: "Approve Vouchers", category: "Accounts Payable" },
  };

  if (routesMap[pathname]) {
    return routesMap[pathname];
  }

  // Fallback: derive from last path segment
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "Dashboard";
  const formattedTitle = lastSegment
    .replace(/^manage-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: formattedTitle,
    category: segments.length > 2 ? segments[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "ERP",
  };
};
