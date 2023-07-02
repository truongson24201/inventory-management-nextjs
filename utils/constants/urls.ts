export const enum HomeUrls {
    Home = "/",
    StaffLogin = "/staff-log-in/",
    AdminLogin = "/admin-log-in/",
}

const staffBasePath = "/staff-dashboard/";
export const enum staffUrls {
    Home = staffBasePath,
    Products = staffBasePath + "products/",
}

const adminBasePath = "/admin-dashboard/";
export const enum adminUrls {
    Home = adminBasePath,
    Products = adminBasePath + "products/",
    ProductCategories = adminBasePath + "product-categories",
    Customers = adminBasePath + "customers/",
    Warehouses = adminBasePath + "warehouses/",
    Suppliers = adminBasePath + "suppliers/",
    Branches = adminBasePath + "branches/",
    Users = adminBasePath + "users/",
}