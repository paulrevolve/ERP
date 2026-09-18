// import React, { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// // Pages & Components
// import Login from "./components/Login";
// import Dashboard from "./pages/Dashboard";
// import ProjectBudgetStatus from "./components/ProjectBudgetStatus";
// import FinancialDashboard from "./components/FinancialDashboard";
// import MassUtilityProject from "./components/MassUtilityProject";
// import Pricing from "./components/Pricing";
// import Import from "./components/Import";
// import UserOrgProjectMapping from "./components/UserOrgProjectMapping";
// import NewBusinessComponent from "./components/NewBusinessComponent";
// import CreateProjectBudget from "./components/CreateProjectBudget";
// import Opportunities from "./components/Opportunities";
// import ManageGroups from "./components/ManageGroups";
// import ManageUser from "./components/ManageUser";
// import AnalysisByPeriodContent from "./components/AnalysisByPeriodContent";
// import PoolRateTabs from "./components/PoolRateTabs";
// import ConfigureField from "./components/ConfigureField";
// import OverrideSettings from "./components/OverrideSettings";
// import PoolConfigurationTable from "./components/PoolConfigurationTable";
// import TemplatePoolMapping from "./components/TemplatePoolMapping";
// import Template from "./components/Template";
// import CeilingConfiguration from "./components/CeilingConfiguration";
// import AnalogRate from "./components/AnalogRate";
// import GlobalConfiguration from "./components/GlobalConfiguration";
// import ProspectiveIdSetup from "./components/ProspectiveIdSetup";
// import DisplaySettings from "./components/DisplaySettings";
// import AnnualHolidays from "./components/HolidayCalendar";
// import MaintainFiscalYearPeriods from "./components/MaintainFiscalYearPeriods";
// import AccountMapping from "./components/AccountMapping";
// import FinancialReport from "./components/FinancialReport";
// import { backendUrl } from "./components/config";
// import axios from "axios";
// import DbTable from "./components/DbTable";
// import api from "./utils/api";
// import OrgMaster from "./components/OrgMaster";
// import AccountMaster from "./components/AccountMaster";
// import EmployeeMaster from "./components/EmployeeMaster";
// import PLCMaster from "./components/PLCMaster";
// import ProjectMaster from "./components/ProjectMaster";
// import ManageRevFormulaForm from "./components/ManageRevFormulaForm";
// import ManageRevformula from "./components/ManageRevformula";
// import AccountGroupSetup from "./components/AccountGroupSetup";
// import ManageAccountGroup from "./components/ManageAccountGroup";
// import AccountTypeMaster from "./components/AccountTypeMaster";
// import ManageCompany from "./components/ManageCompany";
// import ServiceUnavilabe from "./components/ServiceUnavilabe";
// import MasterDataManager from "./components/MasterDataManager";
// import ManageUserGroups from "./components/ManageUserGroups";
// import ManageOrganizationSecurityGroups from "./components/ManageOrganizationSecurityGroups";
// import ManageOrganizationSecurityProfiles from "./components/ManageOrganizationSecurityProfiles";
// import ManageFiscalYear from "./components/ManageFiscalYear";
// import ManageAccountingPeriod from "./components/ManageAccountingPeriod";
// import ManageSubperiod from "./components/ManageSubperiod";
// import ManageProjectAccountGroups from "./components/ManageProjectAccountGroups";
// import ManageVendor from "./components/ManageVendor";
// import AccountMassLink from "./components/AccountMassLink";
// import AccountLink from "./components/AccountsLink";
// import UserDefineInformation from "./components/UserDefineInformation";
// import UserDefineLabel from "./components/UserDefineLabel";
// import HomePage from "./pages/Home";
// // import ManageProspectiveVendors from "./components/prospectiveVendor/ManageProspectiveVendors";
// // import ApproveProspectiveVendor from "./components/prospectiveVendor/ApproveProspectiveVendor";
// import ManageReorganization from "./components/Reorganization/ManageReorganization";
// import LinkOrgReorg from "./components/Reorganization/LinkOrgReorg";
// import MassLinkOrgReorg from "./components/Reorganization/MassLinkOrgReorg";
// import { VendorEmployeeDetail } from "./components/VendorEmployeeDetail";
// import ManageProspectiveVendors from "./components/ManageProspectiveVendors";
// import ManageReference from "./components/ManageReference";
// import ManageVendorTerms from "./components/ManageVendorTerms";
// import ManageEmployee from "./components/ManageEmployee";
// import ManageCustomers from "./components/ManageCustomers";
// import {
//   ManageCompanyProperty,
//   ManageProfessionalOrganization,
//   ManageProspectiveVendorRejectionReasons,
//   ManageSCISAPClearanceCode,
//   ManageSecurityClearanceSettings,
//   ManageSkillCodes,
//   ManageSkillLevel,
//   ManageSubcontractorBondTypes,
//   ManageSubcontractorInsuranceTypes,
//   ManageTrainingCodes,
//   ManageTrainingSource,
//   ManageVendorEmplApvlGrps,
// } from "./components/VendorEmployeeSettingTabs";
// import ConfigureVendorSettings from "./components/ConfigureVendorSettings";
// import {
//   CustomerCreditLimits,
//   CustomerCreditRatings,
//   CustomerTypes,
//   ManageCustomerTerms,
//   SalesTerritories,
//   ShippingMethods,
// } from "./components/ManageCustomerTerms";
// import ApproveVendor from "./components/ApproveVendor";
// import ApproveVendorEmployee from "./components/ApproveVendorEmployee";
// import ManageCashAccounts from "./components/AccountsPayableControls/ManageCashAccounts";
// import ConfigureEmailSettings from "./components/AccountsPayableControls/ConfigureEmailSettings";
// import ManageAccountsPayableAccounts from "./components/AccountsPayableControls/ManageAccountsPayableAccounts";
// import ConfigureAccountsPayableSettings from "./components/AccountsPayableControls/ConfigureAccountsPayableSettings";
// import ConfigureAccountsPayableVoucherSettings from "./components/AccountsPayableControls/ConfigureAccountsPayableVoucherSettings";
// import ConfigurePurchaseOrderVoucherSettings from "./components/AccountsPayableControls/ConfigurePurchaseOrderVoucherSettings";
// import ConfigureVoucherApproverSettings from "./components/AccountsPayableControls/ConfigureVoucherApproverSettings";
// import ManageRecurringAPVoucherCodes from "./components/AccountsPayableControls/ManageRecurringAPVoucherCodes";
// import ManageInsuranceCarrierInformation from "./components/AccountsPayableControls/ManageInsuranceCarrierInformation";
// import ManageConstructionindustrySchemeCodes from "./components/AccountsPayableControls/ManageConstructionindustrySchemeCodes";
// import PrintProjectAccountGroupSetupReport from "./components/PrintProjectAccountGroupSetupReport";
// import ManageProjectTypes from "./components/ManageProjectTypes";
// import ManageModificationDescriptions from "./components/ManageModificationDescriptions";
// import UserDefinedLabels from "./components/UserDefinedLabels";
// import ManageChangeOrderStatus from "./components/ManageChangeOrderStatus";
// import ManageSalaryCapCode from "./components/ManageSalaryCapCode";
// import ManageProjectAccountGroupMappings from "./components/ManageProjectAccountGroupMappings";
// import ManageProjectOrganizationMappings from "./components/ManageProjectOrganizationMappings";
// import ManageProjectApproverSettings from "./components/ManageProjectApproverSettings";
// import CheckAndRebuildProjectSegmentIds from "./components/CheckAndRebuildProjectSegmentIds";
// import PurgeProjectAndBillingInformation from "./components/PurgeProjectAndBillingInformation";
// import ManageEmployeeSalary from "./components/ManageEmployeeSalary";
// import AccountsLink from "./components/ManageRefAccountLink";
// import ManageProjectRole from "./components/ManageProjectRoles";
// import ManageRevenue from "./components/ManageRevenue";
// import ManageRevenueFormulas from "./components/ManageRevenueFormulas";
// import PrintProjectRevenueBillingFormulas from "./components/PrintProjectRevenueBillingFormulas";
// import ManageRateSequenceOrders from "./components/ManageRateSequenceOrders";
// import ManageCostOfGoodsSold from "./components/ManageCostOfGoodsSold";

// import ManageAlternateProjectRevenueProfiles from "./components/ManageAlternateProjectRevenueProfiles";
// import ManageAltRevProfilePriorYearHistory from "./components/ManageAltRevProfilePriorYearHistory";
// import ManageProjRevCalcValHistory from "./components/ManageProjRevCalcValHistory";
// import ManageRevenueEvaluationInfoAndDisclosures from "./components/ManageRevenueEvaluationInfoAndDisclosures";
// import ManageRevenueEvaluationStatusCodes from "./components/ManageRevenueEvaluationStatusCodes";
// import ManagePerformanceObligationTypeCodes from "./components/ManagePerformanceObligationTypeCodes";
// import ManageTotalCeilings from "./components/ManageTotalCeilings";
// import ManageBurdenCostCeilings from "./components/ManageBurdenCostCeilings";
// import ManageDirectCostCeilings from "./components/ManageDirectCostCeilings";
// import ManageBurdenFeeOverrides from "./components/ManageBurdenFeeOverrides";
// import ManageCostFeeOverrides from "./components/ManageCostFeeOverrides";
// import ManageMultiplierOverrides from "./components/ManageMultiplierOverrides";
// import ManageHoursCeilings from "./components/ManageHoursCeilings";
// import ManageEmployeeHoursCeilings from "./components/ManageEmployeeHoursCeilings";
// import ManageVendorHoursCeilings from "./components/ManageVendorHoursCeilings";
// import ManageProjectLaborCategories from "./components/ManageProjectLaborCategories";
// import ManageLinkPLCToProjects from "./components/ManageLinkPLCToProjects";
// import ManageLinkPLCRatesToProjects from "./components/ManageLinkPLCRatesToProjects";
// import MassAddProjectWorkforce from "./components/MassAddProjectWorkforce";
// import ManageEmployeeWorkforce from "./components/ManageEmployeeWorkforce";
// import ManageVendorWorkforce from "./components/ManageVendorWorkforce";
// import ManageVendorEmployeeWorkforce from "./components/ManageVendorEmployeeWorkforce";
// import LinkPLCRatesToEmployeeVendor from "./components/LinkPLCRatesToEmployeeVendor";
// import PrintProjectWorkforceReport from "./components/PrintProjectWorkforceReport";
// import ManageAlternateReportingLevels from "./components/ManageAlternateReportingLevels";
// import LinkProjectsAccounts from "./components/LinkProjectsAccounts";
// import LinkProjectsAccountsOrganizations from "./components/LinkProjectsAccountsOrganizations";
// import MassLinkProjectsAccountsOrganizations from "./components/MassLinkProjectsAccountsOrganizations";
// import LinkProjectsOrganizations from "./components/LinkProjectsOrganizations";
// import ManageCLINInformation from "./components/ManageCLINInformation";
// import ManageProjectLaborHistory from "./components/ManageProjectLaborHistory";
// import ManagePriorYearCostAndRevenue from "./components/ManagePriorYearCostAndRevenue";
// import ManagePriorYearTimeAndMaterialsRevenue from "./components/ManagePriorYearTimeAndMaterialsRevenue";
// import ManagePriorYearBillableValue from "./components/ManagePriorYearBillableValue";
// import ManagePriorYearUnitRevenue from "./components/ManagePriorYearUnitRevenue";
// import ActiveInactiveProjects from "./components/ActiveInactiveProjects";
// import UpdateProjectContractAndFundedValues from "./components/UpdateProjectContractAndFundedValues";
// import UpdateProjectPeriodOfPerformance from "./components/UpdateProjectPeriodOfPerformance";
// import ImportProjectMasterData from "./components/ImportProjectMasterData";
// import ConfigureProjectSettings from "./components/ConfigureProjectSettings";
// import SetProjectLevelCorrectlyInProjectMaster from "./components/SetProjectLevelCorrectlyInProjectMaster";
// import SynchronizeProjectMasterDataAndProjectEditData from "./components/SynchronizeProjectMasterDataAndProjectEditData";
// import UpdatePOATableWithValidLinksReferenceNumbers from "./components/UpdatePOATableWithValidLinksReferenceNumbers";
// import ManageChangeOrders from "./components/ManageChangeOrders";
// import ManageUDEFInformation from "./components/ManageUDEFInformation";
// import ManageGovernmentContractInformation from "./components/ManageGovernmentContractInformation";
// // import ConfigureVoucherApproverSettings from "./components/ConfigureVoucherApproverSettings";
// // import ManageAccountsPayableAccounts from "./components/ManageAccountsPayableAccounts";
// // import ManageCashAccounts from "./components/ManageCashAccounts";
// // import ManageConstructionindustrySchemeCodes from "./components/ManageConstructionindustrySchemeCodes";
// // import ManageInsuranceCarrierInformation from "./components/ManageInsuranceCarrierInformation";
// import ManageLienWaiverDocumentNames from "./components/ManageLienWaiverDocumentNames";
// import ManageLienWaiverInformation from "./components/ManageLienWaiverInformation";
// // import ManageRecurringAPVoucherCodes from "./components/ManageRecurringAPVoucherCodes";
// import ManageCreditCardImportInfo from "./components/ManageCreditCardImportInfo"; // Role-based Guard Component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const storedUser = localStorage.getItem("currentUser");
//   if (!storedUser) return <Navigate to="/login" replace />;

//   const userObj = JSON.parse(storedUser);
//   if (!userObj.role || !allowedRoles.includes(userObj.role.toLowerCase())) {
//     return <Navigate to="/api" replace />;
//   }
//   return children;
// };

// function App() {
//   const [visibility, setVisibility] = useState({});
//   const [loading, setLoading] = useState();

//   if (import.meta.env.VITE_CHECK === "production") {
//     console.log = console.info = console.warn = console.error = () => {};
//   }

//   const user = JSON.parse(localStorage.getItem("currentUser"));

//   const getUserFromStorage = () => {
//     try {
//       return JSON.parse(localStorage.getItem("currentUser"));
//     } catch (e) {
//       return null;
//     }
//   };

//   const loadConfig = async () => {
//     const user = getUserFromStorage();

//     // If no user/userId, we can't fetch config. Stop loading.
//     if (!user?.userId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${backendUrl}/api/UserGroups/GetAllPermissionsByUserId?CompanyId=1&UserId=${user.userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${user.token ?? ""}`,
//           },
//         },
//       );

//       // 1. Ensure data is an array (based on your snippet)
//       const permissionsArray = Array.isArray(res.data) ? res.data : [];

//       /**
//        * 2. Transform array into a lookup object (Map)
//        * Result will look like:
//        * {
//        * accountMapping: { canView: true, canEdit: true },
//        * analogRate: { canView: true, canEdit: true }
//        * }
//        */
//       const permissionsLookup = permissionsArray.reduce((acc, item) => {
//         if (item.screenCode) {
//           acc[item.screenCode] = {
//             canView: item.canView,
//             canEdit: item.canEdit,
//           };
//         }
//         return acc;
//       }, {});

//       setVisibility(permissionsLookup);
//       // const data = res.data || {};
//       // const mergedVisibility = {
//       //   ...(data.screens || {}),
//       //   ...(data.fields || {}),
//       // };

//       console.log("permissionLookup", permissionsLookup);
//       // setVisibility(mergedVisibility);
//     } catch (e) {
//       console.error("Error fetching configuration:", e);
//       setVisibility({});
//     } finally {
//       // FIX: This ensures loading state is ALWAYS turned off
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadConfig();
//   }, []);

//   const canView = (key) => {
//     // Returns true if the screen exists in visibility and canView is true
//     return visibility[key]?.canView === true;
//   };

//   const canEdit = (key) => {
//     // Returns true if the screen exists in visibility and canEdit is true
//     return visibility[key]?.canEdit === true;
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center py-4 bg-blue-50">
//         <div className="flex items-center justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <span className="ml-2 mt-4">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login loadConfig={loadConfig} />} />
//           <Route path="/login" element={<Login loadConfig={loadConfig} />} />

//           {/* Dashboard Layout and its Children */}
//           <Route
//             path="/dashboard"
//             element={<Dashboard canView={canView} canEdit={canEdit} />}
//           >
//             <Route index element={<HomePage />} />
//             {/* Default Index View */}
//             <Route
//               index
//               element={
//                 <div className="flex items-center justify-center min-h-[80vh]">
//                   <div className="max-w-md w-full text-center">
//                     <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-transparent bg-clip-text">
//                       FinAxis
//                     </span>
//                     <h1 className="text-2xl font-semibold text-gray-900 mt-4">
//                       Welcome to FinAxis Planning
//                     </h1>
//                     <p className="text-gray-600 mt-2">
//                       Select an option from the sidebar to get started.
//                     </p>
//                   </div>
//                 </div>
//               }
//             />

//             {/* General Routes */}
//             <Route
//               path="project-budget-status"
//               element={
//                 <ProjectBudgetStatus canView={canView} canEdit={canEdit} />
//               }
//             />
//             <Route
//               path="db-table"
//               element={
//                 <div className="mt-12 ml-2">
//                   <DbTable />
//                 </div>
//               }
//             />
//             <Route
//               path="project-report"
//               element={
//                 <div className="mt-12 ml-2">
//                   <FinancialDashboard />
//                 </div>
//               }
//             />
//             <Route
//               path="mass-utility"
//               element={
//                 <div className="mt-12 ml-2">
//                   <MassUtilityProject />
//                 </div>
//               }
//             />
//             <Route
//               path="pricing"
//               element={
//                 <div className="mt-12 ml-2">
//                   <Pricing />
//                 </div>
//               }
//             />
//             <Route
//               path="import-utility"
//               element={
//                 <div className="mt-12 ml-2">
//                   <Import />
//                 </div>
//               }
//             />
//             <Route
//               path="projectmapping"
//               element={<UserOrgProjectMapping canEdit={canEdit} />}
//             />
//             <Route
//               path="new-business"
//               element={
//                 <div className="mt-10">
//                   <NewBusinessComponent canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="create-project-budget"
//               element={
//                 <div className="mt-12 ml-2">
//                   <CreateProjectBudget canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="import-opportunity"
//               element={
//                 <div className="mt-12 ml-2">
//                   <Opportunities />
//                 </div>
//               }
//             />
//             <Route
//               path="monthly-forecast"
//               element={
//                 <div className="mt-12 ml-2">
//                   <AnalysisByPeriodContent canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="financial-report"
//               element={
//                 <div className="mt-12 ml-2">
//                   <FinancialReport canEdit={canEdit} />
//                 </div>
//               }
//             />
//             {/* Admin Only Routes */}
//             <Route
//               path="manage-groups"
//               element={
//                 <div className="mt-12 ml-2">
//                   <ManageGroups canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-users"
//               element={
//                 <div className="mt-12 ml-2">
//                   <ManageUser canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="pool-rate-tabs"
//               element={
//                 <div className="mt-12">
//                   <PoolRateTabs canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="role-rights"
//               element={
//                 <div className="mt-12 ml-2">
//                   <ConfigureField loadConfigMain={loadConfig} />
//                 </div>
//               }
//             />
//             <Route
//               path="override-settings"
//               element={
//                 <div className="mt-12 ml-2">
//                   <OverrideSettings />
//                 </div>
//               }
//             />
//             <Route
//               path="pool-configuration"
//               element={
//                 <div className="mt-12 ml-2">
//                   <PoolConfigurationTable canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="template-pool-mapping"
//               element={
//                 <div className="mt-12 ml-2">
//                   <TemplatePoolMapping canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="template"
//               element={
//                 <div className="mt-12 ml-2">
//                   <Template canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="ceiling-configuration"
//               element={
//                 <div className="mt-12">
//                   <CeilingConfiguration />
//                 </div>
//               }
//             />
//             <Route
//               path="analog-rate"
//               element={
//                 <div className="mt-12">
//                   <AnalogRate />
//                 </div>
//               }
//             />
//             <Route
//               path="global-configuration"
//               element={
//                 <div className="mt-12 ml-2">
//                   <GlobalConfiguration canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="prospective-id-setup"
//               element={
//                 <div className="mt-10">
//                   <ProspectiveIdSetup />
//                 </div>
//               }
//             />
//             <Route
//               path="display-settings"
//               element={
//                 <div className="mt-12 ml-2">
//                   <DisplaySettings />
//                 </div>
//               }
//             />
//             <Route
//               path="annual-holidays"
//               element={
//                 <div className="mt-4">
//                   <AnnualHolidays canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="maintain-fiscal-year-periods"
//               element={
//                 <div className="mt-12 ml-2">
//                   <MaintainFiscalYearPeriods />
//                 </div>
//               }
//             />
//             <Route
//               path="account-mapping"
//               element={
//                 <div className="mt-10">
//                   <AccountMapping canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="account-master"
//               element={
//                 <div className="mt-10">
//                   <AccountMaster canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="org-master"
//               element={
//                 <div className="mt-10">
//                   <OrgMaster canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="employee-master"
//               element={
//                 <div className="mt-10">
//                   <EmployeeMaster canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="plc-master"
//               element={
//                 <div className="mt-10">
//                   <PLCMaster canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="project-master"
//               element={
//                 <div className="mt-10">
//                   <ProjectMaster canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="revenueFormula-master"
//               element={
//                 <div className="mt-10">
//                   <ManageRevformula canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="accountgroup-mapping"
//               element={
//                 <div className="mt-10">
//                   <AccountGroupSetup canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="accountgroupcode-master"
//               element={
//                 <div className="mt-10">
//                   <ManageAccountGroup canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="accounttype-master"
//               element={
//                 <div className="mt-10">
//                   <AccountTypeMaster canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="company-master"
//               element={
//                 <div className="mt-10">
//                   <ManageCompany canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-data-manager"
//               element={
//                 <div className="mt-10">
//                   <MasterDataManager />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-user-groups"
//               element={
//                 <div className="mt-10">
//                   <ManageUserGroups />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-users"
//               element={
//                 <div className="mt-10">
//                   <ManageUserGroups />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-customers"
//               element={
//                 <div className="mt-10">
//                   <ManageCustomers />
//                 </div>
//               }
//             />
//             <Route
//               path="user-suppression"
//               element={
//                 <div className="mt-10">
//                   <ManageUserGroups />
//                 </div>
//               }
//             />
//             <Route
//               path="groups-org-sec"
//               element={
//                 <div className="mt-10">
//                   <ManageOrganizationSecurityGroups />
//                 </div>
//               }
//             />
//             <Route
//               path="prof-org-sec"
//               element={
//                 <div className="mt-10">
//                   <ManageOrganizationSecurityProfiles />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-fiscalyear"
//               element={
//                 <div className="mt-10">
//                   <ManageFiscalYear canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-accountingperiod"
//               element={
//                 <div className="mt-10">
//                   <ManageAccountingPeriod canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-subperiod"
//               element={
//                 <div className="mt-10">
//                   <ManageSubperiod canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-reference"
//               element={
//                 <div className="mt-10">
//                   <ManageReference canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="account-org-link"
//               element={
//                 <div className="mt-10">
//                   <AccountLink canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="employee-master-screen"
//               element={
//                 <div className="mt-10">
//                   <ManageEmployee canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="accounts-orgs-link"
//               element={
//                 <div className="mt-10">
//                   <AccountMassLink canEdit={canEdit} />
//                 </div>
//               }
//             />
//             <Route
//               path="accountgroupcode-master"
//               element={
//                 <div className="mt-10">
//                   <ManageAccountGroup canEdit={canEdit} />
//                 </div>
//               }
//             />
//             {/* old */}
//             <Route
//               path="manage-project-acct-groups"
//               element={
//                 <div className="mt-10">
//                   <ManageProjectAccountGroups />
//                 </div>
//               }
//             />

//             {/* <Route path="prospective-vendor">
//               <Route
//                 path="manage-prospective-vendor"
//                 element={<ManageProspectiveVendors/>}
//               />
//               <Route
//                 path="approve-prospective-vendor"
//                 element={<ApproveProspectiveVendor/>}
//               />
//             </Route> */}
//             <Route path="reorganization">
//               <Route path="reorg-setup" element={<ManageReorganization />} />
//               <Route path="link-org-reorg" element={<LinkOrgReorg />} />
//               <Route path="masslink-org-reorg" element={<MassLinkOrgReorg />} />
//             </Route>
//             <Route path="customer">
//               <Route
//                 path="manage-customer-crLimts"
//                 element={<CustomerCreditLimits />}
//               />
//               <Route
//                 path="manage-customer-terms"
//                 element={<ManageCustomerTerms />}
//               />
//               <Route path="manage-customer-types" element={<CustomerTypes />} />

//               <Route
//                 path="manage-customer-crRating"
//                 element={<CustomerCreditRatings />}
//               />
//               <Route
//                 path="manage-customer-sTerr"
//                 element={<SalesTerritories />}
//               />
//               <Route
//                 path="manage-customer-sMethod"
//                 element={<ShippingMethods />}
//               />
//               <Route path="manage-customer" element={<ManageCustomers />} />
//             </Route>
//             <Route
//               path="configure-vendor-settings"
//               element={
//                 <div className="mt-10">
//                   <ConfigureVendorSettings />
//                 </div>
//               }
//             />

//             <Route path="vendSubControls">
//               <Route
//                 path="manage-vendor-terms"
//                 element={
//                   <div className="mt-10">
//                     <ManageVendorTerms canEdit={canEdit} />
//                   </div>
//                 }
//               />
//               <Route
//                 path="configVendSetting"
//                 element={<ConfigureVendorSettings />}
//               />
//               <Route
//                 path="secClearSettings"
//                 element={<ManageSecurityClearanceSettings />}
//               />
//               <Route
//                 path="insuranceTypes"
//                 element={<ManageSubcontractorInsuranceTypes />}
//               />
//               <Route
//                 path="bondTypes"
//                 element={<ManageSubcontractorBondTypes />}
//               />
//               <Route
//                 path="reasonCode"
//                 element={<ManageProspectiveVendorRejectionReasons />}
//               />
//               <Route
//                 path="scisapSettings"
//                 element={<ManageSCISAPClearanceCode />}
//               />
//               <Route
//                 path="vendoremplAprvlGrps"
//                 element={<ManageVendorEmplApvlGrps />}
//               />
//               <Route
//                 path="profOrg"
//                 element={<ManageProfessionalOrganization />}
//               />
//               <Route path="skillCodes" element={<ManageSkillCodes />} />
//               <Route path="skillLevels" element={<ManageSkillLevel />} />
//               <Route path="trainingCodes" element={<ManageTrainingCodes />} />
//               <Route path="trainingSource" element={<ManageTrainingSource />} />
//               <Route
//                 path="companyProperty"
//                 element={<ManageCompanyProperty />}
//               />
//             </Route>
//             <Route path="userdefinedlabels">
//               <Route
//                 path="organization"
//                 element={<UserDefineLabel master={"ORGANIZATION"} />}
//               />
//               <Route
//                 path="employee"
//                 element={<UserDefineLabel master={"EMPLOYEE"} />}
//               />
//               <Route
//                 path="account"
//                 element={<UserDefineLabel master={"ACCOUNT"} />}
//               />
//               <Route
//                 path="vendor"
//                 element={<UserDefineLabel master={"VENDOR"} />}
//               />
//             </Route>
//             <Route path="userdefinedinformation">
//               <Route
//                 path="organization"
//                 element={<UserDefineInformation master={"ORGANIZATION"} />}
//               />
//               <Route
//                 path="employee"
//                 element={<UserDefineInformation master={"EMPLOYEE"} />}
//               />
//               <Route
//                 path="account"
//                 element={<UserDefineInformation master={"ACCOUNT"} />}
//               />
//               <Route
//                 path="vendor"
//                 element={<UserDefineInformation master={"VENDOR"} />}
//               />
//             </Route>
//             <Route path="vendor">
//               <Route
//                 path="manage-prospective-vendors"
//                 element={
//                   <div className="mt-10">
//                     <ManageProspectiveVendors />
//                   </div>
//                 }
//               />
//               <Route
//                 path="manage-vendors"
//                 element={
//                   <div className="mt-10">
//                     <ManageVendor />
//                   </div>
//                 }
//               />
//               <Route
//                 path="vendor-employee-detail"
//                 element={
//                   <div className="mt-10">
//                     <VendorEmployeeDetail />
//                   </div>
//                 }
//               />
//               <Route
//                 path="manage-prospective-vendor"
//                 element={
//                   <div className="mt-10">
//                     <ManageProspectiveVendors />
//                   </div>
//                 }
//               />
//               <Route
//                 path="approve-vendor"
//                 element={
//                   <div className="mt-10">
//                     <ApproveVendor />
//                   </div>
//                 }
//               />
//             </Route>
//             <Route path="vendor-employee">
//               <Route
//                 path="manage-vendor-employee"
//                 element={
//                   <div className="mt-10 ml-4">
//                     <VendorEmployeeDetail />
//                   </div>
//                 }
//               />
//               <Route
//                 path="approve-vendor-employee"
//                 element={
//                   <div className="mt-10">
//                     <ApproveVendorEmployee />
//                   </div>
//                 }
//               />
//             </Route>
//             <Route path="accts-payable">
//               <Route
//                 path="cash-accounts"
//                 element={
//                   <div className="mt-10">
//                     <ManageCashAccounts />
//                   </div>
//                 }
//               />
//               <Route
//                 path="accounts-payable-settings"
//                 element={
//                   <div className="mt-10">
//                     <ManageAccountsPayableAccounts />
//                   </div>
//                 }
//               />
//               <Route
//                 path="check-email-setting"
//                 element={
//                   <div className="mt-10">
//                     <ConfigureEmailSettings />
//                   </div>
//                 }
//               />
//               <Route
//                 path="accounts-payable-configure"
//                 element={
//                   <div className="mt-10">
//                     <ConfigureAccountsPayableSettings />
//                   </div>
//                 }
//               />
//               <Route
//                 path="accts-payable-voucher"
//                 element={
//                   <div className="mt-10">
//                     <ConfigureAccountsPayableVoucherSettings />
//                   </div>
//                 }
//               />
//               <Route
//                 path="purchas-ord-vouch-sett"
//                 element={
//                   <div className="mt-10">
//                     <ConfigurePurchaseOrderVoucherSettings />
//                   </div>
//                 }
//               />
//               <Route
//                 path="voucher-approver-sett"
//                 element={
//                   <div className="mt-10">
//                     <ConfigureVoucherApproverSettings />
//                   </div>
//                 }
//               />
//               <Route
//                 path="recc-apV-code"
//                 element={
//                   <div className="mt-10">
//                     <ManageRecurringAPVoucherCodes />
//                   </div>
//                 }
//               />
//               <Route
//                 path="insurance-carr-info"
//                 element={
//                   <div className="mt-10">
//                     <ManageInsuranceCarrierInformation />
//                   </div>
//                 }
//               />
//               <Route
//                 path="const-industry-sch-code"
//                 element={
//                   <div className="mt-10">
//                     <ManageConstructionindustrySchemeCodes />
//                   </div>
//                 }
//               />
//             </Route>
//             <Route
//               path="manage-company"
//               element={
//                 <div className="mt-10">
//                   <ManageCompany canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-reference"
//               element={
//                 <div className="mt-10">
//                   <ManageReference canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-employee"
//               element={
//                 <div className="mt-10">
//                   <ManageEmployee canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-employee-salary"
//               element={
//                 <div className="mt-10">
//                   <ManageEmployeeSalary canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="account-mass-link"
//               element={
//                 <div className="mt-10">
//                   <AccountMassLink canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="accounts-link"
//               element={
//                 <div className="mt-10">
//                   <AccountsLink canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-project-role"
//               element={
//                 <div className="mt-10">
//                   <ManageProjectRole canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-revenue"
//               element={
//                 <div className="mt-10">
//                   <ManageRevenue canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-revenue-formulas"
//               element={
//                 <div className="mt-10">
//                   <ManageRevenueFormulas canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="print-revenue-billing-formulas"
//               element={
//                 <div className="mt-10">
//                   <PrintProjectRevenueBillingFormulas canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-rate-sequence-orders"
//               element={
//                 <div className="mt-10">
//                   <ManageRateSequenceOrders canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-cogs"
//               element={
//                 <div className="mt-10">
//                   <ManageCostOfGoodsSold canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-alternate-project-revenue-profiles"
//               element={
//                 <div className="mt-10">
//                   <ManageAlternateProjectRevenueProfiles />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-alternate-revenue-profile-prior-year-history"
//               element={
//                 <div className="mt-10">
//                   <ManageAltRevProfilePriorYearHistory />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-project-revenue-calculation-value-history"
//               element={
//                 <div className="mt-10">
//                   <ManageProjRevCalcValHistory />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-revenue-evaluation-info-and-disclosures"
//               element={
//                 <div className="mt-10">
//                   <ManageRevenueEvaluationInfoAndDisclosures />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-revenue-evaluation-status-codes"
//               element={
//                 <div className="mt-10">
//                   <ManageRevenueEvaluationStatusCodes />
//                 </div>
//               }
//             />

//             {/* <Route
//               path="manage-hours-ceilings"
//               element={
//                 <div className="mt-10">
//                   <ManageHoursCeilings />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-employee-hours-ceilings"
//               element={
//                 <div className="mt-10">
//                   <ManageEmployeeHoursCeilings />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-vendor-hours-ceilings"
//               element={
//                 <div className="mt-10">
//                   <ManageVendorHoursCeilings />
//                 </div>
//               }
//             /> */}

//             <Route
//               path="manage-performance-obligation-type-codes"
//               element={
//                 <div className="mt-10">
//                   <ManagePerformanceObligationTypeCodes />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-total-ceilings"
//               element={
//                 <div className="mt-10">
//                   <ManageTotalCeilings />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-burden-cost-ceilings"
//               element={
//                 <div className="mt-10">
//                   <ManageBurdenCostCeilings />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-direct-cost-ceilings"
//               element={
//                 <div className="mt-10">
//                   <ManageDirectCostCeilings />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-burden-fee-overrides"
//               element={
//                 <div className="mt-10">
//                   <ManageBurdenFeeOverrides />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-cost-fee-overrides"
//               element={
//                 <div className="mt-10">
//                   <ManageCostFeeOverrides />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-multiplier-overrides"
//               element={
//                 <div className="mt-10">
//                   <ManageMultiplierOverrides />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-hours-ceilings"
//               element={
//                 <div className="mt-10">
//                   <ManageHoursCeilings />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-employee-hours-ceilings"
//               element={
//                 <div className="mt-10">
//                   <ManageEmployeeHoursCeilings />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-vendor-hours-ceilings"
//               element={
//                 <div className="mt-10">
//                   <ManageVendorHoursCeilings />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-plc"
//               element={
//                 <div className="mt-10">
//                   <ManageProjectLaborCategories />
//                 </div>
//               }
//             />

//             <Route
//               path="link-plc-to-projects"
//               element={
//                 <div className="mt-10">
//                   <ManageLinkPLCToProjects />
//                 </div>
//               }
//             />

//             <Route
//               path="link-plc-rates-to-projects"
//               element={
//                 <div className="mt-10">
//                   <ManageLinkPLCRatesToProjects />
//                 </div>
//               }
//             />

//             <Route
//               path="mass-add-project-workforce"
//               element={
//                 <div className="mt-10">
//                   <MassAddProjectWorkforce canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-project-workforce"
//               element={
//                 <div className="mt-10">
//                   <ManageEmployeeWorkforce canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-vendor-workforce"
//               element={
//                 <div className="mt-10">
//                   <ManageVendorWorkforce canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-vendor-employee-workforce"
//               element={
//                 <div className="mt-10">
//                   <ManageVendorEmployeeWorkforce canEdit={canEdit} />
//                 </div>
//               }
//             />

//             <Route
//               path="link-plc-rates-employee-vendor"
//               element={
//                 <div className="mt-10">
//                   <LinkPLCRatesToEmployeeVendor />
//                 </div>
//               }
//             />

//             <Route
//               path="print-project-workforce-report"
//               element={
//                 <div className="mt-10">
//                   <PrintProjectWorkforceReport />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-alternate-reporting-levels"
//               element={
//                 <div className="mt-10">
//                   <ManageAlternateReportingLevels />
//                 </div>
//               }
//             />

//             <Route
//               path="link-projects-accounts"
//               element={
//                 <div className="mt-10">
//                   <LinkProjectsAccounts />
//                 </div>
//               }
//             />

//             <Route
//               path="link-projects-accounts-organizations"
//               element={
//                 <div className="mt-10">
//                   <LinkProjectsAccountsOrganizations />
//                 </div>
//               }
//             />

//             <Route
//               path="mass-link-projects-accounts-organizations"
//               element={
//                 <div className="mt-10">
//                   <MassLinkProjectsAccountsOrganizations />
//                 </div>
//               }
//             />

//             <Route
//               path="link-projects-organizations"
//               element={
//                 <div className="mt-10">
//                   <LinkProjectsOrganizations />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-clin-information"
//               element={
//                 <div className="mt-10">
//                   <ManageCLINInformation />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-project-labor-history"
//               element={
//                 <div className="mt-10">
//                   <ManageProjectLaborHistory />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-prior-year-cost-and-revenue"
//               element={
//                 <div className="mt-10">
//                   <ManagePriorYearCostAndRevenue />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-prior-year-tm-revenue"
//               element={
//                 <div className="mt-10">
//                   <ManagePriorYearTimeAndMaterialsRevenue />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-prior-year-billable-value"
//               element={
//                 <div className="mt-10">
//                   <ManagePriorYearBillableValue />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-prior-year-unit-revenue"
//               element={
//                 <div className="mt-10">
//                   <ManagePriorYearUnitRevenue />
//                 </div>
//               }
//             />

//             <Route
//               path="active-inactive-projects"
//               element={
//                 <div className="mt-10">
//                   <ActiveInactiveProjects />
//                 </div>
//               }
//             />

//             <Route
//               path="update-project-contract-funded-values"
//               element={
//                 <div className="mt-10">
//                   <UpdateProjectContractAndFundedValues />
//                 </div>
//               }
//             />

//             <Route
//               path="update-project-period-of-performance"
//               element={
//                 <div className="mt-10">
//                   <UpdateProjectPeriodOfPerformance />
//                 </div>
//               }
//             />

//             <Route
//               path="import-project-master-data"
//               element={
//                 <div className="mt-10">
//                   <ImportProjectMasterData />
//                 </div>
//               }
//             />

//             <Route
//               path="configure-project-settings"
//               element={
//                 <div className="mt-10">
//                   <ConfigureProjectSettings />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-project-account-groups"
//               element={
//                 <div className="mt-10">
//                   <ManageProjectAccountGroups />
//                 </div>
//               }
//             />

//             <Route
//               path="print-project-account-group-setup-report"
//               element={
//                 <div className="mt-10">
//                   <PrintProjectAccountGroupSetupReport />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-project-types"
//               element={
//                 <div className="mt-10">
//                   <ManageProjectTypes />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-modification-descriptions"
//               element={
//                 <div className="mt-10">
//                   <ManageModificationDescriptions />
//                 </div>
//               }
//             />

//             <Route
//               path="user-defined-labels"
//               element={
//                 <div className="mt-10">
//                   <UserDefinedLabels />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-change-order-status"
//               element={
//                 <div className="mt-10">
//                   <ManageChangeOrderStatus />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-salary-cap-code"
//               element={
//                 <div className="mt-10">
//                   <ManageSalaryCapCode />
//                 </div>
//               }
//             />

//             <Route
//               path="manage-project-account-group-mappings"
//               element={
//                 <div className="mt-10">
//                   <ManageProjectAccountGroupMappings />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-project-organization-mappings"
//               element={
//                 <div className="mt-10">
//                   <ManageProjectOrganizationMappings />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-project-approver-settings"
//               element={
//                 <div className="mt-10">
//                   <ManageProjectApproverSettings />
//                 </div>
//               }
//             />
//             <Route
//               path="check-rebuild-project-segment-ids"
//               element={
//                 <div className="mt-10">
//                   <CheckAndRebuildProjectSegmentIds />
//                 </div>
//               }
//             />
//             <Route
//               path="purge-project-billing-information"
//               element={
//                 <div className="mt-10">
//                   <PurgeProjectAndBillingInformation />
//                 </div>
//               }
//             />
//             <Route
//               path="set-project-level-correctly"
//               element={
//                 <div className="mt-10">
//                   <SetProjectLevelCorrectlyInProjectMaster />
//                 </div>
//               }
//             />
//             <Route
//               path="synchronize-project-master-edit"
//               element={
//                 <div className="mt-10">
//                   <SynchronizeProjectMasterDataAndProjectEditData />
//                 </div>
//               }
//             />
//             <Route
//               path="update-poa-table"
//               element={
//                 <div className="mt-10">
//                   <UpdatePOATableWithValidLinksReferenceNumbers />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-change-orders"
//               element={
//                 <div className="mt-10">
//                   <ManageChangeOrders />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-udef-information"
//               element={
//                 <div className="mt-10">
//                   <ManageUDEFInformation />
//                 </div>
//               }
//             />
//             <Route
//               path="manage-gov-contract"
//               element={
//                 <div className="mt-10">
//                   <ManageGovernmentContractInformation />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/accounts-payable-configure"
//               element={
//                 <div className="mt-10">
//                   <ConfigureAccountsPayableSettings />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/check-email-setting"
//               element={
//                 <div className="mt-10">
//                   <ConfigureEmailSettings />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/accounts-payable-settings"
//               element={
//                 <div className="mt-10">
//                   <ManageAccountsPayableAccounts />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/cash-accounts"
//               element={
//                 <div className="mt-10">
//                   <ManageCashAccounts />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/accts-payable-voucher"
//               element={
//                 <div className="mt-10">
//                   <ConfigureAccountsPayableVoucherSettings />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/purchas-ord-vouch-sett"
//               element={
//                 <div className="mt-10">
//                   <ConfigurePurchaseOrderVoucherSettings />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/voucher-approver-sett"
//               element={
//                 <div className="mt-10">
//                   <ConfigureVoucherApproverSettings />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/recc-apV-code"
//               element={
//                 <div className="mt-10">
//                   <ManageRecurringAPVoucherCodes />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/insurance-carr-info"
//               element={
//                 <div className="mt-10">
//                   <ManageInsuranceCarrierInformation />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/const-industry-sch-code"
//               element={
//                 <div className="mt-10">
//                   <ManageConstructionindustrySchemeCodes />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/lien-waiver-document-names"
//               element={
//                 <div className="mt-10">
//                   <ManageLienWaiverDocumentNames />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/lien-waiver-information"
//               element={
//                 <div className="mt-10">
//                   <ManageLienWaiverInformation />
//                 </div>
//               }
//             />
//             <Route
//               path="accts-payable/credit-card-imp-info"
//               element={
//                 <div className="mt-10">
//                   <ManageCreditCardImportInfo />
//                 </div>
//               }
//             />
//           </Route>

//           <Route path="/service-unavailable" element={<ServiceUnavilabe />} />
//         </Routes>
//       </Router>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//       />
//     </>
//   );
// }

// export default App;

// // import React from "react";
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Login from "./components/Login";
// // import Dashboard from "./pages/Dashboard";

// // function App() {
// //   return (
// //     <>
// //      <Router>
// //       <Routes>
// //         <Route path="/" element={<Login />} />
// //         <Route path="/dashboard/*" element={<Dashboard />} />
// //       </Routes>
// //     </Router>
// //     <ToastContainer
// //         position="top-right"
// //         autoClose={3000}
// //         hideProgressBar={false}
// //         closeOnClick
// //       />
// //     </>

// //   );
// // }

// // export default App;

// import React from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Login from "./components/Login";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   if (import.meta.env.VITE_CHECK === "production") {
//     console.log = () => {};
//     console.info = () => {};
//     console.warn = () => {};
//     console.error = () => {};
//   }

//   return (
//     <>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/login" element={<Login />} /> {/* ADD THIS LINE */}
//           <Route path="/dashboard/*" element={<Dashboard />} />
//         </Routes>
//       </Router>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//       />
//     </>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages & Components
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import ProjectBudgetStatus from "./components/ProjectBudgetStatus";
import FinancialDashboard from "./components/FinancialDashboard";
import MassUtilityProject from "./components/MassUtilityProject";
import Pricing from "./components/Pricing";
import Import from "./components/Import";
import UserOrgProjectMapping from "./components/UserOrgProjectMapping";
import NewBusinessComponent from "./components/NewBusinessComponent";
import CreateProjectBudget from "./components/CreateProjectBudget";
import Opportunities from "./components/Opportunities";
import ManageGroups from "./components/ManageGroups";
import ManageUser from "./components/ManageUser";
import AnalysisByPeriodContent from "./components/AnalysisByPeriodContent";
import PoolRateTabs from "./components/PoolRateTabs";
import ConfigureField from "./components/ConfigureField";
import OverrideSettings from "./components/OverrideSettings";
import PoolConfigurationTable from "./components/PoolConfigurationTable";
import TemplatePoolMapping from "./components/TemplatePoolMapping";
import Template from "./components/Template";
import CeilingConfiguration from "./components/CeilingConfiguration";
import AnalogRate from "./components/AnalogRate";
import GlobalConfiguration from "./components/GlobalConfiguration";
import ProspectiveIdSetup from "./components/ProspectiveIdSetup";
import DisplaySettings from "./components/DisplaySettings";
import AnnualHolidays from "./components/HolidayCalendar";
import MaintainFiscalYearPeriods from "./components/MaintainFiscalYearPeriods";
import AccountMapping from "./components/AccountMapping";
import FinancialReport from "./components/FinancialReport";
import { backendUrl } from "./components/config";
import axios from "axios";
import DbTable from "./components/DbTable";
import api from "./utils/api";
import OrgMaster from "./components/OrgMaster";
import AccountMaster from "./components/AccountMaster";
import EmployeeMaster from "./components/EmployeeMaster";
import PLCMaster from "./components/PLCMaster";
import ProjectMaster from "./components/ProjectMaster";
import ManageRevFormulaForm from "./components/ManageRevFormulaForm";
import ManageRevformula from "./components/ManageRevformula";
import AccountGroupSetup from "./components/AccountGroupSetup";
import ManageAccountGroup from "./components/ManageAccountGroup";
import AccountTypeMaster from "./components/AccountTypeMaster";
import ManageCompany from "./components/ManageCompany";
import ServiceUnavilabe from "./components/ServiceUnavilabe";
import MasterDataManager from "./components/MasterDataManager";
import ManageUserGroups from "./components/ManageUserGroups";
import ManageOrganizationSecurityGroups from "./components/ManageOrganizationSecurityGroups";
import ManageOrganizationSecurityProfiles from "./components/ManageOrganizationSecurityProfiles";
import ManageFiscalYear from "./components/ManageFiscalYear";
import ManageAccountingPeriod from "./components/ManageAccountingPeriod";
import ManageSubperiod from "./components/ManageSubperiod";
import ManageProjectAccountGroups from "./components/ManageProjectAccountGroups";
import ManageVendor from "./components/ManageVendor";
import AccountMassLink from "./components/AccountMassLink";
import AccountLink from "./components/AccountsLink";
import UserDefineInformation from "./components/UserDefineInformation";
import UserDefineLabel from "./components/UserDefineLabel";
import HomePage from "./pages/Home";
// import ManageProspectiveVendors from "./components/prospectiveVendor/ManageProspectiveVendors";
// import ApproveProspectiveVendor from "./components/prospectiveVendor/ApproveProspectiveVendor";
import ManageReorganization from "./components/Reorganization/ManageReorganization";
import LinkOrgReorg from "./components/Reorganization/LinkOrgReorg";
import MassLinkOrgReorg from "./components/Reorganization/MassLinkOrgReorg";
import { VendorEmployeeDetail } from "./components/VendorEmployeeDetail";
import ManageProspectiveVendors from "./components/ManageProspectiveVendors";
import ManageReference from "./components/ManageReference";
import ManageVendorTerms from "./components/ManageVendorTerms";
import ManageEmployee from "./components/ManageEmployee";
import ManageCustomers from "./components/ManageCustomers";
import {
  ManageCompanyProperty,
  ManageProfessionalOrganization,
  ManageProspectiveVendorRejectionReasons,
  ManageSCISAPClearanceCode,
  ManageSecurityClearanceSettings,
  ManageSkillCodes,
  ManageSkillLevel,
  ManageSubcontractorBondTypes,
  ManageSubcontractorInsuranceTypes,
  ManageTrainingCodes,
  ManageTrainingSource,
  ManageVendorEmplApvlGrps,
} from "./components/VendorEmployeeSettingTabs";
import ConfigureVendorSettings from "./components/ConfigureVendorSettings";
import {
  CustomerCreditLimits,
  CustomerCreditRatings,
  CustomerTypes,
  ManageCustomerTerms,
  SalesTerritories,
  ShippingMethods,
} from "./components/ManageCustomerTerms";
import ApproveVendor from "./components/ApproveVendor";
import ApproveVendorEmployee from "./components/ApproveVendorEmployee";
import ManageCashAccounts from "./components/AccountsPayableControls/ManageCashAccounts";
import ConfigureEmailSettings from "./components/AccountsPayableControls/ConfigureEmailSettings";
import ManageAccountsPayableAccounts from "./components/AccountsPayableControls/ManageAccountsPayableAccounts";
import ConfigureAccountsPayableSettings from "./components/AccountsPayableControls/ConfigureAccountsPayableSettings";
import ConfigureAccountsPayableVoucherSettings from "./components/AccountsPayableControls/ConfigureAccountsPayableVoucherSettings";
import ConfigurePurchaseOrderVoucherSettings from "./components/AccountsPayableControls/ConfigurePurchaseOrderVoucherSettings";
import ConfigureVoucherApproverSettings from "./components/AccountsPayableControls/ConfigureVoucherApproverSettings";
import ManageRecurringAPVoucherCodes from "./components/AccountsPayableControls/ManageRecurringAPVoucherCodes";
import ManageInsuranceCarrierInformation from "./components/AccountsPayableControls/ManageInsuranceCarrierInformation";
import ManageConstructionindustrySchemeCodes from "./components/AccountsPayableControls/ManageConstructionindustrySchemeCodes";
import ManageAccountsPayableVouchers from "./components/ManageAccountsPayableVouchers";
import ApproveVouchers from "./components/ApproveVouchers";
import ManageCountry from "./components/ManageCountries";
import { ManageSalesTaxes } from "./components/ManageSalesTaxes";
import PrintProjectAccountGroupSetupReport from "./components/PrintProjectAccountGroupSetupReport";
import ManageProjectTypes from "./components/ManageProjectTypes";
import ManageModificationDescriptions from "./components/ManageModificationDescriptions";
import UserDefinedLabels from "./components/UserDefinedLabels";
import ManageChangeOrderStatus from "./components/ManageChangeOrderStatus";
import ManageSalaryCapCode from "./components/ManageSalaryCapCode";
import ManageProjectAccountGroupMappings from "./components/ManageProjectAccountGroupMappings";
import ManageProjectOrganizationMappings from "./components/ManageProjectOrganizationMappings";
import ManageProjectApproverSettings from "./components/ManageProjectApproverSettings";
import CheckAndRebuildProjectSegmentIds from "./components/CheckAndRebuildProjectSegmentIds";
import PurgeProjectAndBillingInformation from "./components/PurgeProjectAndBillingInformation";
import ManageEmployeeSalary from "./components/ManageEmployeeSalary";
import AccountsLink from "./components/ManageRefAccountLink";
import ManageProjectRole from "./components/ManageProjectRoles";
import ManageRevenue from "./components/ManageRevenue";
import ManageRevenueFormulas from "./components/ManageRevenueFormulas";
import PrintProjectRevenueBillingFormulas from "./components/PrintProjectRevenueBillingFormulas";
import ManageRateSequenceOrders from "./components/ManageRateSequenceOrders";
import ManageCostOfGoodsSold from "./components/ManageCostOfGoodsSold";

import ManageAlternateProjectRevenueProfiles from "./components/ManageAlternateProjectRevenueProfiles";
import ManageAltRevProfilePriorYearHistory from "./components/ManageAltRevProfilePriorYearHistory";
import ManageProjRevCalcValHistory from "./components/ManageProjRevCalcValHistory";
import ManageRevenueEvaluationInfoAndDisclosures from "./components/ManageRevenueEvaluationInfoAndDisclosures";
import ManageRevenueEvaluationStatusCodes from "./components/ManageRevenueEvaluationStatusCodes";
import ManagePerformanceObligationTypeCodes from "./components/ManagePerformanceObligationTypeCodes";
import ManageTotalCeilings from "./components/ManageTotalCeilings";
import ManageBurdenCostCeilings from "./components/ManageBurdenCostCeilings";
import ManageDirectCostCeilings from "./components/ManageDirectCostCeilings";
import ManageBurdenFeeOverrides from "./components/ManageBurdenFeeOverrides";
import ManageCostFeeOverrides from "./components/ManageCostFeeOverrides";
import ManageMultiplierOverrides from "./components/ManageMultiplierOverrides";
import ManageHoursCeilings from "./components/ManageHoursCeilings";
import ManageEmployeeHoursCeilings from "./components/ManageEmployeeHoursCeilings";
import ManageVendorHoursCeilings from "./components/ManageVendorHoursCeilings";
import ManageProjectLaborCategories from "./components/ManageProjectLaborCategories";
import ManageLinkPLCToProjects from "./components/ManageLinkPLCToProjects";
import ManageLinkPLCRatesToProjects from "./components/ManageLinkPLCRatesToProjects";
import MassAddProjectWorkforce from "./components/MassAddProjectWorkforce";
import ManageEmployeeWorkforce from "./components/ManageEmployeeWorkforce";
import ManageVendorWorkforce from "./components/ManageVendorWorkforce";
import ManageVendorEmployeeWorkforce from "./components/ManageVendorEmployeeWorkforce";
import LinkPLCRatesToEmployeeVendor from "./components/LinkPLCRatesToEmployeeVendor";
import PrintProjectWorkforceReport from "./components/PrintProjectWorkforceReport";
import ManageAlternateReportingLevels from "./components/ManageAlternateReportingLevels";
import LinkProjectsAccounts from "./components/LinkProjectsAccounts";
import LinkProjectsAccountsOrganizations from "./components/LinkProjectsAccountsOrganizations";
import MassLinkProjectsAccountsOrganizations from "./components/MassLinkProjectsAccountsOrganizations";
import LinkProjectsOrganizations from "./components/LinkProjectsOrganizations";
import ManageCLINInformation from "./components/ManageCLINInformation";
import ManageProjectLaborHistory from "./components/ManageProjectLaborHistory";
import ManagePriorYearCostAndRevenue from "./components/ManagePriorYearCostAndRevenue";
import ManagePriorYearTimeAndMaterialsRevenue from "./components/ManagePriorYearTimeAndMaterialsRevenue";
import ManagePriorYearBillableValue from "./components/ManagePriorYearBillableValue";
import ManagePriorYearUnitRevenue from "./components/ManagePriorYearUnitRevenue";
import ActiveInactiveProjects from "./components/ActiveInactiveProjects";
import UpdateProjectContractAndFundedValues from "./components/UpdateProjectContractAndFundedValues";
import UpdateProjectPeriodOfPerformance from "./components/UpdateProjectPeriodOfPerformance";
import ImportProjectMasterData from "./components/ImportProjectMasterData";
import ConfigureProjectSettings from "./components/ConfigureProjectSettings";
import SetProjectLevelCorrectlyInProjectMaster from "./components/SetProjectLevelCorrectlyInProjectMaster";
import SynchronizeProjectMasterDataAndProjectEditData from "./components/SynchronizeProjectMasterDataAndProjectEditData";
import UpdatePOATableWithValidLinksReferenceNumbers from "./components/UpdatePOATableWithValidLinksReferenceNumbers";
import ManageChangeOrders from "./components/ManageChangeOrders";
import ManageUDEFInformation from "./components/ManageUDEFInformation";
import ManageGovernmentContractInformation from "./components/ManageGovernmentContractInformation";
// import ConfigureVoucherApproverSettings from "./components/ConfigureVoucherApproverSettings";
// import ManageAccountsPayableAccounts from "./components/ManageAccountsPayableAccounts";
// import ManageCashAccounts from "./components/ManageCashAccounts";
// import ManageConstructionindustrySchemeCodes from "./components/ManageConstructionindustrySchemeCodes";
// import ManageInsuranceCarrierInformation from "./components/ManageInsuranceCarrierInformation";
import ManageLienWaiverDocumentNames from "./components/ManageLienWaiverDocumentNames";
import ManageLienWaiverInformation from "./components/ManageLienWaiverInformation";
// import ManageRecurringAPVoucherCodes from "./components/ManageRecurringAPVoucherCodes";
import ManageCreditCardImportInfo from "./components/ManageCreditCardImportInfo"; // Role-based Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const storedUser = localStorage.getItem("currentUser");
  if (!storedUser) return <Navigate to="/login" replace />;

  const userObj = JSON.parse(storedUser);
  if (!userObj.role || !allowedRoles.includes(userObj.role.toLowerCase())) {
    return <Navigate to="/api" replace />;
  }
  return children;
};

function App() {
  const [visibility, setVisibility] = useState({});
  const [loading, setLoading] = useState();

  if (import.meta.env.VITE_CHECK === "production") {
    console.log = console.info = console.warn = console.error = () => {};
  }

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch (e) {
      return null;
    }
  };

  const loadConfig = async () => {
    const user = getUserFromStorage();

    // If no user/userId, we can't fetch config. Stop loading.
    if (!user?.userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/UserGroups/GetAllPermissionsByUserId?CompanyId=1&UserId=${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token ?? ""}`,
          },
        },
      );

      // 1. Ensure data is an array (based on your snippet)
      const permissionsArray = Array.isArray(res.data) ? res.data : [];

      /**
       * 2. Transform array into a lookup object (Map)
       * Result will look like:
       * {
       * accountMapping: { canView: true, canEdit: true },
       * analogRate: { canView: true, canEdit: true }
       * }
       */
      const permissionsLookup = permissionsArray.reduce((acc, item) => {
        if (item.screenCode) {
          acc[item.screenCode] = {
            canView: item.canView,
            canEdit: item.canEdit,
          };
        }
        return acc;
      }, {});

      setVisibility(permissionsLookup);
      // const data = res.data || {};
      // const mergedVisibility = {
      //   ...(data.screens || {}),
      //   ...(data.fields || {}),
      // };

      console.log("permissionLookup", permissionsLookup);
      // setVisibility(mergedVisibility);
    } catch (e) {
      console.error("Error fetching configuration:", e);
      setVisibility({});
    } finally {
      // FIX: This ensures loading state is ALWAYS turned off
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const canView = (key) => {
    // Returns true if the screen exists in visibility and canView is true
    return visibility[key]?.canView === true;
  };

  const canEdit = (key) => {
    // Returns true if the screen exists in visibility and canEdit is true
    return visibility[key]?.canEdit === true;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center py-4 bg-blue-50">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 mt-4">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login loadConfig={loadConfig} />} />
          <Route path="/login" element={<Login loadConfig={loadConfig} />} />

          {/* Dashboard Layout and its Children */}
          <Route
            path="/dashboard"
            element={<Dashboard canView={canView} canEdit={canEdit} />}
          >
            <Route index element={<HomePage />} />
            {/* Default Index View */}
            <Route
              index
              element={
                <div className="flex items-center justify-center min-h-[80vh]">
                  <div className="max-w-md w-full text-center">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-transparent bg-clip-text">
                      FinAxis
                    </span>
                    <h1 className="text-2xl font-semibold text-gray-900 mt-4">
                      Welcome to FinAxis Planning
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Select an option from the sidebar to get started.
                    </p>
                  </div>
                </div>
              }
            />

            {/* General Routes */}
            <Route
              path="project-budget-status"
              element={
                <ProjectBudgetStatus canView={canView} canEdit={canEdit} />
              }
            />
            <Route
              path="db-table"
              element={
                <div className="mt-12 ml-2">
                  <DbTable />
                </div>
              }
            />
            <Route
              path="project-report"
              element={
                <div className="mt-12 ml-2">
                  <FinancialDashboard />
                </div>
              }
            />
            <Route
              path="mass-utility"
              element={
                <div className="mt-12 ml-2">
                  <MassUtilityProject />
                </div>
              }
            />
            <Route
              path="pricing"
              element={
                <div className="mt-12 ml-2">
                  <Pricing />
                </div>
              }
            />
            <Route
              path="import-utility"
              element={
                <div className="mt-12 ml-2">
                  <Import />
                </div>
              }
            />
            <Route
              path="projectmapping"
              element={<UserOrgProjectMapping canEdit={canEdit} />}
            />
            <Route
              path="new-business"
              element={
                <div className="mt-10">
                  <NewBusinessComponent canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="create-project-budget"
              element={
                <div className="mt-12 ml-2">
                  <CreateProjectBudget canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="import-opportunity"
              element={
                <div className="mt-12 ml-2">
                  <Opportunities />
                </div>
              }
            />
            <Route
              path="monthly-forecast"
              element={
                <div className="mt-12 ml-2">
                  <AnalysisByPeriodContent canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="financial-report"
              element={
                <div className="mt-12 ml-2">
                  <FinancialReport canEdit={canEdit} />
                </div>
              }
            />
            {/* Admin Only Routes */}
            <Route
              path="manage-groups"
              element={
                <div className="mt-12 ml-2">
                  <ManageGroups canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="manage-users"
              element={
                <div className="mt-12 ml-2">
                  <ManageUser canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="pool-rate-tabs"
              element={
                <div className="mt-12">
                  <PoolRateTabs canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="role-rights"
              element={
                <div className="mt-12 ml-2">
                  <ConfigureField loadConfigMain={loadConfig} />
                </div>
              }
            />
            <Route
              path="override-settings"
              element={
                <div className="mt-12 ml-2">
                  <OverrideSettings />
                </div>
              }
            />
            <Route
              path="pool-configuration"
              element={
                <div className="mt-12 ml-2">
                  <PoolConfigurationTable canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="template-pool-mapping"
              element={
                <div className="mt-12 ml-2">
                  <TemplatePoolMapping canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="template"
              element={
                <div className="mt-12 ml-2">
                  <Template canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="ceiling-configuration"
              element={
                <div className="mt-12">
                  <CeilingConfiguration />
                </div>
              }
            />
            <Route
              path="analog-rate"
              element={
                <div className="mt-12">
                  <AnalogRate />
                </div>
              }
            />
            <Route
              path="global-configuration"
              element={
                <div className="mt-12 ml-2">
                  <GlobalConfiguration canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="prospective-id-setup"
              element={
                <div className="mt-10">
                  <ProspectiveIdSetup />
                </div>
              }
            />
            <Route
              path="display-settings"
              element={
                <div className="mt-12 ml-2">
                  <DisplaySettings />
                </div>
              }
            />
            <Route
              path="annual-holidays"
              element={
                <div className="mt-4">
                  <AnnualHolidays canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="maintain-fiscal-year-periods"
              element={
                <div className="mt-12 ml-2">
                  <MaintainFiscalYearPeriods />
                </div>
              }
            />
            <Route
              path="account-mapping"
              element={
                <div className="mt-10">
                  <AccountMapping canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="account-master"
              element={
                <div className="mt-10">
                  <AccountMaster canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="org-master"
              element={
                <div className="mt-10">
                  <OrgMaster canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="employee-master"
              element={
                <div className="mt-10">
                  <EmployeeMaster canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="plc-master"
              element={
                <div className="mt-10">
                  <PLCMaster canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="project-master"
              element={
                <div className="mt-10">
                  <ProjectMaster canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="revenueFormula-master"
              element={
                <div className="mt-10">
                  <ManageRevformula canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="accountgroup-mapping"
              element={
                <div className="mt-10">
                  <AccountGroupSetup canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="accountgroupcode-master"
              element={
                <div className="mt-10">
                  <ManageAccountGroup canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="accounttype-master"
              element={
                <div className="mt-10">
                  <AccountTypeMaster canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="company-master"
              element={
                <div className="mt-10">
                  <ManageCompany canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="manage-data-manager"
              element={
                <div className="mt-10">
                  <MasterDataManager />
                </div>
              }
            />
            <Route
              path="manage-user-groups"
              element={
                <div className="mt-10">
                  <ManageUserGroups />
                </div>
              }
            />
            <Route
              path="manage-users"
              element={
                <div className="mt-10">
                  <ManageUserGroups />
                </div>
              }
            />
            <Route
              path="manage-customers"
              element={
                <div className="mt-10">
                  <ManageCustomers />
                </div>
              }
            />
            <Route
              path="user-suppression"
              element={
                <div className="mt-10">
                  <ManageUserGroups />
                </div>
              }
            />
            <Route
              path="groups-org-sec"
              element={
                <div className="mt-10">
                  <ManageOrganizationSecurityGroups />
                </div>
              }
            />
            <Route
              path="prof-org-sec"
              element={
                <div className="mt-10">
                  <ManageOrganizationSecurityProfiles />
                </div>
              }
            />
            <Route
              path="manage-fiscalyear"
              element={
                <div className="mt-10">
                  <ManageFiscalYear canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="period"
              element={
                <div className="mt-10">
                  <ManageAccountingPeriod canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="manage-accountingperiod"
              element={
                <div className="mt-10">
                  <ManageAccountingPeriod canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="manage-subperiod"
              element={
                <div className="mt-10">
                  <ManageSubperiod canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="manage-reference"
              element={
                <div className="mt-10">
                  <ManageReference canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="account-org-link"
              element={
                <div className="mt-10">
                  <AccountLink canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="employee-master-screen"
              element={
                <div className="mt-10">
                  <ManageEmployee canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="accounts-orgs-link"
              element={
                <div className="mt-10">
                  <AccountMassLink canEdit={canEdit} />
                </div>
              }
            />
            <Route
              path="accountgroupcode-master"
              element={
                <div className="mt-10">
                  <ManageAccountGroup canEdit={canEdit} />
                </div>
              }
            />
            {/* old */}
            <Route
              path="manage-project-acct-groups"
              element={
                <div className="mt-10">
                  <ManageProjectAccountGroups />
                </div>
              }
            />

            {/* <Route path="prospective-vendor">
              <Route
                path="manage-prospective-vendor"
                element={<ManageProspectiveVendors/>}
              />
              <Route
                path="approve-prospective-vendor"
                element={<ApproveProspectiveVendor/>}
              />
            </Route> */}
            <Route path="reorganization">
              <Route path="reorg-setup" element={<ManageReorganization />} />
              <Route path="link-org-reorg" element={<LinkOrgReorg />} />
              <Route path="masslink-org-reorg" element={<MassLinkOrgReorg />} />
            </Route>
            <Route path="customer">
              <Route
                path="manage-customer-crLimts"
                element={<CustomerCreditLimits />}
              />
              <Route
                path="manage-customer-terms"
                element={<ManageCustomerTerms />}
              />
              <Route path="manage-customer-types" element={<CustomerTypes />} />

              <Route
                path="manage-customer-crRating"
                element={<CustomerCreditRatings />}
              />
              <Route
                path="manage-customer-sTerr"
                element={<SalesTerritories />}
              />
              <Route
                path="manage-customer-sMethod"
                element={<ShippingMethods />}
              />
              <Route path="manage-customer" element={<ManageCustomers />} />
            </Route>
            <Route
              path="configure-vendor-settings"
              element={
                <div className="mt-10">
                  <ConfigureVendorSettings />
                </div>
              }
            />

            <Route path="vendSubControls">
              <Route
                path="manage-vendor-terms"
                element={
                  <div className="mt-10">
                    <ManageVendorTerms canEdit={canEdit} />
                  </div>
                }
              />
              <Route
                path="configVendSetting"
                element={<ConfigureVendorSettings />}
              />
              <Route
                path="secClearSettings"
                element={<ManageSecurityClearanceSettings />}
              />
              <Route
                path="insuranceTypes"
                element={<ManageSubcontractorInsuranceTypes />}
              />
              <Route
                path="bondTypes"
                element={<ManageSubcontractorBondTypes />}
              />
              <Route
                path="reasonCode"
                element={<ManageProspectiveVendorRejectionReasons />}
              />
              <Route
                path="scisapSettings"
                element={<ManageSCISAPClearanceCode />}
              />
              <Route
                path="vendoremplAprvlGrps"
                element={<ManageVendorEmplApvlGrps />}
              />
              <Route
                path="profOrg"
                element={<ManageProfessionalOrganization />}
              />
              <Route path="skillCodes" element={<ManageSkillCodes />} />
              <Route path="skillLevels" element={<ManageSkillLevel />} />
              <Route path="trainingCodes" element={<ManageTrainingCodes />} />
              <Route path="trainingSource" element={<ManageTrainingSource />} />
              <Route
                path="companyProperty"
                element={<ManageCompanyProperty />}
              />
            </Route>
            <Route path="userdefinedlabels">
              <Route
                path="organization"
                element={<UserDefineLabel master={"ORGANIZATION"} />}
              />
              <Route
                path="employee"
                element={<UserDefineLabel master={"EMPLOYEE"} />}
              />
              <Route
                path="account"
                element={<UserDefineLabel master={"ACCOUNT"} />}
              />
              <Route
                path="vendor"
                element={<UserDefineLabel master={"VENDOR"} />}
              />
            </Route>
            <Route path="userdefinedinformation">
              <Route
                path="organization"
                element={<UserDefineInformation master={"ORGANIZATION"} />}
              />
              <Route
                path="employee"
                element={<UserDefineInformation master={"EMPLOYEE"} />}
              />
              <Route
                path="account"
                element={<UserDefineInformation master={"ACCOUNT"} />}
              />
              <Route
                path="vendor"
                element={<UserDefineInformation master={"VENDOR"} />}
              />
            </Route>
            <Route path="vendor">
              <Route
                path="manage-prospective-vendors"
                element={
                  <div className="mt-10">
                    <ManageProspectiveVendors />
                  </div>
                }
              />
              <Route
                path="manage-vendors"
                element={
                  <div className="mt-10">
                    <ManageVendor />
                  </div>
                }
              />
              <Route
                path="vendor-employee-detail"
                element={
                  <div className="mt-10">
                    <VendorEmployeeDetail />
                  </div>
                }
              />
              <Route
                path="manage-prospective-vendor"
                element={
                  <div className="mt-10">
                    <ManageProspectiveVendors />
                  </div>
                }
              />
              <Route
                path="approve-vendor"
                element={
                  <div className="mt-10">
                    <ApproveVendor />
                  </div>
                }
              />
            </Route>
            <Route path="vendor-employee">
              <Route
                path="manage-vendor-employee"
                element={
                  <div className="mt-10 ml-4">
                    <VendorEmployeeDetail />
                  </div>
                }
              />
              <Route
                path="approve-vendor-employee"
                element={
                  <div className="mt-10">
                    <ApproveVendorEmployee />
                  </div>
                }
              />
            </Route>
            <Route path="accts-payable">
              <Route
                path="cash-accounts"
                element={
                  <div className="mt-10">
                    <ManageCashAccounts />
                  </div>
                }
              />
              <Route
                path="accounts-payable-settings"
                element={
                  <div className="mt-10">
                    <ManageAccountsPayableAccounts />
                  </div>
                }
              />
              <Route
                path="check-email-setting"
                element={
                  <div className="mt-10">
                    <ConfigureEmailSettings />
                  </div>
                }
              />
              <Route
                path="accounts-payable-configure"
                element={
                  <div className="mt-10">
                    <ConfigureAccountsPayableSettings />
                  </div>
                }
              />
              <Route
                path="accts-payable-voucher"
                element={
                  <div className="mt-10">
                    <ConfigureAccountsPayableVoucherSettings />
                  </div>
                }
              />
              <Route
                path="purchas-ord-vouch-sett"
                element={
                  <div className="mt-10">
                    <ConfigurePurchaseOrderVoucherSettings />
                  </div>
                }
              />
              <Route
                path="voucher-approver-sett"
                element={
                  <div className="mt-10">
                    <ConfigureVoucherApproverSettings />
                  </div>
                }
              />
              <Route
                path="recc-apV-code"
                element={
                  <div className="mt-10">
                    <ManageRecurringAPVoucherCodes />
                  </div>
                }
              />
              <Route
                path="insurance-carr-info"
                element={
                  <div className="mt-10">
                    <ManageInsuranceCarrierInformation />
                  </div>
                }
              />
              <Route
                path="const-industry-sch-code"
                element={
                  <div className="mt-10">
                    <ManageConstructionindustrySchemeCodes />
                  </div>
                }
              />
            </Route>
            <Route
              path="manage-company"
              element={
                <div className="mt-10">
                  <ManageCompany canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-reference"
              element={
                <div className="mt-10">
                  <ManageReference canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-employee"
              element={
                <div className="mt-10">
                  <ManageEmployee canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-employee-salary"
              element={
                <div className="mt-10">
                  <ManageEmployeeSalary canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="account-mass-link"
              element={
                <div className="mt-10">
                  <AccountMassLink canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="accounts-link"
              element={
                <div className="mt-10">
                  <AccountsLink canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-project-role"
              element={
                <div className="mt-10">
                  <ManageProjectRole canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-revenue"
              element={
                <div className="mt-10">
                  <ManageRevenue canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-revenue-formulas"
              element={
                <div className="mt-10">
                  <ManageRevenueFormulas canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="print-revenue-billing-formulas"
              element={
                <div className="mt-10">
                  <PrintProjectRevenueBillingFormulas canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-rate-sequence-orders"
              element={
                <div className="mt-10">
                  <ManageRateSequenceOrders canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-cogs"
              element={
                <div className="mt-10">
                  <ManageCostOfGoodsSold canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-alternate-project-revenue-profiles"
              element={
                <div className="mt-10">
                  <ManageAlternateProjectRevenueProfiles />
                </div>
              }
            />

            <Route
              path="manage-alternate-revenue-profile-prior-year-history"
              element={
                <div className="mt-10">
                  <ManageAltRevProfilePriorYearHistory />
                </div>
              }
            />

            <Route
              path="manage-project-revenue-calculation-value-history"
              element={
                <div className="mt-10">
                  <ManageProjRevCalcValHistory />
                </div>
              }
            />

            <Route
              path="manage-revenue-evaluation-info-and-disclosures"
              element={
                <div className="mt-10">
                  <ManageRevenueEvaluationInfoAndDisclosures />
                </div>
              }
            />
            <Route
              path="manage-revenue-evaluation-status-codes"
              element={
                <div className="mt-10">
                  <ManageRevenueEvaluationStatusCodes />
                </div>
              }
            />

            {/* <Route
              path="manage-hours-ceilings"
              element={
                <div className="mt-10">
                  <ManageHoursCeilings />
                </div>
              }
            />

            <Route
              path="manage-employee-hours-ceilings"
              element={
                <div className="mt-10">
                  <ManageEmployeeHoursCeilings />
                </div>
              }
            />

            <Route
              path="manage-vendor-hours-ceilings"
              element={
                <div className="mt-10">
                  <ManageVendorHoursCeilings />
                </div>
              }
            /> */}

            <Route
              path="manage-performance-obligation-type-codes"
              element={
                <div className="mt-10">
                  <ManagePerformanceObligationTypeCodes />
                </div>
              }
            />
            <Route
              path="manage-total-ceilings"
              element={
                <div className="mt-10">
                  <ManageTotalCeilings />
                </div>
              }
            />
            <Route
              path="manage-burden-cost-ceilings"
              element={
                <div className="mt-10">
                  <ManageBurdenCostCeilings />
                </div>
              }
            />
            <Route
              path="manage-direct-cost-ceilings"
              element={
                <div className="mt-10">
                  <ManageDirectCostCeilings />
                </div>
              }
            />
            <Route
              path="manage-burden-fee-overrides"
              element={
                <div className="mt-10">
                  <ManageBurdenFeeOverrides />
                </div>
              }
            />
            <Route
              path="manage-cost-fee-overrides"
              element={
                <div className="mt-10">
                  <ManageCostFeeOverrides />
                </div>
              }
            />
            <Route
              path="manage-multiplier-overrides"
              element={
                <div className="mt-10">
                  <ManageMultiplierOverrides />
                </div>
              }
            />

            <Route
              path="manage-hours-ceilings"
              element={
                <div className="mt-10">
                  <ManageHoursCeilings />
                </div>
              }
            />

            <Route
              path="manage-employee-hours-ceilings"
              element={
                <div className="mt-10">
                  <ManageEmployeeHoursCeilings />
                </div>
              }
            />

            <Route
              path="manage-vendor-hours-ceilings"
              element={
                <div className="mt-10">
                  <ManageVendorHoursCeilings />
                </div>
              }
            />

            <Route
              path="manage-plc"
              element={
                <div className="mt-10">
                  <ManageProjectLaborCategories />
                </div>
              }
            />

            <Route
              path="link-plc-to-projects"
              element={
                <div className="mt-10">
                  <ManageLinkPLCToProjects />
                </div>
              }
            />

            <Route
              path="link-plc-rates-to-projects"
              element={
                <div className="mt-10">
                  <ManageLinkPLCRatesToProjects />
                </div>
              }
            />

            <Route
              path="mass-add-project-workforce"
              element={
                <div className="mt-10">
                  <MassAddProjectWorkforce canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-project-workforce"
              element={
                <div className="mt-10">
                  <ManageEmployeeWorkforce canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-vendor-workforce"
              element={
                <div className="mt-10">
                  <ManageVendorWorkforce canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="manage-vendor-employee-workforce"
              element={
                <div className="mt-10">
                  <ManageVendorEmployeeWorkforce canEdit={canEdit} />
                </div>
              }
            />

            <Route
              path="link-plc-rates-employee-vendor"
              element={
                <div className="mt-10">
                  <LinkPLCRatesToEmployeeVendor />
                </div>
              }
            />

            <Route
              path="print-project-workforce-report"
              element={
                <div className="mt-10">
                  <PrintProjectWorkforceReport />
                </div>
              }
            />

            <Route
              path="manage-alternate-reporting-levels"
              element={
                <div className="mt-10">
                  <ManageAlternateReportingLevels />
                </div>
              }
            />

            <Route
              path="link-projects-accounts"
              element={
                <div className="mt-10">
                  <LinkProjectsAccounts />
                </div>
              }
            />

            <Route
              path="link-projects-accounts-organizations"
              element={
                <div className="mt-10">
                  <LinkProjectsAccountsOrganizations />
                </div>
              }
            />

            <Route
              path="mass-link-projects-accounts-organizations"
              element={
                <div className="mt-10">
                  <MassLinkProjectsAccountsOrganizations />
                </div>
              }
            />

            <Route
              path="link-projects-organizations"
              element={
                <div className="mt-10">
                  <LinkProjectsOrganizations />
                </div>
              }
            />

            <Route
              path="manage-clin-information"
              element={
                <div className="mt-10">
                  <ManageCLINInformation />
                </div>
              }
            />

            <Route
              path="manage-project-labor-history"
              element={
                <div className="mt-10">
                  <ManageProjectLaborHistory />
                </div>
              }
            />

            <Route
              path="manage-prior-year-cost-and-revenue"
              element={
                <div className="mt-10">
                  <ManagePriorYearCostAndRevenue />
                </div>
              }
            />

            <Route
              path="manage-prior-year-tm-revenue"
              element={
                <div className="mt-10">
                  <ManagePriorYearTimeAndMaterialsRevenue />
                </div>
              }
            />

            <Route
              path="manage-prior-year-billable-value"
              element={
                <div className="mt-10">
                  <ManagePriorYearBillableValue />
                </div>
              }
            />

            <Route
              path="manage-prior-year-unit-revenue"
              element={
                <div className="mt-10">
                  <ManagePriorYearUnitRevenue />
                </div>
              }
            />

            <Route
              path="active-inactive-projects"
              element={
                <div className="mt-10">
                  <ActiveInactiveProjects />
                </div>
              }
            />

            <Route
              path="update-project-contract-funded-values"
              element={
                <div className="mt-10">
                  <UpdateProjectContractAndFundedValues />
                </div>
              }
            />

            <Route
              path="update-project-period-of-performance"
              element={
                <div className="mt-10">
                  <UpdateProjectPeriodOfPerformance />
                </div>
              }
            />

            <Route
              path="import-project-master-data"
              element={
                <div className="mt-10">
                  <ImportProjectMasterData />
                </div>
              }
            />

            <Route
              path="configure-project-settings"
              element={
                <div className="mt-10">
                  <ConfigureProjectSettings />
                </div>
              }
            />

            <Route
              path="manage-project-account-groups"
              element={
                <div className="mt-10">
                  <ManageProjectAccountGroups />
                </div>
              }
            />

            <Route
              path="print-project-account-group-setup-report"
              element={
                <div className="mt-10">
                  <PrintProjectAccountGroupSetupReport />
                </div>
              }
            />

            <Route
              path="manage-project-types"
              element={
                <div className="mt-10">
                  <ManageProjectTypes />
                </div>
              }
            />

            <Route
              path="manage-modification-descriptions"
              element={
                <div className="mt-10">
                  <ManageModificationDescriptions />
                </div>
              }
            />

            <Route
              path="user-defined-labels"
              element={
                <div className="mt-10">
                  <UserDefinedLabels />
                </div>
              }
            />

            <Route
              path="manage-change-order-status"
              element={
                <div className="mt-10">
                  <ManageChangeOrderStatus />
                </div>
              }
            />

            <Route
              path="manage-salary-cap-code"
              element={
                <div className="mt-10">
                  <ManageSalaryCapCode />
                </div>
              }
            />

            <Route
              path="manage-project-account-group-mappings"
              element={
                <div className="mt-10">
                  <ManageProjectAccountGroupMappings />
                </div>
              }
            />
            <Route
              path="manage-project-organization-mappings"
              element={
                <div className="mt-10">
                  <ManageProjectOrganizationMappings />
                </div>
              }
            />
            <Route
              path="manage-project-approver-settings"
              element={
                <div className="mt-10">
                  <ManageProjectApproverSettings />
                </div>
              }
            />
            <Route
              path="check-rebuild-project-segment-ids"
              element={
                <div className="mt-10">
                  <CheckAndRebuildProjectSegmentIds />
                </div>
              }
            />
            <Route
              path="purge-project-billing-information"
              element={
                <div className="mt-10">
                  <PurgeProjectAndBillingInformation />
                </div>
              }
            />
            <Route
              path="set-project-level-correctly"
              element={
                <div className="mt-10">
                  <SetProjectLevelCorrectlyInProjectMaster />
                </div>
              }
            />
            <Route
              path="synchronize-project-master-edit"
              element={
                <div className="mt-10">
                  <SynchronizeProjectMasterDataAndProjectEditData />
                </div>
              }
            />
            <Route
              path="update-poa-table"
              element={
                <div className="mt-10">
                  <UpdatePOATableWithValidLinksReferenceNumbers />
                </div>
              }
            />
            <Route
              path="manage-change-orders"
              element={
                <div className="mt-10">
                  <ManageChangeOrders />
                </div>
              }
            />
            <Route
              path="manage-udef-information"
              element={
                <div className="mt-10">
                  <ManageUDEFInformation />
                </div>
              }
            />
            <Route
              path="manage-gov-contract"
              element={
                <div className="mt-10">
                  <ManageGovernmentContractInformation />
                </div>
              }
            />
            <Route
              path="accts-payable/accounts-payable-configure"
              element={
                <div className="mt-10">
                  <ConfigureAccountsPayableSettings />
                </div>
              }
            />
            <Route
              path="accts-payable/check-email-setting"
              element={
                <div className="mt-10">
                  <ConfigureEmailSettings />
                </div>
              }
            />
            <Route
              path="accts-payable/accounts-payable-settings"
              element={
                <div className="mt-10">
                  <ManageAccountsPayableAccounts />
                </div>
              }
            />
            <Route
              path="accts-payable/cash-accounts"
              element={
                <div className="mt-10">
                  <ManageCashAccounts />
                </div>
              }
            />
            <Route
              path="accts-payable/accts-payable-voucher"
              element={
                <div className="mt-10">
                  <ConfigureAccountsPayableVoucherSettings />
                </div>
              }
            />
            <Route
              path="accts-payable/purchas-ord-vouch-sett"
              element={
                <div className="mt-10">
                  <ConfigurePurchaseOrderVoucherSettings />
                </div>
              }
            />
            <Route
              path="accts-payable/voucher-approver-sett"
              element={
                <div className="mt-10">
                  <ConfigureVoucherApproverSettings />
                </div>
              }
            />
            <Route
              path="accts-payable/recc-apV-code"
              element={
                <div className="mt-10">
                  <ManageRecurringAPVoucherCodes />
                </div>
              }
            />
            <Route
              path="accts-payable/insurance-carr-info"
              element={
                <div className="mt-10">
                  <ManageInsuranceCarrierInformation />
                </div>
              }
            />
            <Route
              path="accts-payable/const-industry-sch-code"
              element={
                <div className="mt-10">
                  <ManageConstructionindustrySchemeCodes />
                </div>
              }
            />
            <Route
              path="accts-payable/lien-waiver-document-names"
              element={
                <div className="mt-10">
                  <ManageLienWaiverDocumentNames />
                </div>
              }
            />
            <Route
              path="accts-payable/lien-waiver-information"
              element={
                <div className="mt-10">
                  <ManageLienWaiverInformation />
                </div>
              }
            />
            <Route
              path="accts-payable/credit-card-imp-info"
              element={
                <div className="mt-10">
                  <ManageCreditCardImportInfo />
                </div>
              }
            />
            <Route
              path="accts-payable/accounts-payable-vouchers"
              element={
                <div className="mt-10">
                  <ManageAccountsPayableVouchers />
                </div>
              }
            />
            <Route
              path="accts-payable/approve-vouchers"
              element={
                <div className="mt-10">
                  <ApproveVouchers />
                </div>
              }
            />
            <Route
              path="manage-countries"
              element={
                <div className="mt-10">
                  <ManageCountry />
                </div>
              }
            />
            <Route
              path="manage-sales-taxes"
              element={
                <div className="mt-10">
                  <ManageSalesTaxes />
                </div>
              }
            />
          </Route>

          <Route path="/service-unavailable" element={<ServiceUnavilabe />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
      />
    </>
  );
}

export default App;
