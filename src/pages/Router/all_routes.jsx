
export const all_routes = {
    // dashboard routes
    salesDashboard: "/dashboard/sales-dashboard",
    supportDashboard: "/dashboard/leads-dashboard",
    staffDashboard: "/dashboard/staff-dashboard",

    //product
    product: "/product",

    //services
    services: '/services',


    // companey routes
    companey: "/manage-companey",
    branch: "/manage-branch",



    //subscription
    companies: "/subscription/manage-companies",
    companiesGrid: "/subscription/manage-companies-grid",
    companyDetails: "/subscription/company-details",
    membershipplan: "/subscription/membership-plans",
    membershipAddon: "/subscription/membership-addons",
    membershipTransaction: "/subscription/membership-transactions",

    //hrms
    deleteRequest: "/hrms/delete-request",
    rolesPermissions: "/hrms/roles-permissions",
    manageStaff: "/hrms/manage-staff",
    permissions: "/hrms/permissions",
    staffDetails: "/hrms/staff-details/:staffId",
    attendanceLog: "/hrms/attendance",
    staffmanage: "/hrms/staff-manage",
    managebyday:"/hrms/manage-by-day",
    minicalender:"/hrms/minicalender",
    payroll:"/hrms/payroll",

    //sales
    leads: "/sales/leads",
    leadsKanban: "/sales/leads-kanban",
    leadsDetails: "/sales/leads-details/:leadId",
    upcomingAppointments: "/upcoming-appointments",
    upcomingCalls: "/upcoming-calls",

    //customer
    customers: "/customer/customers",
    customerList: "/customer/customer-list",
    customerGrid: "/customer/customer-grid",
    customerDetails: "/customer/customer-details",

    //task
    tasks: "/task/tasks",
    taskDetails: "/task/task-details/:taskId",

    //vendors
    vendors: "/vendors/vendors",
    vendorDetails: "/vendors/vendor-details/:vendorId",

    //expenses
    expense: "/expense/expenses",
    expenseDetails: "/expense/expense-details/:expenseId",

    //paid expense
    paidExpense: "expense/paid-expenses",


    //setting / general setting
    connectedApps: "/setting/general-settings/connected-apps",
    notification: "/setting/general-settings/notification",
    profile: "/setting/general-settings/profile",
    security: "/setting/general-settings/security",

    //setting / website settings
    appearance: "/setting/website-settings/appearance",
    companySettings: "/setting/website-settings/company-settings",
    language: "/setting/website-settings/language",
    localization: "/setting/website-settings/localization",
    preference: "/setting/website-settings/preference",
    prefixes: "/setting/website-settings/prefixes",
    languageWeb: "/setting/website-settings/language-web",

    // setting / app settings
    customFields: "/setting/app-settings/custom-fields",
    invoiceSettings: "/setting/app-settings/invoice-settings",
    printers: "/setting/app-settings/printers",

    // setting / system settings
    emailSettings: "/setting/system-settings/email",
    gdprCookies: "/setting/system-settings/gdpr-cookies",
    smsGateways: "/setting/system-settings/sms-gateways",

    // setting / financial settings
    bankAccounts: "/setting/financial-settings/bank-account",
    currencies: "/setting/financial-settings/currencies",
    paymentGateways: "/setting/financial-settings/payment-gateways",
    taxRates: "/setting/financial-settings/tax-rates",
    // bankAccounts: "/bank-accounts",

    //setting / other settings
    banIpAddrress: "/setting/other-settings/ban-ip-address",
    storage: "/setting/other-settings/storage",

    // setting / master
    // source: "/setting/masters/source",
    // contactStage: "/setting/masters/contact-stage",
    // industry: "/setting/masters/industry",
    // calls: "/setting/masters/calls",
    // lostReason: "/setting/masters/lost-reason",

    //setup / staff-master
    department: "/setup/staff-master/department",
    role: "/setup/staff-master/role",
    leadFor: "/setup/staff-master/leadFor",
    service: "/setup/staff-master/service",
    group: "/setup/staff-master/group",
    jobType: "/setup/staff-master/job-type",
    workShift: "/setup/staff-master/work-shift",

    //setup / sales-master
    source: "/setup/sales-master/source",
    industry: "/setup/sales-master/industry",
    category: "/setup/sales-master/category",
    reasons: "/setup/sales-master/reasons",
    stage: "/setup/sales-master/stage",
    facebookToken: "/setup/sales-master/facebook-token",

    //setup/ vendor-master
    vendorCategory: '/setup/vendor-master/vendor-category',
    vendorSubCategory: '/setup/vendor-master/vendor-sub-category',

    //setup / task-master
    taskCategory: "/setup/task-master/task-category",
    taskSubCategory: "/setup/task-master/task-sub-category",

    // setup / product-master
    productCategory: "/setup/product-master/product-category",
    productSubCategory: "/setup/product-master/product-sub-category",
    productS_SubCategory: "/setup/product-master/product-sub-sub-category",
    productBrands: "/setup/product-master/product-brands",
    productOEM: "/setup/product-master/product-oem",
    
    // setup / services-master
    serviceCategory: "/setup/services-master/service-category",
    serviceSubCategory: "/setup/services-master/service-sub-category",
    serviceS_SubCategory: "/setup/services-master/service-sub-sub-category",

    // setup / supportCRM-master
    supportCategory: "/setup/support-master/support-category",
    supportSubCategory: "/setup/support-master/support-sub-category",

    // setup / grade-master
    grade: "/setup/grade-master/grade",

    //invoice
    invoice: "/invoice",
    invoiceDetails: "/invoice-details/:invoiceId",

    //payments
    payment: "/payments",
    paymentDetails: "/payments-details/:paymentId",

    //support routes
    contactMessages: "/support/contact-messages",
    ticketStage: "/support/ticket-stage",
    manegeTicket: "/support/manage-ticket",
    ticketDetails: "/support/ticket-details",
    progressTicket: "/support/progress-ticket",
    closedTicket: "/support/closed-ticket",

    // application routes
    todo: "/application/todo",
    email: "/application/email",
    videoCall: "/application/video-call",
    chat: "/application/chat",
    audioCall: "/application/audio-call",
    callHistory: "/application/call-history",
    fileManager: "/application/file-manager",
    calendar: "/application/calendar",
    notes: "/application/notes",

    //Marketing / Deals
    deals: "/marketing/deals",
    dealsDetails: "/marketing/deals-details",
    dealsKanban: "/marketing/deals-kanban",
    campaign: "/marketing/campaign",

    //crm routes
    teams: "/crm/teams",
    targets: "/crm/targets",
    activityCalls: "/crm/activity-calls",
    activityMail: "/crm/activity-mail",
    activityTask: "/crm/activity-task",
    activityMeeting: "/crm/activity-meeting",
    activities: "/crm/activities",
    payments: "/crm/payments",

    tasksImportant: "/crm/tasks-important",
    tasksCompleted: "/crm/tasks-completed",
    campaignComplete: "/crm/campaign-complete",
    campaignArchieve: "/crm/campaign-archieve",
    addCampaign: "/crm/addCampaign",
    analytics: "/crm/analytics",

    appointment: "/crm/schedule-appointment",

    pipeline: "/crm/pipeline",
    projects: "/crm/projects",

    projectDetails: "/crm/project-details",

    // companiesGrid: "/crm/companies-grid",
    compaignComplete: "/crm/compaign-complete",

    projectsGrid: "/projects-grid",
    ProposalsList: "/crm/proposals-list",
    ProposalsGrid: "/crm/proposals-grid",
    ProposalsView: "/crm/proposals-view",
    ContractsList: "/crm/contracts-list",
    ContractsGrid: "/crm/contracts-grid",
    InvoiceList: "/crm/invoice-list",
    InvoiceGrid: "/crm/invoice-grid",
    estimationList: "/crm/estimation-list",
    estimationKanban: "/crm/estimation-kanban",

    blankPage: "/blank-page",
    dataTables: "/data-tables",
    tablesBasic: "/tables-basic",
    comingSoon: "/coming-soon",

    // auth routes routes
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    twoStepVerification: "/two-step-verification",
    success: "/success",
    emailVerification: "/email-verification",
    lockScreen: "/lock-screen",
    resetPassword: "/reset-password",

    // pages routes
    error404: "/error-404",
    error500: "/error-500",
    underMaintenance: "/under-maintenance",

    // settings routes

    // reports routes
    companyReports: "/reports/company-reports",
    contactReports: "/reports/contact-reports",
    dealReports: "/reports/deal-reports",
    leadReports: "/reports/lead-reports",
    projectReports: "/reports/project-reports",
    taskReports: "/reports/task-reports",

    //content routes
    pages: "/content/pages",
    cities: "/content/cities",
    states: "/content/states",
    testimonials: "/content/testimonials",
    countries: "/content/countries",
    faq: "/content/faq",
    salesReports: "/report/sales-report",
    salesReportsData: "/report/sales-report-data",
    reports: "/reports",
    salesReport: "/report/sales",
    accountReport: "/report/account",
    leadReport: "/report/lead",
    staffReport: "/report/staff",

    //userManagement routes
    // deleteRequest: "/user-management/delete-request",
    // rolesPermissions: "/user-management/roles-permissions",
    // manageusers: "/user-management/manage-users",
    // permissions: "/user-management/permissions",


    // Ai Add On
    Aichatbot:"Ai-AddOn/AiChatbot",
    chatbot:"Ai-AddOn/Chatbot"

};
