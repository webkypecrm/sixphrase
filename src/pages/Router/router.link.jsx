import { Navigate, Route } from "react-router";
import { all_routes } from "./all_routes";

import SalesDashboardPage from "../Dashboard/SalesDashboardPage"
import StaffPage from '../HRMS/StaffPage'
import AttendanceLog from "../HRMS/AttendanceLog";
import StaffDetailPage from "../HRMS/StaffDetailPage";
import RolesPermissions from "../HRMS/RolesPermissions";

import ProductPage from '../Product/Product'

import ServicePage from "../Services/Services";

import LeadsPage from "../Sales/LeadsPage";
import LeadsKanban from "../Sales/LeadsKanban";
import LeadDetailsPage from "../Sales/LeadDetailsPage";
import UpcomingAppointments from "../Sales/UpcomingAppointments";
import UpcomingCalls from "../Sales/UpcomingCalls";

import CustomerPage from "../Customer/CustomerPage";
import CustomerList from "../Customer/CustomerList";
import CustomerGrid from "../Customer/CustomerGrid";
import CustomerDetails from "../Customer/CustomerDetailsPage"

import Companies from "../Subscription/Companies";
import CompaniesGrid from "../Subscription/CompaniesGrid";
import CompaniesDetails from "../Subscription/CompaniesDetails"
import MembershipAddon from "../Subscription/MembershipAddon";
import MembershipTransaction from "../Subscription/MembershipTransaction";
import Membershipplan from "../Subscription/MembershipPlan";

import Task from "../Task/TaskPage";
import TaskDetailsPage from "../Task/TaskDetailsPage"



import Profile from "../Settings/General Settings/Profile";
import Security from "../Settings/General Settings/Security";
import Notifications from "../Settings/General Settings/Notifications";
import ConnectedApps from "../Settings/General Settings/ConnectedApps";

import CompanySettings from "../Settings/Website Settings/CompanySetting";
import Language from "../Settings/Website Settings/Language";
import Preference from "../Settings/Website Settings/Preference";
import Prefixes from "../Settings/Website Settings/Prefixes";
import Appearance from "../Settings/Website Settings/Appearance";
import Localization from "../Settings/Website Settings/Localization";

import CustomFields from "../Settings/App Settings/CustomFields";
import Invoice from "../Settings/App Settings/Invoice";
import Printers from "../Settings/App Settings/Printers";

import BankAccounts from "../Settings/Financial Settings/BankAccounts";
import Currencies from "../Settings/Financial Settings/Currencies";
import PaymentGateways from "../Settings/Financial Settings/PaymentGateways";
import TaxRates from "../Settings/Financial Settings/TaxRates";

import EmailSettings from "../Settings/System Settings/Email";
import GdprCookies from "../Settings/System Settings/GdprCookies";
import SmsGateways from "../Settings/System Settings/SmsGateways";

import Storage from "../Settings/Other Settings/Storage";
import BanIpAddress from "../Settings/Other Settings/BanIpAddress";

// import Sources from "../Settings/Master/Sources";
// import LostReason from "../Settings/Master/LostReason";
// import ContactStage from "../Settings/Master/ContactStage";
// import Industry from "../Settings/Master/Industry";
// import Calls from "../Settings/Master/Calls";

import Department from "../SetUp/StaffMaster/Department";
import Role from "../SetUp/StaffMaster/Role";
import Group from "../SetUp/StaffMaster/Group";
import JobType from "../SetUp/StaffMaster/JobType";
import WorkShift from "../SetUp/StaffMaster/WorkShift";
import FacebookToken from "../SetUp/StaffMaster/FacebookToken";

import Source from "../SetUp/SalesMaster/Source";
import Reasons from "../SetUp/SalesMaster/Reasons";
import Industry from "../SetUp/SalesMaster/Industry";
import Stage from "../SetUp/SalesMaster/Stage";

import TaskCategory from "../SetUp/TaskMaster/TaskCategory";
import TaskSubCategory from "../SetUp/TaskMaster/TaskSubCategory";

import TicketStage from "../Support/TicketStage";
import Faq from "../Content/Faq";
import Chat from "../Application/Chat";
import VideoCall from "../Application/VideoCall";
import Todo from "../Application/ToDo";
import FileManager from "../Application/FileManager";
import CallHistory from "../Application/CallHistory";
import AudioCall from "../Application/AudioCall";
import Email from "../Application/Email";
import Notes from "../Application/Notes";
import Calendar from "../Application/Calender";

import Deals from "../Marketing/Deals";
import DealsDetails from "../Marketing/DealsDetails";
import DealsKanban from "../Marketing/DealsKanban";
import Campaign from "../Marketing/Campaign";

import SalesReportData from "../Report/SalesReportsData"
import SalesReportsPage from "../Report/SalesReport";
import ReportPage from "../Report/ReportPage";
import SalesReport from "../Report/SalesReportPage"
import AccountReport from "../Report/AccountReportPage"
import LeadReport from "../Report/LeadReportPage"
import StaffReport from "../Report/StaffReportPage"

import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ForgotPassword from "../Auth/ForgotPassword";
import InvoicePage from "../Finance/InvoicePage";
import InvoiceDetailsPage from "../Finance/InvoiceDetailsPage";
import Category from "../SetUp/SalesMaster/Category";
import AppointmentPage from "../Appointment/AppointmentPage";
import LeadFor from "../SetUp/SalesMaster/LeadFor";
import Service from "../SetUp/SalesMaster/Service";
import PaymentPage from "../Payments/PaymentPage";
import VendorsPage from "../Vendors/VendorsPage";
import VendorCategory from "../SetUp/VendorMaster/VendorCategory";
import VendorSubCategory from "../SetUp/VendorMaster/VendorSubCategory";
import ExpensePage from "../Expense/ExpensePage";
import PaidExpensePage from "../PaidExpense/PaidExpensePage";
import StaffDetails from "../../components/HRMS/StaffDetails";
import ManagebyDay from "../../components/HRMS/ManagebyDay";
import MiniCalender from "../../components/HRMS/MiniCalender";
import Companey from "../Companey/Companey";
import ProductCategory from "../SetUp/ProductMaster/ProductCategory";
import ProductSubCategory from "../SetUp/ProductMaster/ProductSubCategory";
import ProductS_SubCategory from "../SetUp/ProductMaster/ProductS_SubCategory";
import ProductBrands from "../SetUp/ProductMaster/ProductBrands";
import ProductOEM from "../SetUp/ProductMaster/ProductOEM";
import ManageTicket from "../Support/ManageTicket";
import TicketDetails from "../Support/TicketDetails";
import ServiceCategory from "../SetUp/ServicesMaster/ServiceCategory";
import ServiceSubCategory from "../SetUp/ServicesMaster/ServiceSubCategory";
import ServiceS_SubCategory from "../SetUp/ServicesMaster/ServiceS_SubCategory";
import Branch from "../Companey/Branch";
import Teams from "../CRM/Teams/Teams";
import Target from "../CRM/Target";
import SupportCategory from "../SetUp/SupportCrmMaster/SupportCategory";
import SupportSubCate from "../SetUp/SupportCrmMaster/SupportSubCate";
import AiChatbot from "../../Ai-AddOn/AiChatbot";
// import Progress from "../Support/Progress/Progress";
import Progress from "../../pages/Support/Progress/Progress";
import { Closed } from "../Support/Closed/Closed";
import Chatbot from "../../Ai-AddOn/Chatbot";
import Grade from "../SetUp/GradeMaster/Grade";
import Payroll from "../HRMS/Payroll";

const route = all_routes;

export const publicRoutes = [
    {
        path: route.payroll,
        element: <Payroll/>
    },
    {
        path: route.grade,
        element: <Grade/>
    },
    {
        path: route.chatbot,
        element: <Chatbot/>
    },
    {
        path: route.Aichatbot,
        element: <AiChatbot/>
    },
    {
        path: route.supportCategory,
        element: <SupportCategory/>
    },
    {
        path: route.supportSubCategory,
        element: <SupportSubCate/>
    },
    {
        path: route.targets,
        element: <Target/>
    },
    {
        path: route.teams,
        element: <Teams/>
    },
    {
        path: route.productCategory,
        element: <ProductCategory/>,
    },
    {
        path: route.productSubCategory,
        element: <ProductSubCategory/>,
    },
    {
        path: route.productS_SubCategory,
        element: <ProductS_SubCategory/>,
    },
    {
        path: route.productBrands,
        element: <ProductBrands/>,
    },
    {
        path: route.productOEM,
        element: <ProductOEM/>,
    },
    {
        path: route.companey,
        element: <Companey/>,
    },
    {
        path: route.branch,
        element: <Branch/>,
    },
    {
        path: route.minicalender,
        element: <MiniCalender/>,
    },
    {
        path: `${route.managebyday}/:year/:month/:id`,
        element: <ManagebyDay/>,
    },
    {
        path: `${route.staffmanage}/:id`,
        element: <StaffDetails/>,
    },
    {
        path: route.salesDashboard,
        element: <SalesDashboardPage />,
    },
    {
        path: '/',
        name: 'Root',
        element: <Navigate to="/login" />,
    },
    {
        path: route.manageStaff,
        element: <StaffPage />,
    },
    {
        path: route.attendanceLog,
        element: <AttendanceLog />
    },
    {
        path: route.staffDetails,
        element: <StaffDetailPage />,
    },
    {
        path: route.rolesPermissions,
        element: <RolesPermissions />,
    },
    {
        path: route.product,
        element: <ProductPage />,
    },
    {
        path: route.services,
        element: <ServicePage />,
    },
    {
        path: route.serviceCategory,
        element: <ServiceCategory/>,
    },
    {
        path: route.serviceSubCategory,
        element: <ServiceSubCategory/>,
    },
    {
        path: route.serviceS_SubCategory,
        element: <ServiceS_SubCategory/>,
    },
    {
        path: route.leads,
        element: <LeadsPage />,
    },
    {
        path: route.salesReports,
        element: <SalesReportsPage />,
    },
    {
        path: route.reports,
        element: <ReportPage />,
    },
    {
        path: route.salesReportsData,
        element: <SalesReportData />,
    },
    {
        path: route.salesReport,
        element: <SalesReport />,
    },
    {
        path: route.accountReport,
        element: <AccountReport />,
    },
    {
        path: route.leadReport,
        element: <LeadReport />,
    }, {
        path: route.staffReport,
        element: <StaffReport />,
    },
    {
        path: route.upcomingAppointments,
        element: <UpcomingAppointments />,
    },
    {
        path: route.upcomingCalls,
        element: <UpcomingCalls />,
    },
    {
        path: route.leadsKanban,
        element: <LeadsKanban />,
    },
    {
        path: route.leadsDetails,
        element: <LeadDetailsPage />
    },
    {
        path: route.customers,
        element: <CustomerPage />,
    },
    {
        path: route.customerList,
        element: <CustomerList />,
    },
    {
        path: route.customerGrid,
        element: <CustomerGrid />,
    },
    {
        path: route.customerDetails,
        element: <CustomerDetails />,
    },
    {
        path: route.companies,
        element: <Companies />,
    },
    {
        path: route.companiesGrid,
        element: <CompaniesGrid />,
    },
    {
        path: route.companyDetails,
        element: <CompaniesDetails />,
    },
    {
        path: route.membershipplan,
        element: <Membershipplan />,
    },
    {
        path: route.membershipAddon,
        element: <MembershipAddon />,
    },
    {
        path: route.membershipTransaction,
        element: <MembershipTransaction />,
    },
    {
        path: route.invoice,
        element: <InvoicePage />
    },
    {
        path: route.payment,
        element: <PaymentPage />
    },
    {
        path: route.invoiceDetails,
        element: <InvoiceDetailsPage />
    },
    {
        path: route.tasks,
        element: <Task />,
    },
    {
        path: route.taskDetails,
        element: <TaskDetailsPage />,
    },
    {
        path: route.vendors,
        element: <VendorsPage />
    },
    // {
    //     path: route.vendorDetails,
    //     element: <vendorDetails />
    // },
    {
        path: route.expense,
        element: <ExpensePage />
    },
    {
        path: route.paidExpense,
        element: <PaidExpensePage />
    },
    {
        path: route.department,
        element: <Department />,
    },
    {
        path: route.role,
        element: <Role />,
    },
    {
        path: route.leadFor,
        element: <LeadFor />,
    },
    {
        path: route.service,
        element: <Service />,
    },
    {
        path: route.group,
        element: <Group />,
    },
    {
        path: route.jobType,
        element: <JobType />,
    },
    {
        path: route.facebookToken,
        element: <FacebookToken />
    },
    {
        path: route.workShift,
        element: <WorkShift />,
    },
    {
        path: route.source,
        element: <Source />,
    },
    {
        path: route.reasons,
        element: <Reasons />,
    },
    {
        path: route.industry,
        element: <Industry />,
    },
    {
        path: route.category,
        element: <Category />,
    },
    {
        path: route.stage,
        element: <Stage />,
    },
    {
        path: route.taskCategory,
        element: <TaskCategory />,
    },
    {
        path: route.taskSubCategory,
        element: <TaskSubCategory />,
    },
    {
        path: route.vendorCategory,
        element: <VendorCategory />,
    },
    {
        path: route.vendorSubCategory,
        element: <VendorSubCategory />,
    },
    {
        path: route.appointment,
        element: <AppointmentPage />,
    },
    // {
    //     path: route.lostReason,
    //     element: <LostReason />,
    // },
    // {
    //     path: route.contactStage,
    //     element: <ContactStage />,
    // },

    // {
    //     path: route.calls,
    //     element: <Calls />,
    // },
    {
        path: route.connectedApps,
        element: <ConnectedApps />,
    },
    {
        path: route.notification,
        element: <Notifications />,
    },
    {
        path: route.profile,
        element: <Profile />,
    },
    {
        path: route.security,
        element: <Security />,
    },
    {
        path: route.appearance,
        element: <Appearance />,
    },
    {
        path: route.companySettings,
        element: <CompanySettings />,
    },
    {
        path: route.language,
        element: <Language />,
    },
    {
        path: route.localization,
        element: <Localization />,
    },
    {
        path: route.preference,
        element: <Preference />,
    },
    {
        path: route.prefixes,
        element: <Prefixes />,
    },
    {
        path: route.invoiceSettings,
        element: <Invoice />,
    },
    {
        path: route.currencies,
        element: <Currencies />,
    },
    {
        path: route.customFields,
        element: <CustomFields />,
    },
    {
        path: route.printers,
        element: <Printers />,
    },
    {
        path: route.bankAccounts,
        element: <BankAccounts />,
    },
    {
        path: route.currencies,
        element: <Currencies />,
    },
    {
        path: route.paymentGateways,
        element: <PaymentGateways />,
    },
    {
        path: route.taxRates,
        element: <TaxRates />,
    },
    {
        path: route.banIpAddrress,
        element: <BanIpAddress />,
    },
    {
        path: route.storage,
        element: <Storage />,
    },
    {
        path: route.emailSettings,
        element: <EmailSettings />,
    },
    {
        path: route.gdprCookies,
        element: <GdprCookies />,
    },
    {
        path: route.smsGateways,
        element: <SmsGateways />,
    },
    {
        path: route.faq,
        element: <Faq />,
    },
    //   {
    //     path: route.contactMessages,
    //     element: <ContactMessages />,
    //     route: Route,
    //   },
    {
        path: route.closedTicket,
        element: <Closed/>,
    },
    {
        path: route.progressTicket,
        element: <Progress/>,
    },
    {
        path: route.ticketStage,
        element: <TicketStage />,
    },
    {
        path: route.manegeTicket,
        element: <ManageTicket/>,
    },
    {
        path: `${route.ticketDetails}/:id`,
        element: <TicketDetails/>,
    },
    {
        path: route.audioCall,
        element: <AudioCall />,
    },
    {
        path: route.callHistory,
        element: <CallHistory />,
    },
    {
        path: route.todo,
        element: <Todo />,
    },
    {
        path: route.email,
        element: <Email />,
    },
    {
        path: route.videoCall,
        element: <VideoCall />,
    },
    {
        path: route.chat,
        element: <Chat />,
    },
    {
        path: route.fileManager,
        element: <FileManager />,
    },
    {
        path: route.notes,
        element: <Notes />,
    },
    {
        path: route.calendar,
        element: <Calendar />,
    },

    {
        path: route.deals,
        element: <Deals />,
    },
    {
        path: route.dealsDetails,
        element: <DealsDetails />,
    },
    {
        path: route.dealsKanban,
        element: <DealsKanban />,
    },
    {
        path: route.campaign,
        element: <Campaign />,
    },
];

export const authRoutes = [
    //   {
    //     path: route.comingSoon,
    //     element: <ComingSoon />,
    //     route: Route,
    //   },
    {
        path: route.login,
        element: <Login />,
    },
    {
        path: route.register,
        element: <Register />,
    },
    {
        path: route.forgotPassword,
        element: <ForgotPassword />,
    },

];
