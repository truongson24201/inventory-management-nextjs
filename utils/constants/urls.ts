export const enum HomeUrls {
    Home = "/",
    StaffLogin = "/staff-login/",
    AdminLogin = "/admin-login/",
    ClientLogin = "/client-login/",
    Homestays = "homestays/",
    Invoices = "invoices/",
    Tourists = "tourist/",
    Reports = "reports/",
}

const staffBasePath = "/staff-dashboard/";
export const enum staffUrls {
    Home = staffBasePath,
    Products = staffBasePath + "products/",
}

const adminBasePath = "/admin-dashboard/";
const clientBasePath = "/client-dashboard/";

export const enum adminUrls {
    Home = adminBasePath,
    Accounts = adminBasePath + "accounts/",
    Branches = adminBasePath + "branches/",
    Homestays = adminBasePath + "homestays/",
    Facilities = adminBasePath + "facilities/",
    Tourist = adminBasePath + "tourist/",
    Prices = adminBasePath + "prices/",
    Invoices = adminBasePath + "invoices/",
    Calendar = adminBasePath + "calendar/",
    Reports = adminBasePath + "reports/",
}

export const enum clientUrls {
    Home = "",
    Public = clientBasePath + "public/",
    booking = clientBasePath + "booking/",
    Invoices = clientBasePath + "invoices/",
    Facilities = clientBasePath + "facilities/",
    Tourist = clientBasePath + "tourist/",
    Reports = clientBasePath + "reports/",
}