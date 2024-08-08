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
    {icon: 'file-lines', url: adminUrls.Menu, text: "Menu"}, 
    {icon: 'tree-city', url: adminUrls.Reservation, text: "Reservation"}, 
    {icon: 'kitchen-set', url: adminUrls.TableHistory, text: "Table History"}, 
    {icon: 'umbrella-beach', url: adminUrls.Feedback, text: "Feedback"}, 
    {icon: 'hand-holding-dollar', url: adminUrls.Prices, text: "Prices"},
    {icon: 'file-invoice-dollar', url: adminUrls.Invoices, text: "Invoices"}, 
    {icon: 'calendar-days', url: adminUrls.Calendar, text: "Calendar"},
    {icon: 'chart-simple', url: adminUrls.Reports, text: "Reports"}, 

]

export const clientNav = [
    {icon: 'house', url: adminUrls.Home, text: "Home"},
    {icon: 'building', url: adminUrls.Reservation, text: "blog"}, 
    {icon: 'umbrella-beach', url: adminUrls.TableHistory, text: "Tourist"}, 
    {icon: 'user', url: adminUrls.Accounts, text: "contact"}, 
    {icon: 'file-invoice-dollar', url: adminUrls.Invoices, text: "Invoices"}, 
    {icon: 'chart-simple', url: adminUrls.Reports, text: "Reports"}, 

]

export const userNavs = [
    {icon: 'right-from-bracket', func: () => {}, text: "Log out"},
]