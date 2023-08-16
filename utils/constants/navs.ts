import { adminUrls, staffUrls } from "./urls";
 

export const enum NavType {
    Link,
    Func,
}

export interface ILinkNavType {
    icon: string,
    url: string,
    text: string
}

export interface IFuncNavType {
    icon: string,
    func: () => {},
    text: string,
}

export const staffNavs = [
    {icon: 'house', url: staffUrls.Products, text: "My room"}, 
]

export const adminNavs = [
    {icon: 'house', url: adminUrls.Home, text: "Home"}, 
    {icon: 'user', url: adminUrls.Accounts, text: "Accounts"}, 
    {icon: 'building', url: adminUrls.Branches, text: "Branches"}, 
    {icon: 'tree-city', url: adminUrls.Homestays, text: "Homestays"}, 
    {icon: 'kitchen-set', url: adminUrls.Facilities, text: "Facilities"}, 
    {icon: 'umbrella-beach', url: adminUrls.Tourist, text: "Tourist"}, 
    {icon: 'hand-holding-dollar', url: adminUrls.Prices, text: "Prices"},
    {icon: 'file-invoice-dollar', url: adminUrls.Invoices, text: "Invoices"}, 
    {icon: 'calendar-days', url: adminUrls.Calendar, text: "Calendar"},
    {icon: 'chart-simple', url: adminUrls.Reports, text: "Reports"}, 

]

export const clientNav = [
    {icon: 'house', url: adminUrls.Home, text: "Home"},
    {icon: 'building', url: adminUrls.Branches, text: "blog"}, 
    {icon: 'umbrella-beach', url: adminUrls.Tourist, text: "Tourist"}, 
    {icon: 'user', url: adminUrls.Accounts, text: "contact"}, 
    {icon: 'file-invoice-dollar', url: adminUrls.Invoices, text: "Invoices"}, 
    {icon: 'chart-simple', url: adminUrls.Reports, text: "Reports"}, 

]

export const userNavs = [
    {icon: 'right-from-bracket', func: () => {}, text: "Log out"},
]