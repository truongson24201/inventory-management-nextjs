export const enum HomeUrls {
    Home = "/",
    StaffLogin = "/staff-login/",
    AdminLogin = "/admin-login/",
}

const staffBasePath = "/staff-dashboard/";
export const enum staffUrls {
    Home = staffBasePath,
    Products = staffBasePath + "products/",
}

const adminBasePath = "/admin-dashboard/";
export const enum adminUrls {
    Home = adminBasePath,
    Accounts = adminBasePath + "accounts/",
    Branches = adminBasePath + "branches/",
    Homestays = adminBasePath + "homestays/",
    Facilities = adminBasePath + "facilities/",
    Tourist = adminBasePath + "tourist/",
    Prices = adminBasePath + "prices/",
    Reports = adminBasePath + "reports/",
}