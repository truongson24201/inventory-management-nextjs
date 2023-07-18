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
    {icon: 'boxes-stacked', url: adminUrls.Homestays, text: "Homestays"}, 
    {icon: 'handshake-angle', url: adminUrls.Facilities, text: "Facilities"}, 
    {icon: 'warehouse', url: adminUrls.Tourist, text: "Tourist"}, 
    {icon: 'truck-field', url: adminUrls.Prices, text: "Prices"}, 
    {icon: 'chart-simple', url: adminUrls.Reports, text: "Reports"}, 

]

export const userNavs = [
    {icon: 'right-from-bracket', func: () => {}, text: "Log out"},
]