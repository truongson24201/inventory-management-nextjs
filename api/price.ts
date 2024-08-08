import axios from "./axios.config";
import { IHomestayResponse } from "./homestay";
import { IPriceMenuItemView, IPriceView } from "./response";

const apiPrefix = "/prices";

export interface IPricesResponse {
    pricelistId : number,
    effectiveDate:string,
    updateOn?: string,
    updateBy?:string,
}

export interface IHomesPricesResponse {
    homestayId:number,
    pricelistId : number,
    name:string,
    numPeople:number,
    effectiveDate:string,
    price:number,
    status:string,
}

export const getPriceList = (branchId:number) =>{
    return axios.get<IPricesResponse[]>(`${apiPrefix}`,{
        params:{"id":branchId}
    });
}

export const getPriceDetails = (id:number) =>{
    return axios.get<IPricesResponse>(`${apiPrefix}/${id}`)
}

export const getHomesInOfPrice = (id:number) => {
    return axios.get<IHomesPricesResponse[]>(`${apiPrefix}/${id}/homestays`);
}

export const getHomesCombobox = (id:number) => {
    return axios.get<IHomesPricesResponse[]>(`${apiPrefix}/${id}/combobox`);
}

export const createPrice = (id:number, date:string) => {
    const effectiveDate = new Date(date);
    return axios.post<IPricesResponse>(`${apiPrefix}/${id}`, effectiveDate);
}

export const updatePrice = (id:number, date:string) => {
    const effectiveDate = new Date(date);
    return axios.put<IPricesResponse>(`${apiPrefix}/${id}`, effectiveDate);
} 

export const removePrice = (id:number) => {
    return axios.delete(`${apiPrefix}/${id}`);
}

// export const addHomestayInOf = (id:number, homestayId:number, price:number) => {
//     return axios.post<IHomesPricesResponse>(`${apiPrefix}/${id}/homestays`, {homestayId,price}) 
// }


export const addHomestayInOf = (id:number, homestayId:number[], price:number) => {
    return axios.post<IHomesPricesResponse[]>(`${apiPrefix}/${id}/homestays`, {homestayId,price}) 
}


export const removeHomestayOutOf = (id:number,homestayId:number) => {
    return axios.delete<IHomesPricesResponse>(`${apiPrefix}/${id}/homestays/${homestayId}`)
}

export const refreshAllPrices = () =>{
    return axios.put(`${apiPrefix}/refresh`);
 }



// newwwwwwwwwwwwwwwww
 
 export const getTicketByDateRegis = (date:string) =>{
    return axios.get<IPriceView>(`${apiPrefix}/ticket/by-date-regis`,{
        params:{date}
    });
 }

 export const getByMenuItemById = (menuItemId:number) =>{
    return axios.get<IPriceMenuItemView[]>(`${apiPrefix}/menu-item/all-by-id`,{
        params:{menuItemId}
    });
 }

 export const createPriceMenuItem = (priceMenuItemId:number | null,price:number,applicationDate:string,menuItemId:number) =>{
    return axios.post<IPriceMenuItemView>(`${apiPrefix}/menu-item/create`,{
        priceMenuItemId,
        price,
        applicationDate,
        menuItemId
    });
 }

 export const updatePriceMenuItem = (priceMenuItemId:number | null,price:number,applicationDate:string,menuItemId:number) =>{
    return axios.put<IPriceMenuItemView>(`${apiPrefix}/menu-item/update`,{
        priceMenuItemId,
        price,
        applicationDate,
        menuItemId
    });
 }

 export const deletePriceMenuItem = (id:number) =>{
    return axios.delete<IPriceMenuItemView>(`${apiPrefix}/menu-item/delete`,{
        params: {id}
    });
 }

 
