export const enum HomeUrls {
    Home = "/",
    StaffLogin = "staff-log-in/",
}

const staffBasePath = "staff-dashboard/";
export const enum staffUrls {
    Home = staffBasePath,
    Products = staffBasePath + "products/",
}

const adminBasePath = "/admin-dashboard/";
export const enum adminUrls {
    Home = adminBasePath,
    Products = adminBasePath + "products/",
}